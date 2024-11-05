// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Extraction du token depuis le header Authorization ou les cookies
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                 req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé - Token manquant' });
    }

    try {
        // Décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajout des informations utilisateur à la requête
        req.user = decoded;
        
        // Vérification des permissions basée sur le rôle
        const isAdminRoute = req.path.startsWith('/admin');
        const isUserRoute = req.path.startsWith('/user');
        
        if (isAdminRoute && decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Accès administrateur requis' });
        }
        
        if (isUserRoute && decoded.role !== 'user') {
            return res.status(403).json({ message: 'Accès utilisateur requis' });
        }

        next();
    } catch (error) {
        // Si l'erreur est liée à la validation du token
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expiré' });
        }
        
        // Pour toute autre erreur
        console.error('Erreur middleware auth:', error);
        return res.status(500).json({ message: 'Erreur serveur authentication' });
    }
};

module.exports = authMiddleware;