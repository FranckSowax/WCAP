-- WCAP - WhatsApp Campaign Automation Platform
-- Schéma SQL complet pour Supabase
-- Version: 2.0

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLES PRINCIPALES
-- =============================================================================

-- Table des organisations
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    plan TEXT CHECK (plan IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
    wati_api_key TEXT,
    wati_instance_id TEXT,
    wati_webhook_url TEXT,
    max_contacts INTEGER DEFAULT 5000,
    max_messages_per_month INTEGER DEFAULT 10000,
    max_agents INTEGER DEFAULT 2,
    billing_email TEXT,
    billing_address JSONB,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'trial', 'cancelled')) DEFAULT 'trial',
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils utilisateurs
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    full_name TEXT,
    role TEXT CHECK (role IN ('super_admin', 'admin', 'agent', 'viewer')) DEFAULT 'admin',
    avatar_url TEXT,
    phone_number TEXT,
    language TEXT DEFAULT 'fr',
    timezone TEXT DEFAULT 'Africa/Douala',
    notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "weekly_reports": true}',
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des contacts
CREATE TABLE contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    phone_number TEXT NOT NULL,
    name TEXT,
    email TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_attributes JSONB DEFAULT '{}',
    wati_contact_id TEXT,
    status TEXT CHECK (status IN ('active', 'inactive', 'blocked')) DEFAULT 'active',
    opt_in_status TEXT CHECK (opt_in_status IN ('opted_in', 'opted_out', 'pending')) DEFAULT 'pending',
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, phone_number)
);

-- Table des segments de contacts
CREATE TABLE contact_segments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL, -- Conditions de segmentation
    contact_count INTEGER DEFAULT 0,
    auto_update BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison contacts-segments
CREATE TABLE contact_segment_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    segment_id UUID REFERENCES contact_segments(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contact_id, segment_id)
);

-- Table des templates de messages
CREATE TABLE message_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('marketing', 'transactional', 'support', 'notification')),
    wati_template_id TEXT,
    template_type TEXT CHECK (template_type IN ('text', 'media', 'interactive', 'location')) DEFAULT 'text',
    content JSONB NOT NULL, -- Structure du template (texte, variables, médias)
    variables TEXT[] DEFAULT '{}', -- Variables disponibles
    status TEXT CHECK (status IN ('draft', 'pending', 'approved', 'rejected')) DEFAULT 'draft',
    language TEXT DEFAULT 'fr',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des campagnes
CREATE TABLE campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('broadcast', 'drip', 'trigger', 'api')) DEFAULT 'broadcast',
    status TEXT CHECK (status IN ('draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
    template_id UUID REFERENCES message_templates(id),
    target_segments UUID[] DEFAULT '{}', -- IDs des segments ciblés
    target_contacts UUID[] DEFAULT '{}', -- IDs des contacts ciblés directement
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}', -- Paramètres de la campagne (délais, conditions, etc.)
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages envoyés
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    campaign_id UUID REFERENCES campaigns(id),
    contact_id UUID REFERENCES contacts(id) NOT NULL,
    template_id UUID REFERENCES message_templates(id),
    wati_message_id TEXT,
    phone_number TEXT NOT NULL,
    content JSONB NOT NULL, -- Contenu du message rendu
    message_type TEXT CHECK (message_type IN ('text', 'media', 'interactive', 'location', 'template')) DEFAULT 'text',
    direction TEXT CHECK (direction IN ('outbound', 'inbound')) DEFAULT 'outbound',
    status TEXT CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed', 'replied')) DEFAULT 'queued',
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    cost_xaf DECIMAL(10,2), -- Coût en francs CFA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des flows de chatbot
CREATE TABLE chatbot_flows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    triggers TEXT[] DEFAULT '{}', -- Mots-clés déclencheurs
    flow_data JSONB NOT NULL, -- Structure du flow (nodes, connections)
    status TEXT CHECK (status IN ('active', 'inactive', 'draft')) DEFAULT 'draft',
    priority INTEGER DEFAULT 0, -- Priorité d'exécution
    fallback_message TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des conversations de chatbot
CREATE TABLE chatbot_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    contact_id UUID REFERENCES contacts(id) NOT NULL,
    flow_id UUID REFERENCES chatbot_flows(id),
    phone_number TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'escalated', 'abandoned')) DEFAULT 'active',
    current_node_id TEXT, -- Node actuel dans le flow
    context JSONB DEFAULT '{}', -- Variables de contexte
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    escalated_at TIMESTAMP WITH TIME ZONE,
    escalated_to UUID REFERENCES profiles(id), -- Agent assigné
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des interactions de chatbot
CREATE TABLE chatbot_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id),
    node_id TEXT NOT NULL,
    user_input TEXT,
    bot_response TEXT,
    action_taken TEXT, -- Action effectuée (collect_input, send_message, escalate, etc.)
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des webhooks
CREATE TABLE webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    event_type TEXT NOT NULL, -- Type d'événement (message_status, message_received, etc.)
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analytics quotidiens
CREATE TABLE analytics_summary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    date DATE NOT NULL,
    messages_sent INTEGER DEFAULT 0,
    messages_delivered INTEGER DEFAULT 0,
    messages_read INTEGER DEFAULT 0,
    messages_replied INTEGER DEFAULT 0,
    messages_failed INTEGER DEFAULT 0,
    unique_contacts_reached INTEGER DEFAULT 0,
    campaigns_sent INTEGER DEFAULT 0,
    chatbot_conversations INTEGER DEFAULT 0,
    chatbot_escalations INTEGER DEFAULT 0,
    cost_total_xaf DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, date)
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- Type de ressource (campaign, contact, etc.)
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEX POUR PERFORMANCE
-- =============================================================================

-- Index pour les contacts
CREATE INDEX idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX idx_contacts_phone_number ON contacts(phone_number);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX idx_contacts_last_interaction ON contacts(last_interaction_at);

-- Index pour les messages
CREATE INDEX idx_messages_organization_id ON messages(organization_id);
CREATE INDEX idx_messages_campaign_id ON messages(campaign_id);
CREATE INDEX idx_messages_contact_id ON messages(contact_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_messages_phone_number ON messages(phone_number);

-- Index pour les campagnes
CREATE INDEX idx_campaigns_organization_id ON campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_scheduled_at ON campaigns(scheduled_at);

-- Index pour les conversations de chatbot
CREATE INDEX idx_chatbot_conversations_organization_id ON chatbot_conversations(organization_id);
CREATE INDEX idx_chatbot_conversations_contact_id ON chatbot_conversations(contact_id);
CREATE INDEX idx_chatbot_conversations_status ON chatbot_conversations(status);

-- Index pour les analytics
CREATE INDEX idx_analytics_summary_organization_date ON analytics_summary(organization_id, date);

-- Index pour les logs d'activité
CREATE INDEX idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- =============================================================================
-- FONCTIONS ET TRIGGERS
-- =============================================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_segments_updated_at BEFORE UPDATE ON contact_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_flows_updated_at BEFORE UPDATE ON chatbot_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chatbot_conversations_updated_at BEFORE UPDATE ON chatbot_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer un profil automatiquement
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour le nombre de contacts dans les segments
CREATE OR REPLACE FUNCTION update_segment_contact_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE contact_segments 
        SET contact_count = contact_count + 1 
        WHERE id = NEW.segment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE contact_segments 
        SET contact_count = contact_count - 1 
        WHERE id = OLD.segment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour maintenir le compteur de contacts dans les segments
CREATE TRIGGER update_segment_count_on_member_change
    AFTER INSERT OR DELETE ON contact_segment_members
    FOR EACH ROW EXECUTE FUNCTION update_segment_contact_count();

-- =============================================================================
-- POLITIQUES RLS (ROW LEVEL SECURITY)
-- =============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_segment_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les organisations
CREATE POLICY "Users can view their organization" ON organizations FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can update their organization" ON organizations FOR UPDATE USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Politiques pour les contacts
CREATE POLICY "Users can view contacts from their organization" ON contacts FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage contacts from their organization" ON contacts FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les segments
CREATE POLICY "Users can view segments from their organization" ON contact_segments FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage segments from their organization" ON contact_segments FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les membres de segments
CREATE POLICY "Users can view segment members from their organization" ON contact_segment_members FOR SELECT USING (
    segment_id IN (SELECT id FROM contact_segments WHERE organization_id IN 
        (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);
CREATE POLICY "Users can manage segment members from their organization" ON contact_segment_members FOR ALL USING (
    segment_id IN (SELECT id FROM contact_segments WHERE organization_id IN 
        (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);

-- Politiques pour les templates
CREATE POLICY "Users can view templates from their organization" ON message_templates FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage templates from their organization" ON message_templates FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les campagnes
CREATE POLICY "Users can view campaigns from their organization" ON campaigns FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage campaigns from their organization" ON campaigns FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les messages
CREATE POLICY "Users can view messages from their organization" ON messages FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage messages from their organization" ON messages FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les flows de chatbot
CREATE POLICY "Users can view chatbot flows from their organization" ON chatbot_flows FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage chatbot flows from their organization" ON chatbot_flows FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les conversations de chatbot
CREATE POLICY "Users can view chatbot conversations from their organization" ON chatbot_conversations FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can manage chatbot conversations from their organization" ON chatbot_conversations FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Politiques pour les interactions de chatbot
CREATE POLICY "Users can view chatbot interactions from their organization" ON chatbot_interactions FOR SELECT USING (
    conversation_id IN (SELECT id FROM chatbot_conversations WHERE organization_id IN 
        (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);
CREATE POLICY "Users can manage chatbot interactions from their organization" ON chatbot_interactions FOR ALL USING (
    conversation_id IN (SELECT id FROM chatbot_conversations WHERE organization_id IN 
        (SELECT organization_id FROM profiles WHERE id = auth.uid()))
);

-- Politiques pour les webhooks
CREATE POLICY "Users can view webhooks from their organization" ON webhooks FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "System can manage webhooks" ON webhooks FOR ALL USING (true);

-- Politiques pour les analytics
CREATE POLICY "Users can view analytics from their organization" ON analytics_summary FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "System can manage analytics" ON analytics_summary FOR ALL USING (true);

-- Politiques pour les logs d'activité
CREATE POLICY "Users can view activity logs from their organization" ON activity_logs FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "System can manage activity logs" ON activity_logs FOR ALL USING (true);

-- =============================================================================
-- DONNÉES DE DÉMONSTRATION
-- =============================================================================

-- Insérer une organisation de démonstration
INSERT INTO organizations (id, name, plan, max_contacts, max_messages_per_month, max_agents) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'CNSA - Caisse Nationale de Sécurité Sociale',
    'enterprise',
    100000,
    500000,
    20
) ON CONFLICT (id) DO NOTHING;

-- Insérer des templates de démonstration
INSERT INTO message_templates (id, organization_id, name, category, template_type, content, variables, status) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Bienvenue CNSA',
    'marketing',
    'text',
    '{"text": "Bonjour {{name}}, bienvenue à la CNSA ! Votre numéro d''assuré est {{numero_assure}}."}',
    ARRAY['name', 'numero_assure'],
    'approved'
),
(
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Rappel Cotisation',
    'notification',
    'text',
    '{"text": "Rappel : Votre cotisation de {{montant}} XAF est due le {{date_echeance}}. Merci de régulariser votre situation."}',
    ARRAY['montant', 'date_echeance'],
    'approved'
) ON CONFLICT (id) DO NOTHING;

-- Insérer un flow de chatbot de démonstration
INSERT INTO chatbot_flows (id, organization_id, name, description, triggers, flow_data, status) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Accueil CNSA',
    'Flow d''accueil pour les assurés CNSA',
    ARRAY['bonjour', 'salut', 'hello', 'info', 'aide'],
    '{"nodes": [{"id": "start", "type": "message", "content": "Bonjour ! Je suis l''assistant virtuel de la CNSA. Comment puis-je vous aider ?", "next": "menu"}], "connections": []}',
    'active'
) ON CONFLICT (id) DO NOTHING;
