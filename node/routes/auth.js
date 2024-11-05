const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Route pour l'authentification de l'utilisateur
router.post('/login/user',AuthController.loginUser);

// Route pour l'authentification de l'administrateur
router.post('/login/admin', AuthController.loginAdmin);

router.post('/register', AuthController.register); // Nouvelle route pour l'inscription

module.exports = router;
