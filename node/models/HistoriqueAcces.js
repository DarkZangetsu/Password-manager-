const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MotDePasse = require('./MotDePasse');

const HistoriqueAcces = sequelize.define('HistoriqueAcces', {
    date_acces: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ip_adresse: DataTypes.STRING,
    appareil: DataTypes.STRING,
    action: {
        type: DataTypes.ENUM('consultation', 'modification', 'suppression'),
        defaultValue: 'consultation',
    },
});

HistoriqueAcces.belongsTo(MotDePasse, { foreignKey: 'motDePasseId' });
MotDePasse.hasMany(HistoriqueAcces, { foreignKey: 'motDePasseId' });

module.exports = HistoriqueAcces;
