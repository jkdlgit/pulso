import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabaseSchema = import.meta.env.VITE_SUPABASE_SCHEMA || 'dev'

export const hasSupabaseConfig = !!(supabaseUrl && supabaseKey && supabaseUrl.startsWith('http'))

export const supabase = createClient(
  hasSupabaseConfig ? supabaseUrl : 'https://placeholder.supabase.co',
  hasSupabaseConfig ? supabaseKey : 'placeholder',
  {
    db: {
      schema: supabaseSchema,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)
