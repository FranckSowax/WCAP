import { useState } from 'react'
import { Save, Key, Users, Bell, CreditCard, Shield } from 'lucide-react'

const settingsTabs = [
  { id: 'wati', name: 'Intégration Wati.io', icon: Key },
  { id: 'team', name: 'Équipe', icon: Users },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'billing', name: 'Facturation', icon: CreditCard },
  { id: 'security', name: 'Sécurité', icon: Shield },
]

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('wati')
  const [watiConfig, setWatiConfig] = useState({
    apiKey: '',
    instanceId: '',
    webhookUrl: '',
    isConnected: false,
  })

  const handleSaveWatiConfig = () => {
    // Logique de sauvegarde de la configuration Wati.io
    console.log('Sauvegarde configuration Wati.io:', watiConfig)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wati':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Configuration Wati.io
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Connectez votre compte Wati.io pour envoyer des messages WhatsApp
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé API Wati.io
                </label>
                <input
                  type="password"
                  value={watiConfig.apiKey}
                  onChange={(e) => setWatiConfig({...watiConfig, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Votre clé API Wati.io"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID d'instance
                </label>
                <input
                  type="text"
                  value={watiConfig.instanceId}
                  onChange={(e) => setWatiConfig({...watiConfig, instanceId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Votre ID d'instance Wati.io"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Webhook
                </label>
                <input
                  type="url"
                  value={watiConfig.webhookUrl}
                  onChange={(e) => setWatiConfig({...watiConfig, webhookUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://votre-domaine.com/webhook"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Statut de la connexion
                  </h4>
                  <p className="text-sm text-gray-600">
                    {watiConfig.isConnected ? 'Connecté à Wati.io' : 'Non connecté'}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${watiConfig.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>

              <button
                onClick={handleSaveWatiConfig}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la configuration
              </button>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Gestion de l'équipe
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Gérez les membres de votre équipe et leurs permissions
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Membres de l'équipe</h4>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Admin Principal</h5>
                      <p className="text-sm text-gray-600">admin@exemple.com</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Super Admin
                    </span>
                  </div>
                </div>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Inviter un membre
                </button>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Préférences de notification
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Configurez vos notifications par email et dans l'application
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Nouvelles campagnes</h4>
                  <p className="text-sm text-gray-600">Recevoir des notifications pour les nouvelles campagnes</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Rapports hebdomadaires</h4>
                  <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire des performances</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Alertes système</h4>
                  <p className="text-sm text-gray-600">Recevoir des alertes en cas de problème</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Facturation et abonnement
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Gérez votre abonnement et vos méthodes de paiement
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Plan Starter</h4>
                  <p className="text-sm text-gray-600">75 000 XAF / mois</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 5 000 contacts</p>
                <p>• 10 000 messages par mois</p>
                <p>• 2 agents Wati.io</p>
                <p>• Support par email</p>
              </div>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                Mettre à niveau
              </button>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sécurité
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Configurez les paramètres de sécurité de votre compte
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Authentification à deux facteurs</h4>
                  <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
                </div>
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Configurer
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Sessions actives</h4>
                  <p className="text-sm text-gray-600">Gérez vos sessions de connexion</p>
                </div>
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Voir les sessions
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configurez votre compte et vos intégrations
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Navigation des onglets */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu de l'onglet */}
        <div className="flex-1 mt-6 lg:mt-0">
          <div className="bg-white shadow rounded-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
