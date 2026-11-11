const { createClient } = require('@supabase/supabase-js');
const url = 'https://hghhanfwdskkddtasiij.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s';

async function check() {
  for (const schema of ['public', 'dev', 'pro', 'analytic_pulso', 'analytics']) {
    console.log(`\n=== Testing schema: ${schema} ===`);
    const client = createClient(url, key, { db: { schema } });
    for (const table of ['leads', 'pacientes', 'pedidos', 'historial_clinico', 'businesses', 'session_facts', 'visitor_facts', 'events', 'campaigns', 'appointments', 'sales']) {
      try {
        const { data, error } = await client.from(table).select('id').limit(1);
        if (error) {
          if (error.code !== 'PGRST205' && error.code !== 'PGRST106') {
            console.log(`  [${schema}.${table}] Error: ${error.message} (code: ${error.code})`);
          }
        } else {
          console.log(`  [${schema}.${table}] EXISTS! Data:`, data);
        }
      } catch (err) {
        console.log(`  [${schema}.${table}] Exception: ${err.message}`);
      }
    }
  }
}
check();
