/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configuration d'axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register/', credentials);
      if (response.data) {
        // Redirige l'utilisateur après une inscription réussie
        navigate('/login');
      }
    } catch (err) {
      setError('Erreur lors de l inscription, veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl text-center font-semibold">
            Inscription
          </h1>
        </div>

        <div className="p-6">
          {/* Registration Form */}
          <form onSubmit={handleRegistration} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={credentials.username}
                onChange={(e) => setCredentials({
                  ...credentials,
                  username: e.target.value
                })}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={credentials.email}
                onChange={(e) => setCredentials({
                  ...credentials,
                  email: e.target.value
                })}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              S'inscrire
            </button>
          </form>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
