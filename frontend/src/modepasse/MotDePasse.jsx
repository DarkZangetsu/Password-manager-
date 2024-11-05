/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Lock, ExternalLink, Calendar, FileText, Copy, Eye, EyeOff } from 'lucide-react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

const MotDePasse = () => {
  const [motDePasse, setMotDePasse] = useState([]);
  const [formData, setFormData] = useState({ 
    titre: '', 
    nom_utilisateur: '', 
    mot_de_passe: '', 
    url: '', 
    notes: '', 
    date_expiration: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState('create');
  const [selectedId, setSelectedId] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    fetchMotDePasse();
  }, []);

  const filteredPasswords = motDePasse.filter(mdp =>
    mdp.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mdp.nom_utilisateur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchMotDePasse = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/motsdepasse/');
      setMotDePasse(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des mots de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (action, id = null) => {
    setActionType(action);
    if (action === 'update' && id) {
      const motDePasseToUpdate = motDePasse.find(mdp => mdp.id === id);
      setFormData(motDePasseToUpdate);
      setSelectedId(id);
    } else {
      setFormData({ titre: '', nom_utilisateur: '', mot_de_passe: '', url: '', notes: '', date_expiration: '' });
      setSelectedId(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({ titre: '', nom_utilisateur: '', mot_de_passe: '', url: '', notes: '', date_expiration: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGeneratePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setFormData({ ...formData, mot_de_passe: generatedPassword });
    toast.success('Mot de passe généré !');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papier`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = actionType === 'create' ? 'POST' : 'PUT';
    const url = actionType === 'create' ? '/motsdepasse/' : `/motsdepasse/${selectedId}`;

    try {
      const response = await axios({
        method,
        url,
        data: formData,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Mot de passe ${actionType === 'create' ? 'ajouté' : 'modifié'} avec succès !`);
        fetchMotDePasse();
        handleCloseModal();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout/modification du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mot de passe ?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`/motsdepasse/${id}`);
        if (response.status === 204) {
          toast.success('Mot de passe supprimé avec succès !');
          fetchMotDePasse();
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression du mot de passe.');
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Gestionnaire de Mots de Passe</h1>
              <button 
                onClick={() => handleOpenModal('create')}
                className="flex items-center gap-2 px-4 py-2 bg-[#4B8B32] text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={16} />
                Nouveau mot de passe
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre ou nom d'utilisateur..."
                className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Titre</th>
                    <th className="text-left p-4 font-medium">Nom d'utilisateur</th>
                    <th className="text-left p-4 font-medium">Mot de passe</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8">
                        Chargement...
                      </td>
                    </tr>
                  ) : filteredPasswords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        Aucun mot de passe trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredPasswords.map(mdp => (
                      <tr key={mdp.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Lock size={16} className="text-gray-400" />
                            {mdp.titre}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span>{mdp.nom_utilisateur}</span>
                            <button
                              onClick={() => copyToClipboard(mdp.nom_utilisateur, "Nom d'utilisateur")}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input
                              type={showPassword[mdp.id] ? "text" : "password"}
                              value={mdp.mot_de_passe}
                              readOnly
                              className="w-40 p-2 border border-gray-200 rounded"
                            />
                            <button
                              onClick={() => togglePasswordVisibility(mdp.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {showPassword[mdp.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(mdp.mot_de_passe, "Mot de passe")}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal('update', mdp.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(mdp.id)}
                              className="p-1 hover:bg-gray-100 rounded text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-[500px] w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {actionType === 'create' ? 'Ajouter un mot de passe' : 'Modifier le mot de passe'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titre</label>
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom d'utilisateur</label>
                    <input
                      type="text"
                      name="nom_utilisateur"
                      value={formData.nom_utilisateur}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mot de passe</label>
                    <div className="flex gap-2">
                      <input
                        type={showPassword['form'] ? "text" : "password"}
                        name="mot_de_passe"
                        value={formData.mot_de_passe}
                        onChange={handleInputChange}
                        required
                        className="flex-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('form')}
                        className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50"
                      >
                        {showPassword['form'] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Générer
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.url && (
                        <button
                          type="button"
                          onClick={() => window.open(formData.url, '_blank')}
                          className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date d'expiration</label>
                    <input
                      type="date"
                      name="date_expiration"
                      value={formData.date_expiration}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-white bg-[#4B8B32] rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Chargement...' : actionType === 'create' ? 'Ajouter' : 'Modifier'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default MotDePasse;