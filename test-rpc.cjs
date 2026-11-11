const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://hghhanfwdskkddtasiij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s',
  { db: { schema: 'dev' } }
);

async function testRpc() {
  const { data, error } = await client.rpc('get_tables');
  console.log('rpc get_tables:', { data, error: error?.message });
}
testRpc();
