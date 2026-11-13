// ============================================================================
// PULSO ANALYTICS — Sincronizador de Métricas Meta Ads a Supabase
// ============================================================================

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'EAAiKvcIbSDUBS82hoaicApoNe3glJ8vp9UAQEUyAqbJZCKZAYZBVCvopbpLn28492waacVTYofdfOCX7pj4pw3Ne5NE7WWq0HZBnTUlWHqVU2qwkhK1hEODSFOpiqSW4DuXxLjuJDwJ5SRpclIUbyuksoJL7Q5SPVHCdkGWZBfQLEwyIHaKTRaWg3KTKGnfLiuVMuvw5AURpiAOJ5gdYAZCmZB9XwHOXZAnRcfK9ae12SzDkN32w01oR5lHD33aTQ0Oy6JJdhgwZASk01AVaK4DEkfsWZA'
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || 'act_1639596734153897'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hghhanfwdskkddtasiij.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s'

async function syncMetaAds() {
  console.log('📡 [1/3] Consultando Meta Marketing API...')

  // 1. Obtener métricas generales por campaña
  const campUrl = `https://graph.facebook.com/v21.0/${AD_ACCOUNT_ID}/insights?` + new URLSearchParams({
    level: 'campaign',
    fields: 'campaign_id,campaign_name,spend,reach,impressions,frequency,cpm,inline_link_clicks,cost_per_inline_link_click,inline_link_click_ctr,actions,cost_per_action_type',
    date_preset: 'maximum',
    access_token: META_ACCESS_TOKEN,
  })

  const campRes = await fetch(campUrl)
  const campJson = await campRes.json()

  if (campJson.error) {
    console.error('❌ Error de Meta API:', campJson.error)
    process.exit(1)
  }

  const rawCampaigns = campJson.data || []
  console.log(`✅ Campañas recibidas de Meta: ${rawCampaigns.length}`)

  const today = new Date().toISOString().split('T')[0]

  const campaignRows = rawCampaigns.map(c => {
    const isQuiz1 = c.campaign_name.includes('quiz1')
    const quizTarget = isQuiz1 ? 'quiz1' : 'quiz2'
    const campId = isQuiz1 ? 'camp_fb_quiz1_gye' : 'camp_fb_quiz2_gye'

    const actions = c.actions || []
    const costs = c.cost_per_action_type || []

    const landingViews = Number(actions.find(a => a.action_type === 'landing_page_view')?.value || 0)
    const postEngagements = Number(actions.find(a => a.action_type === 'post_engagement')?.value || 0)
    const costPerLanding = Number(costs.find(a => a.action_type === 'landing_page_view')?.value || 0)

    return {
      campaign_id: campId,
      campaign_name: isQuiz1 ? 'Campaña Quiz 1 · Test Visual General' : 'Campaña Quiz 2 · Agudeza Visual & Presbicia',
      adset_name: 'Público Guayaquil (+40 km)',
      ad_name: isQuiz1 ? 'Anuncio Quiz 1 Texto Negro' : 'Anuncio Quiz 2 Amarillo',
      quiz_target: quizTarget,
      date: today,
      spend: Number(c.spend || 0),
      impressions: Number(c.impressions || 0),
      reach: Number(c.reach || 0),
      frequency: Number(c.frequency || 1.0),
      cpm: Number(c.cpm || 0),
      inline_link_clicks: Number(c.inline_link_clicks || 0),
      cpc: Number(c.cost_per_inline_link_click || 0),
      ctr: Number(c.inline_link_click_ctr || 0),
      landing_page_views: landingViews,
      cost_per_landing_page_view: costPerLanding,
      post_engagements: postEngagements,
      status: 'Activo',
    }
  })

  // 2. Obtener desglose demográfico
  console.log('📡 [2/3] Consultando desglose demográfico de Meta...')
  const demoUrl = `https://graph.facebook.com/v21.0/${AD_ACCOUNT_ID}/insights?` + new URLSearchParams({
    level: 'campaign',
    fields: 'campaign_name,spend,reach,impressions,inline_link_clicks',
    breakdowns: 'age,gender',
    date_preset: 'maximum',
    access_token: META_ACCESS_TOKEN,
  })

  const demoRes = await fetch(demoUrl)
  const demoJson = await demoRes.json()
  const rawDemo = demoJson.data || []
  console.log(`✅ Registros demográficos recibidos: ${rawDemo.length}`)

  const demographicRows = rawDemo
    .filter(d => d.gender === 'female' || d.gender === 'male')
    .map(d => {
      const isQuiz1 = d.campaign_name.includes('quiz1')
      return {
        campaign_id: isQuiz1 ? 'camp_fb_quiz1_gye' : 'camp_fb_quiz2_gye',
        quiz_target: isQuiz1 ? 'quiz1' : 'quiz2',
        date: today,
        age_group: d.age,
        gender: d.gender,
        percentage: 0,
        spend: Number(d.spend || 0),
        reach: Number(d.reach || 0),
        impressions: Number(d.impressions || 0),
        clicks: Number(d.inline_link_clicks || 0),
        landing_page_views: Number(d.inline_link_clicks || 0), // aproximación proporcional
      }
    })

  // 3. Guardar en Supabase (schema pro)
  console.log('💾 [3/3] Guardando métricas en Supabase pro...')

  // Upsert campañas
  for (const row of campaignRows) {
    const postRes = await fetch(`${SUPABASE_URL}/rest/v1/meta_campaign_insights?on_conflict=campaign_id,date`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'pro',
        'Content-Profile': 'pro',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(row),
    })

    if (!postRes.ok) {
      const err = await postRes.text()
      console.warn(`⚠️ Error guardando campaña ${row.quiz_target}:`, err)
    } else {
      console.log(`✅ Campaña ${row.quiz_target} sincronizada: $${row.spend} gastados, ${row.inline_link_clicks} clics, ${row.landing_page_views} visitas`)
    }
  }

  // Eliminar demografía del día actual y reinsertar limpia
  await fetch(`${SUPABASE_URL}/rest/v1/meta_demographic_insights?date=eq.${today}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Accept-Profile': 'pro',
      'Content-Profile': 'pro',
    },
  })

  // Insertar registros demográficos actualizados
  const demoInsertRes = await fetch(`${SUPABASE_URL}/rest/v1/meta_demographic_insights`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'pro',
      'Content-Profile': 'pro',
    },
    body: JSON.stringify(demographicRows),
  })

  if (demoInsertRes.ok) {
    console.log(`✅ ${demographicRows.length} registros demográficos guardados exitosamente.`)
  } else {
    const err = await demoInsertRes.text()
    console.warn('⚠️ Error guardando demografía:', err)
  }

  console.log('🎉 ¡Sincronización con Meta Ads completada con éxito!')
}

syncMetaAds().catch(console.error)
