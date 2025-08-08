import { useState } from 'react'
import { Bot, Play, Pause, Settings, MessageSquare, Users, BarChart3 } from 'lucide-react'

const chatbotFlows = [
  {
    id: 1,
    name: 'Accueil Client',
    status: 'Actif',
    triggers: ['salut', 'bonjour', 'hello'],
    interactions: 1250,
    completionRate: 87,
    lastUpdated: '2025-08-07',
  },
  {
    id: 2,
    name: 'Support Technique',
    status: 'Actif',
    triggers: ['problème', 'aide', 'support'],
    interactions: 890,
    completionRate: 92,
    lastUpdated: '2025-08-06',
  },
  {
    id: 3,
    name: 'Commandes & Livraisons',
    status: 'Inactif',
    triggers: ['commande', 'livraison', 'suivi'],
    interactions: 0,
    completionRate: 0,
    lastUpdated: '2025-08-05',
  },
]

const recentConversations = [
  {
    id: 1,
    contact: 'Jean Dupont',
    phone: '+237123456789',
    flow: 'Accueil Client',
    status: 'Terminée',
    messages: 5,
    duration: '2 min',
    timestamp: '2025-08-07 14:30',
  },
  {
    id: 2,
    contact: 'Marie Kouam',
    phone: '+237987654321',
    flow: 'Support Technique',
    status: 'Escaladée',
    messages: 8,
    duration: '5 min',
    timestamp: '2025-08-07 14:15',
  },
  {
    id: 3,
    contact: 'Paul Mbarga',
    phone: '+237555666777',
    flow: 'Accueil Client',
    status: 'En cours',
    messages: 3,
    duration: '1 min',
    timestamp: '2025-08-07 14:00',
  },
]

export const ChatbotPage = () => {
  const [selectedFlow, setSelectedFlow] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800'
      case 'Inactif':
        return 'bg-gray-100 text-gray-800'
      case 'Terminée':
        return 'bg-blue-100 text-blue-800'
      case 'Escaladée':
        return 'bg-yellow-100 text-yellow-800'
      case 'En cours':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configurez et gérez vos flows d'automatisation WhatsApp
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
            <Bot className="h-4 w-4 mr-2" />
            Nouveau flow
          </button>
        </div>
      </div>

      {/* Statistiques du chatbot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Conversations</p>
              <p className="text-2xl font-semibold text-gray-900">2,140</p>
              <p className="text-sm text-green-600">+12% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisateurs uniques</p>
              <p className="text-2xl font-semibold text-gray-900">1,847</p>
              <p className="text-sm text-green-600">+8% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taux de résolution</p>
              <p className="text-2xl font-semibold text-gray-900">89.5%</p>
              <p className="text-sm text-green-600">+3% ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Flows actifs</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
              <p className="text-sm text-gray-500">sur 3 total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flows du chatbot */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Flows d'automatisation
            </h3>
            <div className="space-y-4">
              {chatbotFlows.map((flow) => (
                <div
                  key={flow.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedFlow === flow.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFlow(flow.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {flow.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(flow.status)}`}
                      >
                        {flow.status}
                      </span>
                      <button
                        className={`p-1 rounded ${
                          flow.status === 'Actif'
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {flow.status === 'Actif' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Déclencheurs:</strong> {flow.triggers.join(', ')}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{flow.interactions} interactions</span>
                    <span>{flow.completionRate}% de réussite</span>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    Mis à jour le {flow.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversations récentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Conversations récentes
            </h3>
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {conversation.contact}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {conversation.phone}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Flow:</strong> {conversation.flow}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{conversation.messages} messages</span>
                    <span>{conversation.duration}</span>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    {conversation.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flow Builder Preview */}
      {selectedFlow && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Aperçu du Flow: {chatbotFlows.find(f => f.id === selectedFlow)?.name}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center text-gray-500">
                <Bot className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Flow Builder</p>
                <p className="text-sm">
                  Utilisez l'éditeur visuel pour créer et modifier vos flows d'automatisation
                </p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                  Ouvrir l'éditeur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
