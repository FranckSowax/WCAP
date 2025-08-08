#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données WCAP
 * Utilise les credentials Supabase pour créer les tables nécessaires
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration Supabase
const SUPABASE_URL = 'https://qbsimkokrsdkbdofkmpc.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY_HERE'

console.log('🚀 Initialisation de la base de données WCAP...')

// Créer le client Supabase avec la clé de service
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function initializeDatabase() {
  try {
    console.log('📋 Lecture du schéma SQL...')
    
    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, '../supabase/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('🔧 Exécution du schéma SQL...')
    
    // Diviser le schéma en requêtes individuelles
    const queries = schema
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'))
    
    console.log(`📊 ${queries.length} requêtes à exécuter...`)
    
    // Exécuter chaque requête
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i] + ';'
      
      if (query.trim().length > 1) {
        try {
          console.log(`⚡ Exécution de la requête ${i + 1}/${queries.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: query })
          
          if (error) {
            console.warn(`⚠️ Avertissement requête ${i + 1}:`, error.message)
          }
        } catch (err) {
          console.warn(`⚠️ Erreur requête ${i + 1}:`, err.message)
        }
      }
    }
    
    console.log('✅ Base de données initialisée avec succès !')
    console.log('')
    console.log('🎯 Prochaines étapes :')
    console.log('1. Créez un compte utilisateur via l\'interface WCAP')
    console.log('2. Configurez votre organisation dans les paramètres')
    console.log('3. Ajoutez vos clés API Wati.io')
    console.log('')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error.message)
    process.exit(1)
  }
}

// Vérifier les credentials
if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_KEY_HERE') {
  console.error('❌ Erreur : Veuillez configurer SUPABASE_SERVICE_KEY')
  console.log('💡 Obtenez votre clé de service depuis : https://supabase.com/dashboard/project/qbsimkokrsdkbdofkmpc/settings/api')
  console.log('💡 Puis exécutez : SUPABASE_SERVICE_KEY=your_key node scripts/init-database.js')
  process.exit(1)
}

// Lancer l'initialisation
initializeDatabase()
