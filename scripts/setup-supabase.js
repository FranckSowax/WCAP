#!/usr/bin/env node

/**
 * Script de configuration directe pour Supabase WCAP
 * Utilise les credentials pour initialiser la base de données
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration de votre projet WCAP
const SUPABASE_URL = 'https://qbsimkokrsdkbdofkmpc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic2lta29rcnNka2Jkb2ZrbXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTA0NTIsImV4cCI6MjA3MDE4NjQ1Mn0.ZXfVSXdMHahOb66GHf6nZsS5l5WnIbAV73q5JCjD8QQ'

// Vous devez fournir la service_role key
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

console.log('🚀 Configuration de la base de données WCAP...')
console.log('📋 Projet:', SUPABASE_URL)

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ Erreur: SUPABASE_SERVICE_KEY manquante')
    console.log('')
    console.log('💡 Pour obtenir votre service key:')
    console.log('1. Allez sur: https://supabase.com/dashboard/project/qbsimkokrsdkbdofkmpc/settings/api')
    console.log('2. Copiez la "service_role" key (pas l\'anon key)')
    console.log('3. Exécutez: SUPABASE_SERVICE_KEY=your_service_key node scripts/setup-supabase.js')
    console.log('')
    process.exit(1)
}

// Créer le client avec la service key pour les opérations admin
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function setupDatabase() {
    try {
        console.log('🔍 Vérification de la connexion...')
        
        // Test de connexion
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        
        if (error && error.message.includes('relation "profiles" does not exist')) {
            console.log('📋 Les tables n\'existent pas encore, création en cours...')
            await createTables()
        } else if (error) {
            console.error('❌ Erreur de connexion:', error.message)
            return
        } else {
            console.log('✅ Connexion réussie, tables déjà présentes')
        }
        
        console.log('🎯 Configuration terminée avec succès !')
        console.log('')
        console.log('Prochaines étapes:')
        console.log('1. Ouvrez http://localhost:3000')
        console.log('2. Créez un compte utilisateur')
        console.log('3. Configurez votre organisation')
        
    } catch (error) {
        console.error('❌ Erreur:', error.message)
    }
}

async function createTables() {
    console.log('🔧 Création des tables WCAP...')
    
    const schema = `
        -- Activer les extensions
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Table des organisations
        CREATE TABLE IF NOT EXISTS organizations (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name TEXT NOT NULL,
            plan TEXT CHECK (plan IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
            wati_api_key TEXT,
            wati_instance_id TEXT,
            max_contacts INTEGER DEFAULT 5000,
            max_messages_per_month INTEGER DEFAULT 10000,
            subscription_status TEXT DEFAULT 'trial',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Table des profils utilisateurs
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            organization_id UUID REFERENCES organizations(id),
            full_name TEXT,
            role TEXT CHECK (role IN ('super_admin', 'admin', 'agent', 'viewer')) DEFAULT 'admin',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Table des contacts
        CREATE TABLE IF NOT EXISTS contacts (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            organization_id UUID REFERENCES organizations(id) NOT NULL,
            phone_number TEXT NOT NULL,
            name TEXT,
            email TEXT,
            tags TEXT[] DEFAULT '{}',
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(organization_id, phone_number)
        );
        
        -- Table des campagnes
        CREATE TABLE IF NOT EXISTS campaigns (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            organization_id UUID REFERENCES organizations(id) NOT NULL,
            name TEXT NOT NULL,
            status TEXT DEFAULT 'draft',
            scheduled_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Table des messages
        CREATE TABLE IF NOT EXISTS messages (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            organization_id UUID REFERENCES organizations(id) NOT NULL,
            campaign_id UUID REFERENCES campaigns(id),
            contact_id UUID REFERENCES contacts(id) NOT NULL,
            phone_number TEXT NOT NULL,
            content JSONB NOT NULL,
            status TEXT DEFAULT 'queued',
            sent_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Fonction pour créer automatiquement un profil
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id, full_name)
            VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Trigger pour créer un profil automatiquement
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
        -- Activer RLS
        ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
        
        -- Politiques RLS de base
        DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
        CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
        
        DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
        CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
        
        DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
        CREATE POLICY "Users can view their organization" ON organizations FOR SELECT USING (
            id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Users can view contacts from their organization" ON contacts;
        CREATE POLICY "Users can view contacts from their organization" ON contacts FOR ALL USING (
            organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Users can view campaigns from their organization" ON campaigns;
        CREATE POLICY "Users can view campaigns from their organization" ON campaigns FOR ALL USING (
            organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
        );
        
        DROP POLICY IF EXISTS "Users can view messages from their organization" ON messages;
        CREATE POLICY "Users can view messages from their organization" ON messages FOR ALL USING (
            organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
        );
        
        -- Insérer une organisation de démonstration
        INSERT INTO organizations (id, name, plan) 
        VALUES (
            '00000000-0000-0000-0000-000000000001',
            'CNSA - Organisation de démonstration',
            'enterprise'
        ) ON CONFLICT (id) DO NOTHING;
    `
    
    // Exécuter le schéma via RPC
    const { error } = await supabase.rpc('exec_sql', { sql: schema })
    
    if (error) {
        console.error('❌ Erreur lors de la création des tables:', error.message)
        console.log('💡 Essayez d\'exécuter manuellement le schéma via l\'interface Supabase')
    } else {
        console.log('✅ Tables créées avec succès')
    }
}

// Lancer la configuration
setupDatabase()
