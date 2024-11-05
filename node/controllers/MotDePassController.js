const { Op } = require('sequelize');
const MotDePasse = require('../models/MotDePasse');
const HistoriqueAcces = require('../models/HistoriqueAcces');
const { User } = require('../models/User');

exports.create = async (req, res) => {
    const motDePasse = await MotDePasse.create({ ...req.body, utilisateurId: req.user.id });
    await HistoriqueAcces.create({ motDePasseId: motDePasse.id, action: 'modification' });
    res.status(201).json(motDePasse);
};

exports.update = async (req, res) => {
    const motDePasse = await MotDePasse.findOne({ where: { id: req.params.id, utilisateurId: req.user.id } });
    if (!motDePasse) return res.status(404).json({ message: 'Mot de passe non trouvé' });

    await motDePasse.update(req.body);
    await HistoriqueAcces.create({ motDePasseId: motDePasse.id, action: 'modification' });
    res.json(motDePasse);
};

exports.delete = async (req, res) => {
    const motDePasse = await MotDePasse.findOne({ where: { id: req.params.id, utilisateurId: req.user.id } });
    if (!motDePasse) return res.status(404).json({ message: 'Mot de passe non trouvé' });

    await HistoriqueAcces.create({ motDePasseId: motDePasse.id, action: 'suppression' });
    await motDePasse.destroy();
    res.status(204).send();
};

exports.markAsUsed = async (req, res) => {
    const motDePasse = await MotDePasse.findOne({ where: { id: req.params.id, utilisateurId: req.user.id } });
    if (!motDePasse) return res.status(404).json({ message: 'Mot de passe non trouvé' });

    motDePasse.derniere_utilisation = new Date();
    await motDePasse.save();

    await HistoriqueAcces.create({ motDePasseId: motDePasse.id, action: 'consultation' });
    res.json({ message: 'Mot de passe marqué comme utilisé', derniere_utilisation: motDePasse.derniere_utilisation });
};

// Nouvelle méthode pour récupérer tous les mots de passe
exports.getAll = async (req, res) => {
    try {
        const motsDePasse = await MotDePasse.findAll({ where: { utilisateurId: req.user.id } });
        res.json(motsDePasse);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des mots de passe' });
    }
};

// Nouvelle méthode pour récupérer un mot de passe par ID
exports.getById = async (req, res) => {
    try {
        const motDePasse = await MotDePasse.findOne({ where: { id: req.params.id, utilisateurId: req.user.id } });
        if (!motDePasse) return res.status(404).json({ message: 'Mot de passe non trouvé' });
        res.json(motDePasse);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du mot de passe' });
    }
};
