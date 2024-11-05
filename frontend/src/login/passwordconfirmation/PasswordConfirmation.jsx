/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PasswordConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const response = await axios.get(`/api/mots-de-passe/${id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPassword(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération du mot de passe");
      }
    };

    if (id) {
      fetchPassword();
    }
  }, [id]);

  const handleConfirmation = async () => {
    try {
      await axios.post(`/api/mots-de-passe/${id}/marquer_utilise/`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/user/passwords');
    } catch (err) {
      setError("Erreur lors de la confirmation d'utilisation");
    }
  };

  if (!password) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6">
            <div className="text-center">Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Confirmation du Mot de Passe</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-semibold">Service:</div>
            <div>{password.titre}</div>
            
            <div className="font-semibold">Nom d'utilisateur:</div>
            <div>{password.nom_utilisateur}</div>
            
            <div className="font-semibold">URL:</div>
            <div>{password.url || 'Non spécifié'}</div>
            
            <div className="font-semibold">Créé le:</div>
            <div>{new Date(password.date_creation).toLocaleDateString()}</div>
            
            <div className="font-semibold">Expire le:</div>
            <div>
              {password.date_expiration 
                ? new Date(password.date_expiration).toLocaleDateString()
                : 'Pas de date d\'expiration'}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
              <div className="font-semibold">Erreur</div>
              <div>{error}</div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
          <button 
            onClick={() => navigate('/user/passwords')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Retour
          </button>
          <button 
            onClick={handleConfirmation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Confirmer l'utilisation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmation;