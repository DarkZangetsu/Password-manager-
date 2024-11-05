/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assurez-vous d'importer le contexte d'authentification

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Vérifiez si l'utilisateur est authentifié et admin
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
