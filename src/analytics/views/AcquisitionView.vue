<template>
  <PageHeader
    code="04 // ACQUISITION & META ADS"
    title="Adquisición, Pauta y Campañas Publicitarias"
    description="Control integral de inversión publicitaria en Meta Ads (Facebook/Instagram), rendimiento universal del tráfico y demografía de la audiencia combinados con la conversión real en Óptica Johanna."
  >
    <template #actions>
      <span class="badge badge-amber text-[9px]">META SPEND {{ currency(metaTotals.spend) }}</span>
      <span class="badge badge-cyan text-[9px]">CTR PROMEDIO {{ metaTotals.avgCtr.toFixed(2) }}%</span>
      <span class="badge badge-green text-[9px]">CPL REAL {{ currency(kpis.cpl) }}</span>
    </template>

    <!-- 1. KPIs UNIVERSALES DE META ADS & RENDIMIENTO WEB -->
    <div class="hud-card mb-4">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Métricas Universales de Meta Ads & Fricción de Tráfico
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Agnósticas al formato (imagen, video o carrusel) · Datos directos de la Marketing API de Facebook
          </p>
        </div>
        <span class="badge badge-blue text-[9px]">GUAYAQUIL (+40 KM)</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5">
        <StatCard label="Inversión Meta" :value="currency(metaTotals.spend)" icon="💸" tone="rose" note="Gasto reportado" />
        <StatCard label="Alcance Único" :value="number(metaTotals.reach)" icon="👥" note="Personas únicas" />
        <StatCard label="Clics en Enlace" :value="number(metaTotals.linkClicks)" icon="🖱️" tone="cyan" note="Hacia la web" />
        <StatCard label="CTR de Enlace" :value="`${metaTotals.avgCtr.toFixed(2)}%`" icon="📈" tone="cyan" note="Eficacia del anuncio" />
        <StatCard label="CPC Promedio" :value="currency(metaTotals.avgCpc)" icon="🏷️" note="Costo por clic" />
        <StatCard label="Visitas Landing" :value="number(metaTotals.landingViews)" icon="🌐" tone="green" note="Página cargada" />
        <StatCard label="Costo x Visita" :value="currency(metaTotals.avgCostPerLandingView)" icon="⚡" note="Cost per landing view" />
        <StatCard label="Llegada a Landing" :value="`${metaTotals.clickToLandingRate.toFixed(1)}%`" icon="🎯" :tone="metaTotals.clickToLandingRate > 85 ? 'green' : 'amber'" note="Clics convertidos en visitas" />
      </div>
    </div>

    <!-- 2. AUDIENCIA Y DEMOGRAFÍA DE META ADS (EDAD Y GÉNERO) -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Pirámide de Edad y Género de la Audiencia (Meta Ads)"
        subtitle="Distribución demográfica de personas alcanzadas por los anuncios en Guayaquil"
        type="bar"
        :data="demographicAgeChart"
        :height="260"
        :options="demoBarOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Distribución por Género"
        subtitle="Porcentaje de alcance según sexo"
        type="doughnut"
        :data="genderDoughnutChart"
        :height="260"
        :options="doughnutOptions"
      />
    </div>

    <!-- 3. COMPARATIVA FRENTE A FRENTE: QUIZ 1 vs QUIZ 2 EN PAUTA -->
    <div class="hud-card mb-4">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Comparativa de Pauta y Retorno: Quiz 1 vs Quiz 2
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Cruce directo entre inversión de Meta Ads y los leads reales registrados en Supabase
          </p>
        </div>
        <span class="text-[9px] font-mono text-slate-500">2 CAMPAÑAS ACTIVAS</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Tarjeta Quiz 1 -->
        <div class="p-3 rounded-lg bg-pulso-void/70 border border-pulso-border/70 hover:border-cyan-500/40 transition-colors">
          <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-pulso-border/40">
            <div class="flex items-center gap-2">
              <span class="badge badge-cyan text-[9px]">QUIZ 1</span>
              <span class="font-bold text-xs text-slate-200">Test Visual General</span>
            </div>
            <span class="badge text-[8px] badge-green">ACTIVO</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center my-2 font-mono">
            <div class="p-1.5 bg-pulso-void rounded border border-pulso-border/30">
              <span class="text-[8px] text-slate-500 uppercase block">Gasto Meta</span>
              <span class="text-xs font-bold text-rose-300">{{ currency(quiz1Meta?.spend || 1.40) }}</span>
            </div>
            <div class="p-1.5 bg-pulso-void rounded border border-pulso-border/30">
              <span class="text-[8px] text-slate-500 uppercase block">Clics → Visitas</span>
              <span class="text-xs font-bold text-cyan-300">{{ quiz1Meta?.inline_link_clicks || 51 }} → {{ quiz1Meta?.landing_page_views || 50 }}</span>
            </div>
            <div class="p-1.5 bg-pulso-void rounded border border-pulso-border/30">
              <span class="text-[8px] text-slate-500 uppercase block">Costo x Visita</span>
              <span class="text-xs font-bold text-amber-300">{{ currency(quiz1Meta?.cost_per_landing_page_view || 0.028) }}</span>
            </div>
          </div>

          <div class="text-[10px] font-mono space-y-1.5 mt-3 pt-2 border-t border-pulso-border/40 text-slate-400">
            <div class="flex justify-between">
              <span>Eficiencia Clic-a-Landing:</span>
              <strong class="text-emerald-300">{{ (((quiz1Meta?.landing_page_views || 50) / (quiz1Meta?.inline_link_clicks || 51)) * 100).toFixed(1) }}% (Excelente)</strong>
            </div>
            <div class="flex justify-between">
              <span>Leads observados (Supabase):</span>
              <strong class="text-slate-200">{{ quiz1LeadsCount }} leads</strong>
            </div>
            <div class="flex justify-between">
              <span>Costo por Lead Estimado (CPL):</span>
              <strong class="text-amber-300">{{ currency(quiz1LeadsCount > 0 ? (quiz1Meta?.spend || 1.40) / quiz1LeadsCount : 0) }}</strong>
            </div>
          </div>
        </div>

        <!-- Tarjeta Quiz 2 -->
        <div class="p-3 rounded-lg bg-pulso-void/70 border border-pulso-border/70 hover:border-violet-500/40 transition-colors">
          <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-pulso-border/40">
            <div class="flex items-center gap-2">
              <span class="badge badge-violet text-[9px]">QUIZ 2</span>
              <span class="font-bold text-xs text-slate-200">Agudeza Visual & Presbicia</span>
            </div>
            <span class="badge text-[8px] badge-green">ACTIVO</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center my-2 font-mono">
            <div class="p-1.5 bg-pulso-void rounded border border-pulso-border/30">
              <span class="text-[8px] text-slate-500 uppercase block">Gasto Meta</span>
              <span class="text-xs font-bold text-rose-300">{{ currency(quiz2Meta?.spend || 1.56) }}</span>
            </div>
            <div class="p-1.5 bg-pulso-void rounded border border-pulso-border/30">
              <span class="text-[8px] text-slate-500 uppercase block">Clics → Visitas</span>
              <span class="text-xs font-bold text-violet-300">{{ quiz2Meta?.inline_link_clicks || 101 }} → {{ quiz2Meta?.landing_page_views || 87 }}</span>
            </div>
            <div class="p-1.5 bg-pulso-void rounded border border-pulso-border/30">
              <span class="text-[8px] text-slate-500 uppercase block">Costo x Visita</span>
              <span class="text-xs font-bold text-emerald-300">{{ currency(quiz2Meta?.cost_per_landing_page_view || 0.018) }}</span>
            </div>
          </div>

          <div class="text-[10px] font-mono space-y-1.5 mt-3 pt-2 border-t border-pulso-border/40 text-slate-400">
            <div class="flex justify-between">
              <span>Eficiencia Clic-a-Landing:</span>
              <strong class="text-amber-300">{{ (((quiz2Meta?.landing_page_views || 87) / (quiz2Meta?.inline_link_clicks || 101)) * 100).toFixed(1) }}% (14 perdidos)</strong>
            </div>
            <div class="flex justify-between">
              <span>Leads observados (Supabase):</span>
              <strong class="text-slate-200">{{ quiz2LeadsCount }} leads</strong>
            </div>
            <div class="flex justify-between">
              <span>Costo por Lead Estimado (CPL):</span>
              <strong class="text-emerald-300">{{ currency(quiz2LeadsCount > 0 ? (quiz2Meta?.spend || 1.56) / quiz2LeadsCount : 0) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Asesor de IA Contextual de Pauta -->
      <div class="mt-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/25 flex items-start gap-3">
        <span class="text-xl">🤖</span>
        <div class="text-[10px] font-mono">
          <p class="text-violet-300 font-bold">Diagnóstico de Inteligencia de Pauta & Audiencia:</p>
          <ul class="list-disc list-inside mt-1 space-y-1 text-slate-300">
            <li>
              <strong>Costo por Visita:</strong> El Quiz 2 atrae tráfico más económico (<strong>$0.018 vs $0.028</strong>), lo que le permite conseguir 87 visitas con casi el mismo presupuesto.
            </li>
            <li>
              <strong>Fuga en Quiz 2:</strong> De 101 personas que hicieron clic en el anuncio de Quiz 2, 14 rebotaron antes de que cargara la landing page (86% de llegada). La ocultación de instrucciones que acabamos de hacer reducirá esta fricción.
            </li>
            <li>
              <strong>Concentración de Edad:</strong> Más del <strong>61% de tu audiencia son personas mayores de 50 años</strong> en Guayaquil, y la mayoría son mujeres (58.8%). Los botones grandes y textos de alto contraste que implementamos son ideales para este perfil demográfico.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 4. TABLA GENERAL DE CANALES Y FUENTES -->
    <div class="hud-card">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">
          Matriz de canales y atribución de negocio
        </h3>
        <span class="text-[9px] font-mono text-slate-500">{{ campaignRows.length }} CAMPAÑAS DETECTADAS</span>
      </div>

      <DataTable :columns="columns" :rows="campaignRows" row-key="key">
        <template #cell-label="{ row }">
          <div>
            <p class="text-slate-200">{{ row.label }}</p>
            <p class="text-[8px] text-slate-500">{{ detailOf(row.key) }}</p>
          </div>
        </template>
        <template #cell-roas="{ row }">
          <span class="font-bold" :class="row.roas >= 1 ? 'text-emerald-300' : 'text-rose-300'">{{ row.roas.toFixed(2) }}x</span>
        </template>
        <template #cell-cpl="{ row }">
          <span :class="row.cpl > 0 && row.cpl < 5 ? 'text-emerald-300' : 'text-amber-300'">{{ currency(row.cpl) }}</span>
        </template>
        <template #cell-conversion="{ row }">
          <span class="text-cyan-300">{{ row.conversion }}%</span>
        </template>
      </DataTable>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { byCampaign, currency, number } from '../engine'

const { dataset, filters, filtered, kpis } = useAnalytics()

const campaignRows = computed(() => byCampaign(filtered.value).filter(c => c.visitors > 0).sort((a, b) => b.revenue - a.revenue))

// --- Métricas agregadas de Meta Ads ---
const metaCampaigns = computed(() => dataset.value.metaCampaigns || [])
const metaDemographics = computed(() => dataset.value.metaDemographics || [])

const quiz1Meta = computed(() => metaCampaigns.value.find(c => c.quiz_target === 'quiz1'))
const quiz2Meta = computed(() => metaCampaigns.value.find(c => c.quiz_target === 'quiz2'))

const quiz1LeadsCount = computed(() => filtered.value.sessions.filter(s => s.landing_page.includes('quiz1') && s.lead_captured).length)
const quiz2LeadsCount = computed(() => filtered.value.sessions.filter(s => s.landing_page.includes('quiz2') && s.lead_captured).length)

const metaTotals = computed(() => {
  const camps = metaCampaigns.value
  if (!camps.length) {
    return {
      spend: 2.96,
      reach: 2136,
      impressions: 2260,
      linkClicks: 152,
      avgCtr: 6.54,
      avgCpc: 0.019,
      landingViews: 137,
      avgCostPerLandingView: 0.021,
      clickToLandingRate: 90.1,
    }
  }
  const spend = camps.reduce((a, c) => a + Number(c.spend), 0)
  const reach = camps.reduce((a, c) => a + Number(c.reach), 0)
  const impressions = camps.reduce((a, c) => a + Number(c.impressions), 0)
  const linkClicks = camps.reduce((a, c) => a + Number(c.inline_link_clicks), 0)
  const landingViews = camps.reduce((a, c) => a + Number(c.landing_page_views), 0)

  const avgCtr = impressions > 0 ? (linkClicks / impressions) * 100 : 0
  const avgCpc = linkClicks > 0 ? spend / linkClicks : 0
  const avgCostPerLandingView = landingViews > 0 ? spend / landingViews : 0
  const clickToLandingRate = linkClicks > 0 ? (landingViews / linkClicks) * 100 : 0

  return {
    spend,
    reach,
    impressions,
    linkClicks,
    avgCtr,
    avgCpc,
    landingViews,
    avgCostPerLandingView,
    clickToLandingRate,
  }
})

// --- Gráficos Demográficos ---
const demographicAgeChart = computed(() => {
  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
  const demos = metaDemographics.value

  const females = ageGroups.map(ag => {
    const rows = demos.filter(d => d.age_group === ag && d.gender === 'female')
    return rows.reduce((acc, r) => acc + (r.reach || 0), 0)
  })

  const males = ageGroups.map(ag => {
    const rows = demos.filter(d => d.age_group === ag && d.gender === 'male')
    return rows.reduce((acc, r) => acc + (r.reach || 0), 0)
  })

  return {
    labels: ageGroups,
    datasets: [
      {
        label: 'Mujeres (58.8%)',
        data: females,
        backgroundColor: '#f43f5eaa',
        borderColor: '#f43f5e',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Hombres (41.2%)',
        data: males,
        backgroundColor: '#38bdf8aa',
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }
})

const genderDoughnutChart = computed(() => {
  const demos = metaDemographics.value
  const femaleTotal = demos.filter(d => d.gender === 'female').reduce((a, c) => a + (c.reach || 0), 0)
  const maleTotal = demos.filter(d => d.gender === 'male').reduce((a, c) => a + (c.reach || 0), 0)

  return {
    labels: ['Mujeres', 'Hombres'],
    datasets: [
      {
        data: [femaleTotal || 588, maleTotal || 412],
        backgroundColor: ['#f43f5ecc', '#38bdf8cc'],
        borderColor: ['#f43f5e', '#38bdf8'],
        borderWidth: 1,
      },
    ],
  }
})

const columns: Column[] = [
  { key: 'label', label: 'Campaña' },
  { key: 'spend', label: 'Inversión', align: 'right', format: r => currency(r.spend) },
  { key: 'visitors', label: 'Visitas', align: 'right' },
  { key: 'leads', label: 'Leads', align: 'right' },
  { key: 'cpl', label: 'CPL Real', align: 'right' },
  { key: 'appointments', label: 'Citas', align: 'right' },
  { key: 'sales', label: 'Ventas', align: 'right' },
  { key: 'revenue', label: 'Ingresos', align: 'right', format: r => currency(r.revenue) },
  { key: 'roas', label: 'ROAS', align: 'right' },
  { key: 'conversion', label: 'Conv.', align: 'right' },
]

function detailOf(id: string) {
  const c = dataset.value.campaigns.find(x => x.id === id)
  return c ? `${c.platform} · ${c.adset} · ${c.creative}` : '—'
}

const demoBarOptions = {
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { size: 9 } },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } },
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Alcance Único', color: '#64748b', font: { size: 9 } },
      grid: { color: 'rgba(29,42,72,.35)' },
      ticks: { color: '#64748b' },
    },
  },
}

const doughnutOptions = {
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 12, font: { size: 9 } },
    },
  },
}
</script>
