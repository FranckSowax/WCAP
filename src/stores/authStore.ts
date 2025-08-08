import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    
    set({ user: data.user })
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    
    set({ user: data.user })
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    set({ user: null })
  },

  initialize: async () => {
    console.log('🚀 Initialisation du store d\'authentification...')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Utilisateur récupéré:', user ? 'Connecté' : 'Non connecté')
      
      set({ user, isLoading: false })

      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Changement d\'auth:', event, session?.user ? 'Utilisateur connecté' : 'Utilisateur déconnecté')
        set({ user: session?.user ?? null })
      })
      
      console.log('✅ Initialisation de l\'auth terminée avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'auth:', error)
      set({ isLoading: false })
    }
  },
}))

// Initialiser l'auth au chargement
useAuthStore.getState().initialize()
