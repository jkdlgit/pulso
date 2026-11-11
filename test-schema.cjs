const { createClient } = require('@supabase/supabase-js');
const url = 'https://hghhanfwdskkddtasiij.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s';

async function check() {
  for (const schema of ['public', 'dev', 'analytic_pulso']) {
    console.log(`\n=== Testing schema: ${schema} ===`);
    const client = createClient(url, key, { db: { schema } });
    for (const table of ['businesses', 'session_facts', 'visitor_facts', 'events', 'leads', 'visitas', 'appointments', 'sales', 'campaigns']) {
      try {
        const { data, error } = await client.from(table).select('*').limit(2);
        if (error) {
          console.log(`  [${schema}.${table}] Error: ${error.message} (code: ${error.code})`);
        } else {
          console.log(`  [${schema}.${table}] Success! Count: ${data.length}`);
        }
      } catch (err) {
        console.log(`  [${schema}.${table}] Exception: ${err.message}`);
      }
    }
  }
}
check();
