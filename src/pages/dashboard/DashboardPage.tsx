import { Users, Send, MessageCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react'

const stats = [
  {
    name: 'Contacts totaux',
    value: '12,847',
    change: '+4.75%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Messages envoyés',
    value: '2,340',
    change: '+54.02%',
    changeType: 'positive',
    icon: Send,
  },
  {
    name: 'Taux de livraison',
    value: '98.5%',
    change: '+1.39%',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    name: 'Taux d\'ouverture',
    value: '87.2%',
    change: '+10.18%',
    changeType: 'positive',
    icon: TrendingUp,
  },
]

const recentCampaigns = [
  {
    id: 1,
    name: 'Promotion Été 2025',
    status: 'Terminée',
    sent: 1250,
    delivered: 1230,
    opened: 1100,
    date: '2025-08-05',
  },
  {
    id: 2,
    name: 'Newsletter Mensuelle',
    status: 'En cours',
    sent: 890,
    delivered: 875,
    opened: 720,
    date: '2025-08-07',
  },
  {
    id: 3,
    name: 'Rappel Événement',
    status: 'Programmée',
    sent: 0,
    delivered: 0,
    opened: 0,
    date: '2025-08-10',
  },
]

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de vos campagnes WhatsApp
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-primary rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campagnes récentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Campagnes récentes
            </h3>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'Terminée'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'En cours'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {campaign.date}
                    </div>
                    {campaign.sent > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {campaign.sent} envoyés • {campaign.delivered} livrés • {campaign.opened} ouverts
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Activité récente
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Campagne "Promotion Été 2025" terminée avec succès
                  </p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    125 nouveaux contacts importés
                  </p>
                  <p className="text-xs text-gray-500">Il y a 4 heures</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Nouveau chatbot configuré pour le support client
                  </p>
                  <p className="text-xs text-gray-500">Hier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary text-white">
                  <Send className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Nouvelle campagne
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Créer et envoyer une nouvelle campagne WhatsApp
                </p>
              </div>
            </button>

            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary text-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Importer contacts
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Ajouter de nouveaux contacts depuis un fichier CSV
                </p>
              </div>
            </button>

            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary text-white">
                  <MessageCircle className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Configurer chatbot
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Créer des flows automatisés pour vos clients
                </p>
              </div>
            </button>

            <button className="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg hover:bg-gray-100">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary text-white">
                  <TrendingUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Voir analytics
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Analyser les performances de vos campagnes
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
