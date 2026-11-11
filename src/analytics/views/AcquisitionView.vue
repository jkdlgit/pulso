<template>
  <PageHeader
    code="04 // ACQUISITION & CAMPAIGNS"
    title="Adquisición y campañas publicitarias"
    description="Qué canales traen visitantes, cuáles generan leads y cuáles producen clientes de mayor valor. Se separan las métricas reportadas por las plataformas de los resultados observados en el sitio."
  >
    <template #actions>
      <span class="badge badge-amber text-[9px]">INVERSIÓN {{ currency(kpis.adSpend) }}</span>
      <span class="badge badge-green text-[9px]">ROAS {{ roas.toFixed(2) }}x</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Inversión" :value="currency(kpis.adSpend)" icon="💸" tone="rose" :note="`${filters.days} días`" />
      <StatCard label="Impresiones" :value="number(platformTotals.impressions)" icon="👁️" note="Reportado por plataformas" />
      <StatCard label="Clics" :value="number(platformTotals.clicks)" icon="🖱️" note="Reportado por plataformas" />
      <StatCard label="CTR" :value="`${platformTotals.ctr}%`" icon="📈" tone="cyan" note="Clics / impresiones" />
      <StatCard label="Visitantes" :value="number(kpis.visitors)" icon="👥" note="Observado en el sitio" />
      <StatCard label="Leads" :value="number(kpis.leads)" icon="🧾" tone="green" note="Observado en el sitio" />
      <StatCard label="Costo por lead" :value="currency(kpis.cpl)" icon="🎯" tone="amber" note="Inversión / leads" />
      <StatCard label="Costo por cliente" :value="currency(kpis.cac)" icon="💳" tone="rose" note="Inversión / compradores" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Inversión vs ingresos por campaña"
        subtitle="Retorno observado, no atribuido automáticamente"
        type="bar"
        :data="campaignSpendChart"
        :height="250"
        :options="groupedOptions"
        :empty="campaignRows.length === 0"
        class="xl:col-span-2"
      />
      <ChartCard title="Distribución de inversión" subtitle="Por plataforma publicitaria" type="doughnut" :data="platformChart" :height="250" :options="doughnutOptions" :empty="platformChart.labels.length === 0" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Embudo por fuente"
        subtitle="Visitantes → leads → ventas"
        type="bar"
        :data="sourceFunnelChart"
        :height="250"
        :options="groupedOptions"
        :empty="sourceRows.length === 0"
        class="xl:col-span-2"
      />
      <ChartCard
        title="ROAS por campaña"
        subtitle="Ingresos por cada dólar invertido"
        type="bar"
        :data="roasChart"
        :height="250"
        :options="roasOptions"
        :empty="campaignRows.length === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Calidad del tráfico por campaña"
        subtitle="Visitantes (eje X) vs conversión (eje Y) · tamaño = ingresos"
        type="bubble"
        :data="qualityChart"
        :height="260"
        :options="bubbleOptions"
        :empty="campaignRows.length === 0"
        class="xl:col-span-2"
      />
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Datos observados vs reportados
        </h3>
        <div class="space-y-2 text-[10px] font-mono">
          <div class="flex items-center justify-between p-2 rounded bg-cyan-500/5 border border-cyan-500/20">
            <span class="text-slate-400">Impresiones (Meta/Google/TikTok)</span>
            <span class="text-cyan-300 font-bold">{{ number(platformTotals.impressions) }}</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-cyan-500/5 border border-cyan-500/20">
            <span class="text-slate-400">Clics reportados</span>
            <span class="text-cyan-300 font-bold">{{ number(platformTotals.clicks) }}</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/20">
            <span class="text-slate-400">Sesiones observadas</span>
            <span class="text-emerald-300 font-bold">{{ number(kpis.sessions) }}</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/20">
            <span class="text-slate-400">Leads observados</span>
            <span class="text-emerald-300 font-bold">{{ number(kpis.leads) }}</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-amber-500/5 border border-amber-500/20">
            <span class="text-slate-400">Ventas observadas</span>
            <span class="text-amber-300 font-bold">{{ number(kpis.sales) }}</span>
          </div>
        </div>
        <p class="mt-2 text-[8px] font-mono text-slate-500 leading-relaxed">
          La diferencia entre clics y sesiones puede deberse a bloqueadores, rebotes o atribución. No se asume causalidad: las ventas se vinculan por sesión y origen declarado.
        </p>
      </div>
    </div>

    <div class="hud-card">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Matriz de campañas</h3>
        <span class="text-[9px] font-mono text-slate-500">{{ campaignRows.length }} CAMPAÑAS CON ACTIVIDAD</span>
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

      <div v-if="worst" class="mt-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/25 flex items-start gap-2">
        <span class="text-lg">🚨</span>
        <div class="text-[10px] font-mono">
          <p class="text-rose-300 font-bold">Campaña con tráfico que no convierte: {{ worst.label }}</p>
          <p class="text-slate-400 mt-0.5">
            {{ worst.visitors }} visitantes · {{ worst.leads }} leads · {{ worst.sales }} ventas · conversión {{ worst.conversion }}%.
            Revisar coherencia entre anuncio, creatividad y página de destino.
          </p>
        </div>
      </div>
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
import { byCampaign, bySource, currency, number } from '../engine'

const { dataset, filters, filtered, kpis } = useAnalytics()

const campaignRows = computed(() => byCampaign(filtered.value).filter(c => c.visitors > 0).sort((a, b) => b.revenue - a.revenue))
const sourceRows = computed(() => bySource(filtered.value))
const roas = computed(() => kpis.value.adSpend ? kpis.value.revenue / kpis.value.adSpend : 0)
const worst = computed(() => [...campaignRows.value].filter(c => c.visitors >= 40).sort((a, b) => a.conversion - b.conversion)[0])

const platformTotals = computed(() => {
  const impressions = filtered.value.campaigns.reduce((a, c) => a + c.impressions, 0)
  const clicks = filtered.value.campaigns.reduce((a, c) => a + c.clicks, 0)
  return { impressions, clicks, ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0 }
})

const campaignSpendChart = computed(() => ({
  labels: campaignRows.value.map(c => c.label.length > 22 ? `${c.label.slice(0, 21)}…` : c.label),
  datasets: [
    { label: 'Inversión', data: campaignRows.value.map(c => c.spend), backgroundColor: '#f43f5eaa', borderColor: '#f43f5e', borderWidth: 1, borderRadius: 4 },
    { label: 'Ingresos', data: campaignRows.value.map(c => c.revenue), backgroundColor: '#10b981bb', borderColor: '#10b981', borderWidth: 1, borderRadius: 4 },
  ],
}))

const platformChart = computed(() => {
  const map = new Map<string, number>()
  filtered.value.campaigns.forEach(c => map.set(c.platform, (map.get(c.platform) || 0) + c.spend * filters.days))
  const colors: Record<string, string> = { 'Meta Ads': '#3b82f6', 'Google Ads': '#f59e0b', 'TikTok Ads': '#22d3ee' }
  return {
    labels: [...map.keys()],
    datasets: [{ data: [...map.values()], backgroundColor: [...map.keys()].map(k => `${colors[k] || '#38bdf8'}cc`), borderColor: [...map.keys()].map(k => colors[k] || '#38bdf8'), borderWidth: 1 }],
  }
})

const sourceFunnelChart = computed(() => ({
  labels: sourceRows.value.slice(0, 6).map(s => s.label),
  datasets: [
    { label: 'Visitantes', data: sourceRows.value.slice(0, 6).map(s => s.visitors), backgroundColor: '#38bdf8bb', borderRadius: 4 },
    { label: 'Leads', data: sourceRows.value.slice(0, 6).map(s => s.leads), backgroundColor: '#10b981bb', borderRadius: 4 },
    { label: 'Ventas', data: sourceRows.value.slice(0, 6).map(s => s.sales), backgroundColor: '#f59e0bbb', borderRadius: 4 },
  ],
}))

const roasChart = computed(() => ({
  labels: campaignRows.value.map(c => c.label.length > 18 ? `${c.label.slice(0, 17)}…` : c.label),
  datasets: [{
    label: 'ROAS',
    data: campaignRows.value.map(c => c.roas),
    backgroundColor: campaignRows.value.map(c => c.roas >= 1 ? '#10b981bb' : '#f43f5eaa'),
    borderColor: campaignRows.value.map(c => c.roas >= 1 ? '#10b981' : '#f43f5e'),
    borderWidth: 1, borderRadius: 4,
  }],
}))

const qualityChart = computed(() => {
  const colors: Record<string, string> = { 'Meta Ads': '#3b82f6', 'Google Ads': '#f59e0b', 'TikTok Ads': '#22d3ee' }
  return {
    datasets: campaignRows.value.map(c => {
      const camp = dataset.value.campaigns.find(x => x.id === c.key)
      return {
        label: c.label,
        data: [{ x: c.visitors, y: c.conversion, r: Math.max(5, Math.min(22, Math.sqrt(c.revenue) / 3)) }],
        backgroundColor: `${colors[camp?.platform || 'Meta Ads'] || '#38bdf8'}99`,
        borderColor: colors[camp?.platform || 'Meta Ads'] || '#38bdf8',
        borderWidth: 1.5,
      }
    }),
  }
})

const columns: Column[] = [
  { key: 'label', label: 'Campaña' },
  { key: 'spend', label: 'Inversión', align: 'right', format: r => currency(r.spend) },
  { key: 'visitors', label: 'Visitas', align: 'right' },
  { key: 'leads', label: 'Leads', align: 'right' },
  { key: 'cpl', label: 'CPL', align: 'right' },
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

const groupedOptions = {
  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 10, font: { size: 9 } } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 }, maxRotation: 30 } },
    y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } },
  },
}
const roasOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 8 } } } } }
const doughnutOptions = { cutout: '64%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 10, font: { size: 9 } } } } }
const bubbleOptions = {
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw.x} visitas · ${ctx.raw.y}% conv.` } } },
  scales: {
    x: { beginAtZero: true, title: { display: true, text: 'Visitantes', color: '#64748b', font: { size: 9 } }, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } },
    y: { beginAtZero: true, title: { display: true, text: 'Conversión %', color: '#64748b', font: { size: 9 } }, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } },
  },
}
</script>
