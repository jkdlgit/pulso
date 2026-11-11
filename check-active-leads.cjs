const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://hghhanfwdskkddtasiij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s',
  { db: { schema: 'dev' } }
);

async function checkLeads() {
  const { data: active } = await client.from('leads').select('id, origen, nombre, estado').neq('origen', 'test_archivado');
  console.log('Active dev.leads:', active);
  
  const proClient = createClient(
    'https://hghhanfwdskkddtasiij.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s',
    { db: { schema: 'pro' } }
  );
  const { data: proActive } = await proClient.from('leads').select('id, origen, nombre, estado').neq('origen', 'test_archivado');
  console.log('Active pro.leads:', proActive);
}
checkLeads();
