// ============================================================================
// PULSO ANALYTICS — Cliente Supabase multi-esquema (dev, pro, public)
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://hghhanfwdskkddtasiij.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s'
export const analyticsSchema = import.meta.env.VITE_ANALYTICS_SCHEMA || 'dev'
export const hasConfig = !!(url && key && url.startsWith('http'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const devDb: any = createClient(url, key, {
  db: { schema: 'dev' },
  realtime: { params: { eventsPerSecond: 10 } },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proDb: any = createClient(url, key, {
  db: { schema: 'pro' },
  realtime: { params: { eventsPerSecond: 10 } },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const publicDb: any = createClient(url, key, {
  db: { schema: 'public' },
  realtime: { params: { eventsPerSecond: 10 } },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const analyticsDb: any = devDb
