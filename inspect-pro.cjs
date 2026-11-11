const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://hghhanfwdskkddtasiij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s',
  { db: { schema: 'pro' } }
);

async function inspect() {
  const { data: leads } = await client.from('leads').select('*').limit(5);
  console.log('pro.leads count:', leads ? leads.length : 0);
  const { data: pac } = await client.from('pacientes').select('*').limit(5);
  console.log('pro.pacientes count:', pac ? pac.length : 0);
  const { data: ped } = await client.from('pedidos').select('*').limit(5);
  console.log('pro.pedidos count:', ped ? ped.length : 0);
  if (ped && ped.length > 0) console.log('Sample ped:', ped[0]);
}
inspect();
