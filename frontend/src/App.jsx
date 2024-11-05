import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PasswordConfirmation from './login/passwordconfirmation/PasswordConfirmation';
import LoginPage from './login/LoginPage';
import RegistrationPage from './register/RegistrationPage';
import Dashboard from './dashboard/Dashboard';
import MotDePasse from './modepasse/MotDePasse';
import Historique from './Historiques/Historique';
import UtilisateurPage from './utilisateurs/UtilisateurPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/confirm-password/:id" element={<PasswordConfirmation />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/motdepasse" element={<MotDePasse />} />
        <Route path="/admin/historique" element={<Historique />} />
        <Route path="/user/interface" element={<UtilisateurPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
