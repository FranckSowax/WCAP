import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Créer le client Supabase avec des valeurs par défaut sûres
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Désactiver la persistance en mode démo
  }
})

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          plan: 'starter' | 'professional' | 'enterprise'
          wati_api_key: string | null
          wati_instance_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: 'starter' | 'professional' | 'enterprise'
          wati_api_key?: string | null
          wati_instance_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: 'starter' | 'professional' | 'enterprise'
          wati_api_key?: string | null
          wati_instance_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          full_name: string | null
          role: 'super_admin' | 'admin' | 'agent' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'agent' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'agent' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          phone_number: string
          name: string | null
          email: string | null
          tags: string[]
          custom_attributes: Record<string, any>
          wati_contact_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          phone_number: string
          name?: string | null
          email?: string | null
          tags?: string[]
          custom_attributes?: Record<string, any>
          wati_contact_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          phone_number?: string
          name?: string | null
          email?: string | null
          tags?: string[]
          custom_attributes?: Record<string, any>
          wati_contact_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
