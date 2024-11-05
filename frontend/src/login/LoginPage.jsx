/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState({
    admin: false,
    user: false
  });

  const [credentials, setCredentials] = useState({
    admin: { username: '', password: '' },
    user: { username: '', password: '' },
  });

  const handleLogin = async (e, type) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/auth/login/${type}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials[type]),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate(type === 'admin' ? '/admin/dashboard' : '/user/interface');
      } else {
        throw new Error();
      }
    } catch (err) {
      setError(`Identifiants ${type === 'admin' ? 'administrateur' : 'utilisateur'} invalides`);
    }
  };

  const handleChange = useCallback((type, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  }, []);

  const InputField = ({ icon: Icon, type, placeholder, value, onChange, showPassword, onTogglePassword }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={20} />
      </div>
      <input
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md opacity-0 translate-y-4 animate-[fadeIn_0.3s_ease-out_forwards]">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200
                    ${activeTab === tab 
                      ? 'bg-white shadow-md text-blue-600 scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => handleLogin(e, activeTab)} className="space-y-6">
              <InputField
                icon={User}
                type="text"
                placeholder="Nom d'utilisateur"
                value={credentials[activeTab].username}
                onChange={(e) => handleChange(activeTab, 'username', e.target.value)}
              />
              <InputField
                icon={Lock}
                type="password"
                placeholder="Mot de passe"
                value={credentials[activeTab].password}
                onChange={(e) => handleChange(activeTab, 'password', e.target.value)}
                showPassword={showPassword[activeTab]}
                onTogglePassword={() => setShowPassword(prev => ({ 
                  ...prev, 
                  [activeTab]: !prev[activeTab] 
                }))}
              />
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium 
                  shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Se connecter
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start gap-3 animate-[fadeIn_0.2s_ease-out]">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
