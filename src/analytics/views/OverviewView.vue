<template>
  <PageHeader
    code="01 // OVERVIEW"
    title="Centro de mando comercial"
    :description="`Visión consolidada de ${businessLabel} en los últimos ${filters.days} días. Datos observados, calculados e inferencias marcadas como tales.`"
  >
    <template #tag>
      <span class="badge" :class="kpis.activeNow > 0 ? 'badge-green' : 'badge-muted'">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
        {{ kpis.activeNow }} EN VIVO
      </span>
    </template>
    <template #actions>
      <span class="badge badge-muted text-[9px]">{{ filters.days }}D · {{ formatDate(new Date(Date.now() - filters.days * 86400000).toISOString()) }} → HOY</span>
      <button class="btn-hud text-[10px] py-1.5" @click="exportCsv">📥 EXPORTAR</button>
    </template>

    <!-- Alertas ejecutivas -->
    <div v-if="alerts.length" class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
      <RouterLink
        v-for="a in alerts"
        :key="a.id"
        to="/analytics/insights"
        class="flex items-center gap-3 p-3 rounded-xl border transition-all hover:translate-y-[-1px]"
        :class="a.severity === 'good' ? 'bg-emerald-500/5 border-emerald-500/25 hover:border-emerald-400/50' : 'bg-rose-500/5 border-rose-500/25 hover:border-rose-400/50'"
      >
        <span class="text-lg">{{ a.severity === 'good' ? '✅' : '🚨' }}</span>
        <div class="min-w-0 flex-1">
          <p class="text-[9px] font-mono uppercase tracking-wider" :class="a.severity === 'good' ? 'text-emerald-400' : 'text-rose-400'">
            {{ a.severity === 'good' ? 'OPORTUNIDAD DETECTADA' : 'ALERTA DE RENDIMIENTO' }}
          </p>
          <p class="text-[11px] font-semibold text-slate-200 truncate">{{ a.title }}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="font-tech text-sm font-bold" :class="a.severity === 'good' ? 'text-emerald-300' : 'text-rose-300'">{{ a.metric_value }}</p>
          <p class="text-[8px] font-mono text-slate-500">{{ a.metric_label }}</p>
        </div>
      </RouterLink>
    </div>

    <!-- KPIs principales -->
    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Visitantes" :value="number(kpis.visitors)" icon="👤" :delta="delta(kpis.visitors, prevKpis.visitors)" note="Personas únicas" />
      <StatCard label="Sesiones" :value="number(kpis.sessions)" icon="🧭" :delta="delta(kpis.sessions, prevKpis.sessions)" note="Visitas al sitio" />
      <StatCard label="Leads" :value="number(kpis.leads)" icon="🧾" tone="green" :delta="delta(kpis.leads, prevKpis.leads)" note="Formularios enviados" />
      <StatCard label="Citas" :value="number(kpis.appointments)" icon="📅" tone="violet" :delta="delta(kpis.appointments, prevKpis.appointments)" note="Agendamientos" />
      <StatCard label="Asistencias" :value="number(kpis.attended)" icon="📍" tone="amber" :delta="delta(kpis.attended, prevKpis.attended)" note="Llegaron al local" />
      <StatCard label="Ventas" :value="number(kpis.sales)" icon="💳" tone="green" :delta="delta(kpis.sales, prevKpis.sales)" note="Compras concretadas" />
      <StatCard label="Ingresos" :value="currency(kpis.revenue)" icon="💵" tone="green" :delta="delta(kpis.revenue, prevKpis.revenue)" note="Facturación del período" />
      <StatCard label="ROI publicitario" :value="`${kpis.roi.toFixed(0)}%`" icon="📈" :tone="kpis.roi >= 0 ? 'green' : 'rose'" :delta="delta(kpis.roi, prevKpis.roi)" :note="`ROAS ${roas.toFixed(2)}x`" />
    </div>

    <!-- Banda de eficiencia -->
    <div class="hud-card mb-4 py-3">
      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <div v-for="m in efficiency" :key="m.label">
          <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">{{ m.label }}</p>
          <p class="font-tech text-base font-bold" :class="m.tone">{{ m.value }}</p>
          <p class="text-[8px] font-mono text-slate-600 truncate">{{ m.note }}</p>
        </div>
      </div>
    </div>

    <!-- Gráficas principales -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        class="xl:col-span-2"
        title="Evolución de tráfico y conversiones"
        subtitle="Visitantes, leads y ventas por día"
        type="line"
        :data="trafficChart"
        :height="250"
        badge="SERIE DIARIA"
      />
      <ChartCard
        title="Fuentes de adquisición"
        subtitle="Distribución de visitantes"
        type="doughnut"
        :data="sourceChart"
        :height="250"
        :options="doughnutOptions"
        :empty="sourceRows.length === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Ingresos vs inversión publicitaria"
        subtitle="Retorno económico del período"
        type="bar"
        :data="revenueChart"
        :height="230"
        :options="revenueOptions"
        badge="ECONÓMICO"
      />
      <ChartCard
        title="Embudo de conversión"
        subtitle="Pérdida de personas por etapa"
        type="bar"
        :data="funnelChart"
        :height="230"
        :options="horizontalOptions"
        :empty="funnel.length === 0"
        class="xl:col-span-2"
      >
        <div class="mt-2 grid grid-cols-3 gap-2 text-center">
          <div><p class="text-[8px] font-mono text-slate-500">CONVERSIÓN GLOBAL</p><p class="font-tech text-sm text-cyan-300">{{ kpis.conversionRate }}%</p></div>
          <div><p class="text-[8px] font-mono text-slate-500">ABANDONO TEST</p><p class="font-tech text-sm text-rose-300">{{ kpis.abandonRate }}%</p></div>
          <div><p class="text-[8px] font-mono text-slate-500">TICKET PROMEDIO</p><p class="font-tech text-sm text-emerald-300">{{ currency(kpis.avgTicket) }}</p></div>
        </div>
      </ChartCard>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Ranking de campañas -->
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Rendimiento por campaña
          </h3>
          <RouterLink to="/analytics/acquisition" class="text-[9px] font-mono text-cyan-400 hover:text-cyan-200">VER TODO →</RouterLink>
        </div>
        <DataTable :columns="campaignColumns" :rows="campaignRows" row-key="key">
          <template #cell-label="{ row }">
            <div class="flex flex-col">
              <span class="text-slate-200">{{ row.label }}</span>
              <span class="text-[8px] text-slate-500">{{ platformOf(row.key) }}</span>
            </div>
          </template>
          <template #cell-roas="{ row }">
            <span class="font-bold" :class="row.roas >= 1 ? 'text-emerald-300' : 'text-rose-300'">{{ row.roas.toFixed(2) }}x</span>
          </template>
          <template #cell-conversion="{ row }">
            <span class="text-cyan-300">{{ row.conversion }}%</span>
          </template>
        </DataTable>
      </div>

      <!-- Hallazgos -->
      <div class="hud-card">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            Inteligencia accionable
          </h3>
          <RouterLink to="/analytics/insights" class="text-[9px] font-mono text-violet-300 hover:text-violet-200">AI INSIGHTS →</RouterLink>
        </div>
        <div class="space-y-2">
          <RouterLink
            v-for="i in insights.slice(0, 4)"
            :key="i.id"
            to="/analytics/insights"
            class="block p-2.5 rounded-lg border border-pulso-border/60 hover:border-cyan-500/30 bg-pulso-void/40 transition-colors"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-[8px] font-mono uppercase" :class="severityText(i.severity)">{{ i.category }}</span>
              <span class="text-[8px] font-mono text-slate-600">P{{ i.priority }} · {{ i.confidence }}</span>
            </div>
            <p class="text-[10px] font-semibold text-slate-200 mt-0.5 leading-snug">{{ i.title }}</p>
            <p class="text-[8px] font-mono text-slate-500 truncate mt-0.5">{{ i.metric_label }}: <span :class="severityText(i.severity)">{{ i.metric_value }}</span></p>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Detalle del embudo -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Pérdida detallada por etapa
        </h3>
        <FunnelStages :stages="funnel" />
      </div>
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Actividad en vivo
        </h3>
        <div v-if="live.length" class="space-y-1.5 max-h-[340px] overflow-y-auto">
          <div v-for="s in live" :key="s.id" class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40 text-[10px] font-mono">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
              <span class="text-slate-300 truncate">{{ visitorName(s.visitor_id) }}</span>
              <span class="text-slate-600">{{ s.device === 'mobile' ? '📱' : '💻' }}</span>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="text-slate-500">{{ s.pageviews[s.pageviews.length - 1]?.label || '—' }}</span>
              <span class="text-cyan-300">{{ Math.max(1, Math.round((Date.now() - new Date(s.started_at).getTime()) / 60000)) }}m</span>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center text-[10px] font-mono text-slate-500">
          Sin sesiones activas en los últimos 30 minutos.
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import FunnelStages from '../components/FunnelStages.vue'
import { useAnalytics } from '../store'
import { barDataset, lineDataset } from '../chart'
import {
  byCampaign, bySource, currency, formatDate, liveSessions, number,
} from '../engine'
import type { Insight } from '../types'

const {
  dataset, filters, filtered, kpis, prevKpis, funnel, timeseries, insights, delta, business,
} = useAnalytics()

const businessLabel = computed(() => business.value ? `${business.value.emoji} ${business.value.name}` : 'todos los negocios')
const sourceRows = computed(() => bySource(filtered.value))
const campaignRows = computed(() => byCampaign(filtered.value).filter(c => c.visitors > 0).slice(0, 6))
const live = computed(() => liveSessions(filtered.value).slice(0, 12))
const roas = computed(() => kpis.value.adSpend ? kpis.value.revenue / kpis.value.adSpend : 0)
const alerts = computed(() => insights.value.filter(i => i.severity === 'bad' || i.severity === 'good').slice(0, 2))

const trafficChart = computed(() => ({
  labels: timeseries.value.map(p => p.label),
  datasets: [
    lineDataset('Visitantes', timeseries.value.map(p => p.visitors), '#38bdf8'),
    lineDataset('Leads', timeseries.value.map(p => p.leads), '#10b981'),
    lineDataset('Ventas', timeseries.value.map(p => p.sales), '#f59e0b'),
  ],
}))

const sourceChart = computed(() => ({
  labels: sourceRows.value.map(r => r.label),
  datasets: [{
    data: sourceRows.value.map(r => r.visitors),
    backgroundColor: sourceRows.value.map(r => `${r.color}cc`),
    borderColor: sourceRows.value.map(r => r.color),
    borderWidth: 1,
    hoverOffset: 4,
  }],
}))

const revenueChart = computed(() => ({
  labels: timeseries.value.map(p => p.label),
  datasets: [
    barDataset('Ingresos', timeseries.value.map(p => p.revenue), '#10b981'),
    {
      type: 'line' as const,
      label: 'Inversión',
      data: timeseries.value.map(p => p.adSpend),
      borderColor: '#f43f5e',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      yAxisID: 'y',
    },
  ],
}))

const funnelChart = computed(() => ({
  labels: funnel.value.slice(0, 8).map(f => f.label),
  datasets: [{
    label: 'Personas',
    data: funnel.value.slice(0, 8).map(f => f.count),
    backgroundColor: ['#38bdf8cc', '#22d3eecc', '#10b981cc', '#34d399cc', '#f59e0bcc', '#fbbf24cc', '#8b5cf6cc', '#ec4899cc'],
    borderRadius: 4,
    borderWidth: 0,
  }],
}))

const doughnutOptions = {
  cutout: '66%',
  plugins: {
    legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 10, font: { size: 9 } } },
    tooltip: { backgroundColor: 'rgba(13,19,34,.97)', borderColor: 'rgba(56,189,248,.4)', borderWidth: 1, padding: 8 },
  },
}

const revenueOptions = {
  scales: {
    x: { grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b', maxTicksLimit: 10 } },
    y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } },
  },
}

const horizontalOptions = {
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } },
    y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } },
  },
}

const efficiency = computed(() => [
  { label: 'Conversión global', value: `${kpis.value.conversionRate}%`, note: 'Compra / visitantes', tone: 'text-cyan-300' },
  { label: 'Abandono del test', value: `${kpis.value.abandonRate}%`, note: 'No completan evaluación', tone: 'text-rose-300' },
  { label: 'Costo por lead', value: currency(kpis.value.cpl), note: 'Inversión / leads', tone: 'text-amber-300' },
  { label: 'Costo por cita', value: currency(kpis.value.cpa), note: 'Inversión / citas', tone: 'text-violet-300' },
  { label: 'Costo por cliente', value: currency(kpis.value.cac), note: 'Inversión / compradores', tone: 'text-rose-300' },
  { label: 'Ticket promedio', value: currency(kpis.value.avgTicket), note: 'Ingreso medio por venta', tone: 'text-emerald-300' },
  { label: 'Asistencia a citas', value: `${kpis.value.appointments ? Math.round((kpis.value.attended / kpis.value.appointments) * 100) : 0}%`, note: 'Asistencias / citas', tone: 'text-emerald-300' },
  { label: 'Nuevos vs recurrentes', value: `${kpis.value.newVisitors} / ${kpis.value.returningVisitors}`, note: 'Visitantes del período', tone: 'text-slate-200' },
])

const campaignColumns: Column[] = [
  { key: 'label', label: 'Campaña' },
  { key: 'spend', label: 'Inversión', align: 'right', format: r => currency(r.spend) },
  { key: 'leads', label: 'Leads', align: 'right' },
  { key: 'cpl', label: 'CPL', align: 'right', format: r => currency(r.cpl) },
  { key: 'sales', label: 'Ventas', align: 'right' },
  { key: 'roas', label: 'ROAS', align: 'right' },
  { key: 'conversion', label: 'Conv.', align: 'right' },
]

function platformOf(campaignId: string) {
  const c = dataset.value.campaigns.find(x => x.id === campaignId)
  return c ? `${c.platform} · ${c.adset}` : '—'
}

function visitorName(id: string) {
  const v = dataset.value.visitors.find(x => x.id === id)
  if (!v) return 'Visitante anónimo'
  return `${v.city} · ${v.source}`
}

function severityText(s: Insight['severity']) {
  return s === 'good' ? 'text-emerald-300' : s === 'bad' ? 'text-rose-300' : s === 'warn' ? 'text-amber-300' : 'text-cyan-300'
}

function exportCsv() {
  const rows = campaignRows.value.map(r => [r.label, r.visitors, r.leads, r.appointments, r.sales, r.revenue, r.spend, r.conversion, r.roas])
  const csv = ['Campaña,Visitantes,Leads,Citas,Ventas,Ingresos,Inversión,Conversión %,ROAS', ...rows.map(r => r.join(','))].join('\n')
  const link = document.createElement('a')
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  link.download = `pulso_analytics_overview_${filters.days}d.csv`
  link.click()
}
</script>
