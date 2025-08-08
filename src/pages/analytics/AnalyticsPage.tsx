import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Calendar, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react'

const messageData = [
  { name: 'Lun', envoyés: 240, livrés: 235, ouverts: 200 },
  { name: 'Mar', envoyés: 180, livrés: 175, ouverts: 150 },
  { name: 'Mer', envoyés: 320, livrés: 315, ouverts: 280 },
  { name: 'Jeu', envoyés: 280, livrés: 275, ouverts: 240 },
  { name: 'Ven', envoyés: 350, livrés: 340, ouverts: 300 },
  { name: 'Sam', envoyés: 120, livrés: 118, ouverts: 100 },
  { name: 'Dim', envoyés: 90, livrés: 88, ouverts: 75 },
]

const engagementData = [
  { name: 'Jan', taux: 85 },
  { name: 'Fév', taux: 87 },
  { name: 'Mar', taux: 82 },
  { name: 'Avr', taux: 89 },
  { name: 'Mai', taux: 91 },
  { name: 'Jun', taux: 88 },
  { name: 'Jul', taux: 92 },
  { name: 'Aoû', taux: 87 },
]

const campaignTypeData = [
  { name: 'Promotions', value: 45, color: '#10B981' },
  { name: 'Newsletters', value: 30, color: '#3B82F6' },
  { name: 'Support', value: 15, color: '#F59E0B' },
  { name: 'Notifications', value: 10, color: '#EF4444' },
]

const topCampaigns = [
  { name: 'Promotion Été 2025', ouvertures: 1100, taux: 88, variation: '+12%', type: 'positive' },
  { name: 'Newsletter Mensuelle', ouvertures: 720, taux: 81, variation: '+5%', type: 'positive' },
  { name: 'Rappel Événement', ouvertures: 450, taux: 75, variation: '-3%', type: 'negative' },
  { name: 'Offre Spéciale', ouvertures: 380, taux: 72, variation: '+8%', type: 'positive' },
]

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('7j')
  const [selectedMetric, setSelectedMetric] = useState('messages')

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analysez les performances de vos campagnes WhatsApp
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7j">7 derniers jours</option>
            <option value="30j">30 derniers jours</option>
            <option value="90j">90 derniers jours</option>
            <option value="1an">1 an</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Messages envoyés</p>
              <p className="text-2xl font-semibold text-gray-900">15,847</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taux de livraison</p>
              <p className="text-2xl font-semibold text-gray-900">98.5%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.8%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taux d'ouverture</p>
              <p className="text-2xl font-semibold text-gray-900">87.2%</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-2.1%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taux de clic</p>
              <p className="text-2xl font-semibold text-gray-900">24.8%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des messages */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Performance des messages
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="messages">Messages</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="envoyés" fill="#3B82F6" name="Envoyés" />
                <Bar dataKey="livrés" fill="#10B981" name="Livrés" />
                <Bar dataKey="ouverts" fill="#F59E0B" name="Ouverts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution de l'engagement */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Évolution de l'engagement
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="taux" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Taux d'engagement (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par type de campagne */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Répartition par type de campagne
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaignTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {campaignTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top campagnes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Meilleures campagnes
          </h3>
          <div className="space-y-4">
            {topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span>{campaign.ouvertures.toLocaleString()} ouvertures</span>
                    <span className="mx-2">•</span>
                    <span>{campaign.taux}% de taux d'ouverture</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      campaign.type === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {campaign.variation}
                  </span>
                  {campaign.type === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Détails par campagne
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campagne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Envoyés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livrés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ouverts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux d'ouverture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux de clic
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCampaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(campaign.ouvertures / (campaign.taux / 100)).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(campaign.ouvertures / (campaign.taux / 100) * 0.98).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.ouvertures.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(campaign.ouvertures * 0.25).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.taux}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      25%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
