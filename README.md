# WCAP - WhatsApp Campaign Automation Platform

## 🚀 Vue d'ensemble

WCAP est une plateforme SaaS complète d'automatisation des campagnes WhatsApp avec intégration Wati.io, conçue spécialement pour le marché africain (XAF).

### ✨ Fonctionnalités principales

- **Gestion de contacts** - Gérez jusqu'à 70 000+ contacts avec segmentation avancée
- **Broadcasts automatisés** - Envoyez des messages personnalisés via l'API Wati.io
- **Chatbot intelligent** - Flow builder visuel avec NLP en français
- **Analytics avancés** - Tableaux de bord temps réel et rapports détaillés
- **Interface française** - Optimisée pour les utilisateurs francophones

## 🛠 Stack technique

- **Frontend**: React 18.3 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **WhatsApp**: Intégration Wati.io API
- **Paiements**: Flutterwave (XAF)
- **Charts**: Recharts
- **State Management**: Zustand + TanStack Query

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Wati.io
- Compte Flutterwave (optionnel)

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <repo-url>
cd wcap-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```

Remplissez les variables dans `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WATI_API_URL=https://live-server-113452.wati.io/api/v1
VITE_WATI_API_KEY=your_wati_api_key
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📊 Structure du projet

```
src/
├── components/
│   └── layouts/          # Layouts (Auth, Dashboard)
├── pages/
│   ├── auth/            # Pages d'authentification
│   ├── dashboard/       # Tableau de bord
│   ├── contacts/        # Gestion des contacts
│   ├── campaigns/       # Gestion des campagnes
│   ├── chatbot/         # Configuration chatbot
│   ├── analytics/       # Analytics et rapports
│   └── settings/        # Paramètres
├── stores/              # État global (Zustand)
├── lib/                 # Utilitaires et configuration
└── types/               # Types TypeScript
```

## 🔧 Configuration Supabase

### Tables principales

1. **organizations** - Informations des organisations
2. **profiles** - Profils utilisateurs
3. **contacts** - Base de contacts WhatsApp
4. **campaigns** - Campagnes et broadcasts
5. **messages** - Historique des messages
6. **analytics_summary** - Données d'analytics

### Politiques RLS

Assurez-vous d'activer Row Level Security (RLS) sur toutes les tables et de configurer les politiques appropriées.

## 🔌 Intégration Wati.io

### Configuration

1. Créez un compte sur [Wati.io](https://wati.io)
2. Obtenez votre clé API et ID d'instance
3. Configurez les webhooks pour recevoir les événements
4. Ajoutez les informations dans les paramètres de l'application

### Endpoints principaux

- **Envoi de messages**: `/api/v1/sendMessage`
- **Gestion des contacts**: `/api/v1/addContact`
- **Templates**: `/api/v1/getMessageTemplates`
- **Webhooks**: Configuration dans les paramètres

## 💰 Modèle de tarification

| Plan | Prix (XAF/mois) | Contacts | Messages | Agents |
|------|-----------------|----------|----------|---------|
| Starter | 75 000 | 5 000 | 10 000 | 2 |
| Professional | 200 000 | 25 000 | 50 000 | 5 |
| Enterprise | 450 000 | 100 000+ | Illimité | 10+ |

## 🚀 Déploiement

### Production

1. **Build de production**
```bash
npm run build
```

2. **Déploiement**
- Netlify (recommandé)
- Vercel
- AWS S3 + CloudFront

### Variables d'environnement de production

Assurez-vous de configurer toutes les variables d'environnement dans votre plateforme de déploiement.

## 📝 Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build
- `npm run lint` - Vérification du code
- `npm run type-check` - Vérification TypeScript

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- Documentation: [docs.wcap.io](https://docs.wcap.io)
- Support: support@wcap.io
- Issues: [GitHub Issues](https://github.com/your-org/wcap/issues)

## 🔄 Roadmap

- [ ] Intégration WhatsApp Business API native
- [ ] Support multi-langues (anglais, espagnol)
- [ ] Application mobile (React Native)
- [ ] Intégrations CRM (Salesforce, HubSpot)
- [ ] IA avancée pour les chatbots
- [ ] Marketplace de templates
