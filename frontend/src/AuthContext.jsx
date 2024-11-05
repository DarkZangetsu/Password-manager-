/* eslint-disable react/prop-types */
import{ createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État de l'utilisateur, par défaut null

  const login = (userData) => {
    setUser(userData); // Définissez les données de l'utilisateur (incluant admin: true si c'est un admin)
  };

  const logout = () => {
    setUser(null); // Déconnecte l'utilisateur
  };

  const isAuthenticated = () => {
    return user !== null; // Vérifie si l'utilisateur est connecté
  };

  const isAdmin = () => {
    return user && user.admin; // Vérifie si l'utilisateur est admin
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
