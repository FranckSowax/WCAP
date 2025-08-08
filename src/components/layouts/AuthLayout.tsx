import { Outlet } from 'react-router-dom'
import { MessageCircle, Zap } from 'lucide-react'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Côté gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 text-white">
        <div className="flex flex-col justify-center max-w-lg">
          {/* Banner image en haut à gauche */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/images/replicate-prediction-pdg1e47ch1rm80crgwnv3zk9zr.jpg" 
              alt="WCAP Banner" 
              className="w-full max-w-full rounded-lg shadow-lg mb-6"
            />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-lg">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">WCAP</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Automatisez vos campagnes WhatsApp
          </h2>
          
          <p className="text-xl mb-8 text-white/90">
            Gérez jusqu'à 70 000+ contacts, créez des chatbots intelligents et 
            analysez vos performances en temps réel avec l'intégration Wati.io.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              <span>Broadcasts automatisés</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              <span>Chatbot avec flow builder</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              <span>Analytics avancés</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Côté droit - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">WCAP</h1>
            </div>
            <p className="text-muted-foreground">
              Plateforme d'automatisation WhatsApp
            </p>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  )
}
