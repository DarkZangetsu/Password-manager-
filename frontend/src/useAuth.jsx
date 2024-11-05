/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Création du contexte avec une valeur par défaut plus explicite
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

// Fonction decodeToken manquante dans votre code
const decodeToken = (token) => {
  try {
    // Vous devriez implémenter la logique de décodage du token ici
    // Par exemple avec jwt-decode ou une autre méthode
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Erreur de décodage du token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = decodeToken(token);
        if (userData) {
          setUser(userData);
        } else {
          // Si le décodage échoue, on nettoie le localStorage
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (token) => {
    try {
      const userData = decodeToken(token);
      if (!userData) throw new Error('Token invalide');
      
      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error; // Permet de gérer l'erreur dans le composant appelant
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return null; // Ou un composant de chargement
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé avec vérification
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};