# JustStreamIt - Interface Utilisateur d'une Application Web

JustStreamIt est une application web de streaming (VOD) qui permet de visualiser en temps réel les classements des meilleurs films, catégories spécifiques et détails de films grâce à une intégration dynamique de données provenant d'une API locale (OCMovies-API).

Ce projet a été réalisé dans le cadre de la formation Développeur d'Application JavaScript / Intégrateur Web d'OpenClassrooms.

---

## 📱 Fonctionnalités

* **Sélection du Meilleur Film :** Affichage dynamique du film le mieux noté toutes catégories confondues avec son résumé.
* **Grilles Dynamiques par Catégorie :** Visualisation des films les mieux notés, d'une catégorie fixe (Action, Sci-Fi) et de catégories personnalisables par l'utilisateur via un menu déroulant.
* **Modale de Détails Complète :** Ouverture d'une fenêtre modale au clic sur un film affichant toutes les informations détaillées (acteurs, réalisateurs, box-office, description longue...) conformément aux maquettes Desktop, Tablette et Mobile.
* **Design 100% Responsive :** Interface optimisée pour s'adapter parfaitement aux écrans d'ordinateurs, de tablettes et de smartphones.

---

## 🛠️ Prérequis

Pour faire fonctionner ce projet sur votre machine, vous devez avoir installé :
* **Python 3.x**
* **Git**
* Un navigateur web moderne (Chrome, Firefox, Edge, etc.)

---

## 🚀 Installation et Lancement

### 1. Cloner et lancer l'API Locale (Backend)

L'application frontend dépend de cette API pour récupérer les données des films. Suivez ces étapes pour la lancer :

Ouvrez un terminal et clonez le dépôt de l'API :
```
git clone [https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git)

cd ocmovies-api-fr
```
### 2. Créez un environnement virtuel
```
Windows : python -m venv env

Mac/Linux : python3 -m venv env
```
### 3. Activez un environnement virtuel
```
Windows : env\Scripts\activate

Mac/Linux : source env/bin/activate
```
### 4. Installez les dépendances requises
```
pip install -r requirements.txt
```
### 5. Initialisez et alimentez la base de données (uniquement au premier lancement)
```
python manage.py create_db
```
### 6. Démarrez le serveur local
```
python manage.py runserver
```

### 2. Lancer l'Interface Utilisateur (Frontend)

Une fois que l'API tourne sur votre terminal (étape précédente active) :
```
Ouvrez le dossier de ce projet (JustStreamIt).
```
Lancez le fichier index.html :
```
Option A : Double-cliquez sur index.html pour l'ouvrir directement dans votre navigateur.

Option B (Recommandée) : Utilisez l'extension Live Server sur VS Code pour simuler un environnement de production.
```
### Structure du Projet
```
├── index.html        # Structure HTML5 du site
├── style.css         # Styles CSS3 (incluant le responsive fluide)
├── script.js         # Logique JavaScript (requêtes Fetch asynchrones, manipulation du DOM)
├── README.md         # Documentation du projet
└── images/           # Actifs graphiques et logos
```
