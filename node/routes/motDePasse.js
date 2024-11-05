const express = require('express');
const router = express.Router();
const MotDePasseController = require('../controllers/MotDePassController');
const auth = require('../middlewares/auth');

// Appliquer le middleware d'authentification
router.use(auth);

// Routes pour les mots de passe
router.post('/', MotDePasseController.create);                 // Créer un nouveau mot de passe
router.get('/', MotDePasseController.getAll);                 // Récupérer tous les mots de passe
router.get('/:id', MotDePasseController.getById);             // Récupérer un mot de passe par ID
router.put('/:id', MotDePasseController.update);              // Mettre à jour un mot de passe
router.delete('/:id', MotDePasseController.delete);           // Supprimer un mot de passe
router.post('/:id/markAsUsed', MotDePasseController.markAsUsed); // Marquer un mot de passe comme utilisé

module.exports = router;
