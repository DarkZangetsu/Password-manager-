const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Changé ici - plus de destructuring
const MotDePasse = require('../models/MotDePasse');

// Login pour utilisateurs normaux (utilisant MotDePasse)
// Login pour utilisateurs normaux (utilisant MotDePasse)
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Recherche dans la table MotDePasse
        const motDePasseEntry = await MotDePasse.findOne({ 
            where: { 
                nom_utilisateur: username 
            }
        });
        
        // Vérification du mot de passe et de l'existence de l'entrée
        if (!motDePasseEntry) {
            return res.status(401).json({ message: 'Identifiants utilisateur invalides' });
        }

        // Comparaison directe des mots de passe en texte clair
        if (password !== motDePasseEntry.mot_de_passe) {
            return res.status(401).json({ message: 'Identifiants utilisateur invalides' });
        }

        // Mise à jour de la dernière utilisation
        await motDePasseEntry.update({
            derniere_utilisation: new Date()
        });

        // Création du token
        const token = jwt.sign(
            { 
                id: motDePasseEntry.id,
                username: motDePasseEntry.nom_utilisateur,
                role: 'user'
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            token,
            user: {
                id: motDePasseEntry.id,
                username: motDePasseEntry.nom_utilisateur,
                role: 'user'
            }
        });
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// Login pour administrateurs (utilisant User)
exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Vérification que username et password sont fournis
        if (!username || !password) {
            return res.status(400).json({ message: 'Username et password requis' });
        }

        // Recherche dans la table User
        const admin = await User.findOne({ 
            where: { 
                username: username,
                is_staff: true 
            }
        });

        // Vérification de l'existence de l'admin
        if (!admin) {
            return res.status(401).json({ message: 'Identifiants administrateur invalides' });
        }

        // Vérification du mot de passe
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Identifiants administrateur invalides' });
        }

        const token = jwt.sign(
            { 
                id: admin.id,
                username: admin.username,
                role: 'admin'
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            token,
            user: {
                id: admin.id,
                username: admin.username,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};



exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: 'Nom d utilisateur déjà pris' });
    }

    // Créez un nouvel utilisateur avec is_staff défini sur true
    const newUser = await User.create({
        username,
        password, // Le mot de passe sera haché par le hook beforeCreate
        email,
        is_staff: true, // Assignez is_staff à true par défaut
    });

    // Ne pas renvoyer le mot de passe dans la réponse
    res.status(201).json({ id: newUser.id, username: newUser.username, is_staff: newUser.is_staff });
};
