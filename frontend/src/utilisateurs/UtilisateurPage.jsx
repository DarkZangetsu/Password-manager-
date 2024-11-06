/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Camera, Mail, MapPin, Briefcase, Calendar, Edit, Link as LinkIcon } from 'lucide-react';

export default function UtilisateurPage() {
  const [activeTab, setActiveTab] = useState('apercu');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête du profil */}
        <div className="relative">
          {/* Image de couverture */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-xl">
            <button className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 flex items-center text-sm">
              <Camera className="w-4 h-4 mr-2" />
              Modifier la couverture
            </button>
          </div>

          {/* Section profil */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              <div className="relative -mt-16">
                {/* Avatar personnalisé */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-200">
                  <img 
                    src="/api/placeholder/150/150" 
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 sm:mt-0 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jean Pierre</h1>
                    <p className="text-gray-500">@jeanpierre</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Éditer le profil
                  </button>
                </div>
              </div>
            </div>

            {/* Informations du profil */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center text-gray-600">
                <Briefcase className="w-5 h-5 mr-2" />
                Développeur Senior
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                Paris, France
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                jean@example.com
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                Inscrit en 2024
              </div>
            </div>
          </div>
        </div>

        {/* Onglets personnalisés */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {['apercu', 'projets', 'activite'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 relative ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="mt-6">
          {activeTab === 'apercu' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">À propos</h2>
                  <p className="text-gray-600">
                    Développeur passionné avec plus de 5 ans d'expérience en développement web.
                    Spécialisé en React, Node.js et architecture cloud.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Publications récentes</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((post) => (
                      <div key={post} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium">Publication {post}</h3>
                        <p className="text-gray-600 mt-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barre latérale */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Liens</h2>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Portfolio
                    </a>
                    <a href="#" className="flex items-center text-blue-600 hover:underline">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Compétences</h2>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'AWS'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((project) => (
                <div key={project} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold">Projet {project}</h3>
                  <p className="text-gray-600 mt-2">
                    Description du projet et technologies utilisées.
                  </p>
                  <button className="mt-4 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                    Voir le projet
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activite' && (
            <div className="space-y-6">
              {[1, 2, 3].map((activity) => (
                <div key={activity} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                    <div>
                      <h3 className="font-medium">Activité {activity}</h3>
                      <p className="text-gray-600 mt-1">
                        Description de l'activité récente.
                      </p>
                      <span className="text-sm text-gray-500 mt-2 block">
                        Il y a {activity} jour{activity > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}