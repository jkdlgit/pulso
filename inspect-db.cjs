const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://hghhanfwdskkddtasiij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s',
  { db: { schema: 'dev' } }
);

async function inspect() {
  const { data: leads } = await client.from('leads').select('*').limit(5);
  console.log('dev.leads sample:', leads);
  const { data: pac } = await client.from('pacientes').select('*').limit(5);
  console.log('dev.pacientes sample:', pac);
  const { data: ped } = await client.from('pedidos').select('*').limit(5);
  console.log('dev.pedidos sample:', ped);
}
inspect();
