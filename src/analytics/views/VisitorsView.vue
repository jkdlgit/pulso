<template>
  <PageHeader
    code="02 // VISITANTES"
    title="Perfil y comportamiento de la audiencia"
    description="Identificadores anónimos, sesiones, dispositivos, origen y resultado comercial. No se asume que dos dispositivos pertenezcan a la misma persona sin evidencia."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ rows.length }} VISITANTES</span>
      <span class="badge badge-muted text-[9px]">{{ identifiedCount }} IDENTIFICADOS</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Visitantes" :value="number(kpis.visitors)" icon="👥" :delta="delta(kpis.visitors, prevKpis.visitors)" />
      <StatCard label="Nuevos" :value="number(kpis.newVisitors)" icon="✨" tone="green" note="Primera visita en el período" />
      <StatCard label="Recurrentes" :value="number(kpis.returningVisitors)" icon="🔁" tone="violet" note="Ya habían visitado antes" />
      <StatCard label="Sesiones" :value="number(kpis.sessions)" icon="🧭" note="Total del período" />
      <StatCard label="Sesiones / visitante" :value="avgSessions" icon="📊" tone="slate" note="Frecuencia media" />
      <StatCard label="Leads" :value="number(kpis.leads)" icon="🧾" tone="green" note="Datos declarados" />
      <StatCard label="Compradores" :value="number(kpis.sales)" icon="💳" tone="green" note="Vinculados con venta" />
      <StatCard label="Ingreso / visitante" :value="currency(incomePerVisitor)" icon="💵" tone="amber" note="Promedio atribuido" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-4">
      <ChartCard title="Dispositivos" subtitle="Sesiones por tipo" type="doughnut" :data="deviceChart" :height="190" :options="doughnutOptions" />
      <ChartCard title="Nuevos vs recurrentes" subtitle="Composición de la audiencia" type="doughnut" :data="statusChart" :height="190" :options="doughnutOptions" />
      <ChartCard title="Ciudades" subtitle="Ubicación aproximada por IP" type="bar" :data="cityChart" :height="190" :options="cityOptions" />
      <ChartCard title="Fuentes" subtitle="Origen de los visitantes" type="bar" :data="sourceChart" :height="190" :options="cityOptions" />
    </div>

    <div class="hud-card">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-pulso-border/50">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Directorio de visitantes</h3>
        <div class="flex items-center gap-2">
          <input
            v-model="search"
            placeholder="Buscar por ciudad, fuente, campaña..."
            class="bg-pulso-void border border-pulso-border rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-200 w-56 focus:outline-none focus:border-cyan-400"
          />
          <select v-model="outcome" class="bg-pulso-void border border-pulso-border rounded-lg px-2 py-1.5 text-[10px] font-mono text-slate-300 cursor-pointer focus:outline-none focus:border-cyan-400">
            <option value="all">Todos</option>
            <option value="buyer">Compradores</option>
            <option value="lead">Leads</option>
            <option value="visitor">Solo visitantes</option>
          </select>
        </div>
      </div>

      <DataTable :columns="columns" :rows="paged" row-key="id" clickable @row-click="openProfile">
        <template #cell-id="{ row }">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded border border-pulso-border bg-pulso-surface flex items-center justify-center text-[8px] text-cyan-300 font-bold">
              {{ row.city.slice(0, 2).toUpperCase() }}
            </div>
            <div>
              <p class="text-slate-200 text-[10px]">{{ row.id }}</p>
              <p class="text-[8px] text-slate-500">{{ row.city }} · {{ row.deviceLabel }}</p>
            </div>
          </div>
        </template>
        <template #cell-status="{ row }">
          <span class="badge text-[8px] py-0 px-1.5" :class="row.is_returning ? 'badge-violet badge' : 'badge-cyan'">
            {{ row.is_returning ? 'RECURRENTE' : 'NUEVO' }}
          </span>
        </template>
        <template #cell-outcome="{ row }">
          <span class="badge text-[8px] py-0 px-1.5" :class="row.is_buyer ? 'badge-green' : row.is_lead ? 'badge-amber' : 'badge-muted'">
            {{ row.is_buyer ? 'COMPRADOR' : row.is_lead ? 'LEAD' : 'VISITANTE' }}
          </span>
        </template>
        <template #cell-source="{ row }">
          <span class="text-slate-300">{{ sourceLabel(row.source) }}</span>
          <span class="text-[8px] text-slate-600 block">{{ row.campaignName }}</span>
        </template>
        <template #cell-revenue="{ row }">
          <span :class="row.revenue > 0 ? 'text-emerald-300 font-bold' : 'text-slate-600'">{{ row.revenue > 0 ? currency(row.revenue) : '—' }}</span>
        </template>
      </DataTable>

      <div class="flex items-center justify-between mt-3 pt-2 border-t border-pulso-border/50 text-[9px] font-mono text-slate-500">
        <span>MOSTRANDO {{ paged.length }} DE {{ rows.length }}</span>
        <div class="flex items-center gap-1">
          <button @click="page = Math.max(1, page - 1)" class="btn-hud-secondary py-1 px-2 text-[9px]" :disabled="page === 1">←</button>
          <span class="px-2">PÁG. {{ page }} / {{ totalPages }}</span>
          <button @click="page = Math.min(totalPages, page + 1)" class="btn-hud-secondary py-1 px-2 text-[9px]" :disabled="page === totalPages">→</button>
        </div>
      </div>
    </div>

    <!-- Ficha individual -->
    <div v-if="selected" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="selected = null"></div>
      <aside class="relative w-full max-w-[460px] h-full bg-pulso-surface border-l border-pulso-border overflow-y-auto">
        <div class="sticky top-0 bg-pulso-surface/95 backdrop-blur border-b border-pulso-border p-4 z-10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Ficha de visitante</p>
              <p class="font-tech text-sm font-bold text-slate-100">{{ selected.id }}</p>
            </div>
            <button @click="selected = null" class="btn-hud-secondary text-[10px] py-1 px-2">✕ CERRAR</button>
          </div>
        </div>

        <div class="p-4 space-y-4">
          <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div v-for="f in profileFields" :key="f.label" class="p-2 rounded-lg bg-pulso-void/60 border border-pulso-border/50">
              <p class="text-[8px] text-slate-500 uppercase tracking-wider">{{ f.label }}</p>
              <p class="text-slate-200 mt-0.5">{{ f.value }}</p>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/25 text-[9px] font-mono text-amber-200/80">
            🔒 Identificador seudónimo. Los datos personales solo existen si la persona los declaró en un formulario autorizado.
          </div>

          <div>
            <p class="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-2">// Recorrido cronológico ({{ visitorSessions.length }} sesiones)</p>
            <div class="space-y-2">
              <div v-for="s in visitorSessions" :key="s.id" class="p-2.5 rounded-lg bg-pulso-void/50 border border-pulso-border/50">
                <div class="flex items-center justify-between text-[9px] font-mono">
                  <span class="text-slate-300">{{ formatDate(s.started_at, true) }}</span>
                  <span class="text-slate-500">{{ Math.round(s.duration_s / 60) }}m · {{ s.page_count }} pág.</span>
                </div>
                <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span class="badge badge-cyan text-[8px] py-0 px-1.5">{{ sourceLabel(s.source) }}</span>
                  <span class="badge badge-muted text-[8px] py-0 px-1.5">{{ s.device }}</span>
                  <span v-if="s.quiz_completed" class="badge badge-green text-[8px] py-0 px-1.5">TEST ✓</span>
                  <span v-if="s.lead_captured" class="badge badge-amber text-[8px] py-0 px-1.5">LEAD</span>
                  <span v-if="s.attended" class="badge badge-cyan text-[8px] py-0 px-1.5">ASISTIÓ</span>
                  <span v-if="s.purchased" class="badge badge-green text-[8px] py-0 px-1.5">COMPRA {{ currency(s.revenue) }}</span>
                </div>
                <p class="text-[8px] font-mono text-slate-500 mt-1 truncate">
                  {{ s.pageviews.map(p => p.label).join(' → ') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { byCity, byDevice, bySource, currency, formatDate, number } from '../engine'
import { sourceLabel } from '../demo'
import type { Visitor } from '../types'

const { dataset, filtered, kpis, prevKpis, delta, business } = useAnalytics()

const search = ref('')
const outcome = ref<'all' | 'buyer' | 'lead' | 'visitor'>('all')
const page = ref(1)
const perPage = 12
const selected = ref<any | null>(null)

const deviceRows = computed(() => byDevice(filtered.value))
const cityRows = computed(() => byCity(filtered.value))
const sourceRows = computed(() => bySource(filtered.value))

const rows = computed(() => {
  const sessionCount = new Map<string, number>()
  filtered.value.sessions.forEach(s => sessionCount.set(s.visitor_id, (sessionCount.get(s.visitor_id) || 0) + 1))
  return filtered.value.visitors.map(v => {
    const camp = dataset.value.campaigns.find(c => c.id === v.campaign_id)
    return {
      ...v,
      deviceLabel: v.device === 'mobile' ? 'Móvil' : v.device === 'desktop' ? 'Escritorio' : 'Tablet',
      campaignName: camp?.name || 'Sin campaña',
      periodSessions: sessionCount.get(v.id) || 0,
    }
  }).filter(v => {
    const q = search.value.trim().toLowerCase()
    const match = !q || v.id.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.source.includes(q) || v.campaignName.toLowerCase().includes(q)
    const out = outcome.value === 'all' ? true : outcome.value === 'buyer' ? v.is_buyer : outcome.value === 'lead' ? (v.is_lead && !v.is_buyer) : (!v.is_lead && !v.is_buyer)
    return match && out
  }).sort((a, b) => b.last_seen.localeCompare(a.last_seen))
})
const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / perPage)))
const paged = computed(() => rows.value.slice((page.value - 1) * perPage, page.value * perPage))
watch([search, outcome], () => { page.value = 1 })

const identifiedCount = computed(() => filtered.value.visitors.filter(v => v.is_identified).length)
const avgSessions = computed(() => filtered.value.visitors.length ? (filtered.value.sessions.length / filtered.value.visitors.length).toFixed(1) : '0.0')
const incomePerVisitor = computed(() => filtered.value.visitors.length ? kpis.value.revenue / filtered.value.visitors.length : 0)

const visitorSessions = computed(() =>
  selected.value
    ? filtered.value.sessions.filter(s => s.visitor_id === selected.value.id).sort((a, b) => b.started_at.localeCompare(a.started_at))
    : []
)

const profileFields = computed(() => {
  const v: Visitor | null = selected.value
  if (!v) return []
  return [
    { label: 'Ciudad', value: v.city },
    { label: 'País', value: v.country },
    { label: 'Dispositivo', value: `${v.device} · ${v.os}` },
    { label: 'Navegador', value: v.browser },
    { label: 'Idioma', value: v.language },
    { label: 'Fuente', value: sourceLabel(v.source) },
    { label: 'Campaña', value: v.ad || 'Sin campaña' },
    { label: 'Primera visita', value: formatDate(v.first_seen, true) },
    { label: 'Última visita', value: formatDate(v.last_seen, true) },
    { label: 'Sesiones totales', value: String(v.sessions_count) },
    { label: 'Estado', value: v.is_buyer ? 'Comprador' : v.is_lead ? 'Lead' : 'Anónimo' },
    { label: 'Ingresos', value: currency(v.revenue) },
  ]
})

const columns: Column[] = [
  { key: 'id', label: 'Visitante' },
  { key: 'status', label: 'Tipo' },
  { key: 'periodSessions', label: 'Sesiones', align: 'center' },
  { key: 'source', label: 'Fuente / campaña' },
  { key: 'outcome', label: 'Resultado' },
  { key: 'last_seen', label: 'Última visita', format: r => formatDate(r.last_seen, true) },
  { key: 'revenue', label: 'Ingreso', align: 'right' },
]

const deviceChart = computed(() => ({
  labels: deviceRows.value.map(d => d.label),
  datasets: [{ data: deviceRows.value.map(d => d.sessions), backgroundColor: deviceRows.value.map(d => `${d.color}cc`), borderColor: deviceRows.value.map(d => d.color), borderWidth: 1 }],
}))

const statusChart = computed(() => ({
  labels: ['Nuevos', 'Recurrentes'],
  datasets: [{ data: [kpis.value.newVisitors, kpis.value.returningVisitors], backgroundColor: ['#38bdf8cc', '#8b5cf6cc'], borderColor: ['#38bdf8', '#8b5cf6'], borderWidth: 1 }],
}))

const cityChart = computed(() => ({
  labels: cityRows.value.slice(0, 6).map(c => c.city),
  datasets: [{ label: 'Visitantes', data: cityRows.value.slice(0, 6).map(c => c.visitors), backgroundColor: '#38bdf8bb', borderRadius: 4 }],
}))

const sourceChart = computed(() => ({
  labels: sourceRows.value.slice(0, 6).map(s => s.label),
  datasets: [{ label: 'Visitantes', data: sourceRows.value.slice(0, 6).map(s => s.visitors), backgroundColor: sourceRows.value.slice(0, 6).map(s => `${s.color}bb`), borderRadius: 4 }],
}))

const doughnutOptions = { cutout: '62%', plugins: { legend: { display: false } } }
const cityOptions = {
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } },
}

function openProfile(row: any) {
  selected.value = row
}
</script>
