# 🚀 Guide d'installation WCAP - Base de données Supabase

## 📋 Prérequis

Votre projet Supabase est configuré avec :
- **URL** : `https://qbsimkokrsdkbdofkmpc.supabase.co`
- **Clé Anon** : Déjà configurée dans `.env`

## 🔧 Configuration de la base de données

### Option 1 : Configuration automatique (Recommandée)

1. **Obtenez votre clé de service Supabase** :
   - Allez sur [votre projet Supabase](https://supabase.com/dashboard/project/qbsimkokrsdkbdofkmpc/settings/api)
   - Copiez la **service_role key** (pas l'anon key)

2. **Exécutez le script d'initialisation** :
   ```bash
   cd "/Users/a/Desktop/Saas Whatsapp"
   SUPABASE_SERVICE_KEY=your_service_key_here node scripts/init-database.js
   ```

### Option 2 : Configuration manuelle via l'interface Supabase

1. **Connectez-vous à Supabase** :
   - Ouvrez [votre projet](https://supabase.com/dashboard/project/qbsimkokrsdkbdofkmpc)

2. **Allez dans l'éditeur SQL** :
   - Cliquez sur "SQL Editor" dans le menu latéral

3. **Exécutez le schéma simplifié** :
   - Copiez le contenu de `supabase/init-tables.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" pour exécuter

4. **Vérifiez les tables créées** :
   - Allez dans "Table Editor"
   - Vous devriez voir : `organizations`, `profiles`, `contacts`, `campaigns`, `messages`

## 🎯 Test de l'application

1. **Redémarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Ouvrez l'application** :
   - Allez sur `http://localhost:3000`
   - Vous devriez voir la page de connexion

3. **Créez un compte** :
   - Cliquez sur "Créer un compte"
   - Remplissez le formulaire d'inscription
   - Un profil sera automatiquement créé

## 🔐 Configuration de l'authentification

### Paramètres d'authentification Supabase

1. **Allez dans Authentication > Settings** :
   - [Lien direct](https://supabase.com/dashboard/project/qbsimkokrsdkbdofkmpc/auth/settings)

2. **Configurez l'URL du site** :
   - Site URL : `http://localhost:3000`
   - Redirect URLs : `http://localhost:3000/**`

3. **Activez les fournisseurs souhaités** :
   - Email (déjà activé)
   - Optionnel : Google, GitHub, etc.

## 📊 Structure de la base de données créée

### Tables principales :

- **`organizations`** - Informations des organisations (CNSA, etc.)
- **`profiles`** - Profils utilisateurs liés à auth.users
- **`contacts`** - Base de contacts WhatsApp (jusqu'à 70k+)
- **`campaigns`** - Campagnes de broadcast
- **`messages`** - Historique des messages envoyés

### Sécurité (RLS) :

- ✅ Row Level Security activé sur toutes les tables
- ✅ Politiques configurées pour isoler les données par organisation
- ✅ Création automatique de profil à l'inscription

## 🔌 Configuration Wati.io

Une fois l'application fonctionnelle :

1. **Allez dans Paramètres > Intégration Wati.io**
2. **Ajoutez vos credentials Wati.io** :
   - Clé API Wati.io
   - ID d'instance
   - URL Webhook

## 🎉 Fonctionnalités disponibles

Après configuration complète :

- ✅ **Authentification** - Inscription/Connexion
- ✅ **Gestion de contacts** - Import/Export CSV
- ✅ **Campagnes** - Création et planification
- ✅ **Chatbot** - Flows d'automatisation
- ✅ **Analytics** - Métriques en temps réel
- ✅ **Interface française** - Optimisée pour le marché africain

## 🆘 Dépannage

### Erreur de connexion à la base de données
```
Error: Invalid API key
```
**Solution** : Vérifiez que la clé anon dans `.env` est correcte

### Tables non créées
```
relation "profiles" does not exist
```
**Solution** : Exécutez le script `supabase/init-tables.sql` dans l'éditeur SQL

### Erreur d'authentification
```
User not found
```
**Solution** : Créez un compte via l'interface d'inscription

## 📞 Support

- **Documentation** : Consultez ce guide
- **Logs** : Vérifiez la console du navigateur (F12)
- **Base de données** : Utilisez l'interface Supabase pour vérifier les données

---

🎯 **Objectif** : Plateforme SaaS complète pour l'automatisation WhatsApp avec intégration Wati.io, optimisée pour les organisations africaines comme la CNSA.
