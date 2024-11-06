/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2, Info } from 'lucide-react';

const InputField = React.memo(({ icon: Icon, type, placeholder, value, onChange, error, showPassword, onTogglePassword }) => (
  <div className="space-y-2">
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={20} />
      </div>
      <input
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <Info size={14} />
        {error}
      </p>
    )}
  </div>
));

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastLoginAttempt, setLastLoginAttempt] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        const timeLeft = Math.ceil((lastLoginAttempt + 5 * 60 * 1000 - Date.now()) / 1000);
        if (timeLeft <= 0) {
          setIsLocked(false);
          setLoginAttempts(0);
          clearInterval(timer);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lastLoginAttempt]);

  const validateForm = () => {
    const errors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      errors.username = "Le nom d'utilisateur est requis";
      isValid = false;
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 1) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Compte temporairement bloqué. Réessayez dans ${Math.ceil(remainingTime / 60)} minutes.`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/auth/login/${activeTab}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setLoginAttempts(0);
        navigate(activeTab === 'admin' ? '/admin/dashboard' : '/user/interface');
      } else {
        throw new Error();
      }
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLastLoginAttempt(Date.now());
        setError('Trop de tentatives de connexion. Compte bloqué pendant 5 minutes.');
      } else {
        setError(`Identifiants ${activeTab === 'admin' ? 'administrateur' : 'utilisateur'} invalides (${5 - newAttempts} tentatives restantes)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setUsername('');
    setPassword('');
    setFormErrors({ username: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Gestionnaire de Mots de Passe
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8 bg-gray-50 p-1 rounded-lg">
            {['admin', 'user'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab 
                    ? 'bg-white shadow-md text-blue-600 scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <InputField
              icon={User}
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormErrors(prev => ({ ...prev, username: '' }));
              }}
              error={formErrors.username}
            />
            <InputField
              icon={Lock}
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors(prev => ({ ...prev, password: '' }));
              }}
              error={formErrors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium 
                shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;