// Attendre le chargement complet du DOM (Contrainte Étape 5)
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    // 1. Charger le meilleur film et récupérer son ID pour ne pas le dupliquer
    const bestMovieId = await displayBestMovie();
    
    // 2. Charger les grilles avec l'ID du meilleur film exclu
    await displayTopRatedMovies(bestMovieId);
    await displayCategory("Action", "category-1");
    await displayCategory("Sci-Fi", "category-2");
    
    // 3. Charger les sélecteurs de genre (Pour les 2 catégories dynamiques)
    await loadGenres("genre-select", "#category-dynamic .movies-grid");
    await loadGenres("genre-select-2", "#category-dynamic-2 .movies-grid");
    
    // 4. Activer les écouteurs pour les boutons "Voir plus"
    setupToggleButtons();
}

// ---------------------------
// Fonction générique pour remplir les grilles
// ---------------------------
function renderGrid(container, movies) {
    container.innerHTML = "";
    movies.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie-card");

        div.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}" onerror="this.src='https://picsum.photos/252/247'">
            <div class="movie-overlay">
                <span class="movie-title">${movie.title}</span>
                <button class="details-btn" data-id="${movie.id}">Détails</button>
            </div>
        `;
        container.appendChild(div);
    });

    // Lier l'événement de clic pour la modale
    container.querySelectorAll(".details-btn").forEach(btn => {
        btn.onclick = () => openModal(btn.dataset.id);
    });
}

// ---------------------------
// 1. Affichage du meilleur film (Vedette)
// ---------------------------
async function displayBestMovie() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score");
        const data = await response.json();
        const bestMovie = data.results[0];

        const img = document.getElementById("best-movie-img");
        const title = document.getElementById("best-movie-title");
        const desc = document.getElementById("best-movie-desc");

        img.src = bestMovie.image_url;
        img.onerror = () => img.src = "https://picsum.photos/300/400";
        title.textContent = bestMovie.title;

        const detailResponse = await fetch(`http://127.0.0.1:8000/api/v1/titles/${bestMovie.id}`);
        const detailMovie = await detailResponse.json();

        desc.textContent = detailMovie.long_description || detailMovie.description || "Résumé indisponible.";

        document.getElementById("best-movie-btn").onclick = () => {
            openModal(bestMovie.id);
        };
        
        return bestMovie.id; 
    } catch (error) {
        console.error("Erreur meilleur film:", error);
    }
}

// ---------------------------
// 2. Films les mieux notés
// ---------------------------
async function displayTopRatedMovies(bestMovieId) {
    const response = await fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7");
    const data = await response.json();

    const filteredMovies = data.results.filter(movie => movie.id !== bestMovieId).slice(0, 6);

    const container = document.querySelector("#top-rated .movies-grid");
    renderGrid(container, filteredMovies);
}

// ---------------------------
// 3. Affichage des catégories fixes
// ---------------------------
async function displayCategory(categoryName, sectionId) {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/titles/?genre=${categoryName}&sort_by=-imdb_score&page_size=6`);
    const data = await response.json();

    const section = document.getElementById(sectionId);
    section.querySelector("h2").textContent = categoryName;

    const container = section.querySelector(".movies-grid");
    renderGrid(container, data.results);
}

// ---------------------------
// 4. Chargement des genres dynamiques (Sélecteurs paramétrés)
// ---------------------------
async function loadGenres(selectId, gridSelector) {
    const response = await fetch("http://127.0.0.1:8000/api/v1/genres/");
    const data = await response.json();

    const select = document.getElementById(selectId);
    select.innerHTML = "";

    data.results.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.name;
        option.textContent = genre.name;
        select.appendChild(option);
    });

    if (select.value) {
        displayDynamicCategory(select.value, gridSelector);
    }

    select.onchange = () => {
        displayDynamicCategory(select.value, gridSelector);
    };
}

async function displayDynamicCategory(categoryName, gridSelector) {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/titles/?genre=${categoryName}&sort_by=-imdb_score&page_size=6`);
    const data = await response.json();

    const container = document.querySelector(gridSelector);
    renderGrid(container, data.results);

    container.classList.remove("expanded");
    const btn = container.nextElementSibling;
    if (btn && btn.classList.contains("toggle-btn")) {
        btn.textContent = "Voir plus";
    }
}

// ---------------------------
// 5. Gestion des boutons "Voir plus / Voir moins"
// ---------------------------
function setupToggleButtons() {
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.onclick = () => {
            const grid = btn.previousElementSibling;
            grid.classList.toggle("expanded");
            
            if (grid.classList.contains("expanded")) {
                btn.textContent = "Voir moins";
            } else {
                btn.textContent = "Voir plus";
            }
        };
    });
}

// ---------------------------
// 6. Gestion de la Fenêtre Modale
// ---------------------------
async function openModal(movieId) {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/titles/${movieId}`);
    const movie = await response.json();

    const modalImg = document.getElementById("modal-img");
        
        // On définit la source de l'image. 
        // On ajoute un timestamp (new Date().getTime()) pour éviter que le navigateur n'affiche l'image précédente en cache.
        modalImg.src = movie.image_url ? `${movie.image_url}?t=${new Date().getTime()}` : "https://picsum.photos/252/247";
        
        // Si l'image renvoyée par l'API est cassée, on charge une image de secours
        modalImg.onerror = () => { 
            modalImg.src = "https://picsum.photos/252/247"; 
        };

// Image et Titre (Ligne 1)
    document.getElementById("modal-img").src = movie.image_url || "https://picsum.photos/252/247";
    document.getElementById("modal-title").textContent = movie.title;
    
    // Ligne 2 : Année - Genres (ex: 1998 - Comedy, Crime, Sport)
    const movieYear = movie.date_published ? movie.date_published.split('-')[0] : (movie.year || "N/A");
    const movieGenres = movie.genres ? movie.genres.join(", ") : "N/A";
    document.getElementById("modal-year-genre").textContent = `${movieYear} - ${movieGenres}`;
    
    // Ligne 3 : Rated - Durée (Pays / Pays) (ex: PG-13 - 117 minutes (USA / UK))
    const rated = movie.rated || "Not Rated";
    const duration = movie.duration ? `${movie.duration} minutes` : "Durée inconnue";
    const countries = movie.countries ? movie.countries.join(" / ") : "N/A";
    document.getElementById("modal-rated-duration-country").textContent = `${rated} - ${duration} (${countries})`;
    
    // Ligne 4 : Score IMDB (ex: IMDB score: 8.1/10)
    document.getElementById("modal-imdb").textContent = `IMDB score: ${movie.imdb_score}/10`;
    
    // Ligne 5 : Recettes au box-office formatées en millions (ex: Recettes au box-office: $48.2m)
    let boxOfficeFormatted = "Inconnu";
    if (movie.worldwide_gross_income) {
        const income = movie.worldwide_gross_income;
        if (income >= 1000000) {
            boxOfficeFormatted = `$${(income / 1000000).toFixed(1)}m`;
        } else {
            boxOfficeFormatted = `$${income.toLocaleString()}`;
        }
    }
    document.getElementById("modal-boxoffice").textContent = `Recettes au box-office: ${boxOfficeFormatted}`;

    // Bloc 2 : Réalisateurs (Intitulé exact demandé)
    const directorsList = movie.directors ? movie.directors.join(", ") : "N/A";
    document.getElementById("modal-directors").innerHTML = `<strong>Réalisé par :</strong><br>${directorsList}`;

    // Bloc 3 : Description
    document.getElementById("modal-desc").textContent = movie.long_description || movie.description || "Aucun résumé disponible.";
    
    // Bloc 4 : Acteurs (Intitulé exact demandé)
    const actorsList = movie.actors ? movie.actors.join(", ") : "N/A";
    document.getElementById("modal-actors").innerHTML = `<strong>Avec :</strong><br>${actorsList}`;

    // Afficher la modale
    document.getElementById("modal").style.display = "flex";
}

// Fermeture de la modale
document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

window.onclick = (event) => {
    if (event.target.id === "modal") {
        document.getElementById("modal").style.display = "none";
    }
};