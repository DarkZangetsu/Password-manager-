const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const MotDePasse = sequelize.define('MotDePasse', {
    titre: DataTypes.STRING,
    nom_utilisateur: DataTypes.STRING,
    mot_de_passe: DataTypes.STRING,
    url: DataTypes.STRING,
    notes: DataTypes.TEXT,
    date_expiration: DataTypes.DATE,
    derniere_utilisation: DataTypes.DATE,
}, {
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
});

MotDePasse.belongsTo(User, { foreignKey: 'utilisateurId' });
User.hasMany(MotDePasse, { foreignKey: 'utilisateurId' });

module.exports = MotDePasse;
