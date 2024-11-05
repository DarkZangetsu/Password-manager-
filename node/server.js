// Chargement des variables d'environnement
require('dotenv').config();

// Importation des modules nécessaires
const express = require('express');
const sequelize = require('./config/database'); // Connexion Sequelize
const authRoutes = require('./routes/auth'); // Routes d'authentification
const motDePasseRoutes = require('./routes/motDePasse'); // Routes de gestion des mots de passe
const cors = require('cors'); // Pour la gestion des accès CORS
const helmet = require('helmet'); // Pour la sécurité des en-têtes HTTP
const morgan = require('morgan'); // Pour le logging des requêtes HTTP

// Création de l'application Express
const app = express();

// Configuration CORS
const corsOptions = {
    origin: 'http://localhost:5173', // Autoriser uniquement cette origine
    credentials: true, // Permet d'envoyer des cookies ou des informations d'authentification
};

// Middlewares globaux
app.use(cors(corsOptions)); // Utiliser CORS avec les options spécifiées
app.use(express.json()); // Pour parser les corps de requêtes JSON
app.use(helmet()); // Pour sécuriser l'application avec des en-têtes HTTP
app.use(morgan('dev')); // Pour enregistrer les requêtes dans la console

// Routes de l'application
app.use('/auth', authRoutes); // Routes pour l'authentification
app.use('/motsdepasse', motDePasseRoutes); // Routes pour les mots de passe

// Route de test pour vérifier le bon fonctionnement du serveur
app.get('/', (req, res) => {
    res.send('Bienvenue dans l\'application de gestion de mots de passe');
});

// Connexion à la base de données et démarrage du serveur
sequelize.sync().then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}).catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
});
