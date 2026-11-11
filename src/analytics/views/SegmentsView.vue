<template>
  <PageHeader
    code="15 // AUDIENCE SEGMENTATION"
    title="Segmentación y comparación de audiencias"
    description="Segmentos dinámicos con filtros combinables. La comparación entre compradores y no compradores revela qué páginas, preguntas y recorridos acompañan la decisión."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ segments.length }} SEGMENTOS</span>
      <button class="btn-hud text-[10px] py-1.5" @click="addCustom">＋ NUEVO SEGMENTO</button>
    </template>

    <!-- Constructor de segmento -->
    <div class="hud-card mb-4 py-3">
      <div class="flex flex-col lg:flex-row lg:items-center gap-2 flex-wrap">
        <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500">Segmento activo:</span>
        <div class="flex items-center gap-1 flex-wrap">
          <button
            v-for="s in segments"
            :key="s.id"
            @click="active = s.id"
            class="px-2.5 py-1.5 rounded text-[9px] font-mono border transition-all"
            :class="active === s.id ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-slate-400 border-pulso-border/60 hover:text-slate-200'"
          >
            {{ s.label }}
          </button>
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center gap-2 text-[9px] font-mono">
          <span class="text-slate-500">Tamaño:</span>
          <span class="badge badge-green">{{ activeSegment.visitors.length }} visitantes</span>
          <span class="badge badge-muted">{{ activeSegment.sessions.length }} sesiones</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Visitantes" :value="number(activeSegment.visitors.length)" icon="👥" />
      <StatCard label="Sesiones" :value="number(activeSegment.sessions.length)" icon="🧭" />
      <StatCard label="Leads" :value="number(activeSegment.leads)" icon="🧾" tone="amber" />
      <StatCard label="Citas" :value="number(activeSegment.appointments)" icon="📅" tone="violet" />
      <StatCard label="Compras" :value="number(activeSegment.sales)" icon="💳" tone="green" />
      <StatCard label="Conversión" :value="`${activeSegment.conversion}%`" icon="🎯" tone="green" />
      <StatCard label="Ticket medio" :value="currency(activeSegment.avgTicket)" icon="💵" tone="green" />
      <StatCard label="Scroll medio" :value="`${activeSegment.scroll}%`" icon="📜" tone="cyan" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Comparación de segmentos"
        subtitle="Visitantes, leads y compras"
        type="bar"
        :data="compareChart"
        :height="250"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Composición del segmento"
        subtitle="Origen del tráfico"
        type="doughnut"
        :data="sourceChart"
        :height="250"
        :options="doughnutOptions"
        :empty="sourceRows.length === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Compradores vs no compradores · páginas
        </h3>
        <DataTable :columns="pageColumns" :rows="pageComparison" row-key="path">
          <template #cell-label="{ row }">
            <span class="text-slate-300">{{ row.label }}</span>
          </template>
          <template #cell-buyerPct="{ row }">
            <span class="text-emerald-300">{{ row.buyerPct }}%</span>
          </template>
          <template #cell-nonBuyerPct="{ row }">
            <span class="text-slate-400">{{ row.nonBuyerPct }}%</span>
          </template>
          <template #cell-gap="{ row }">
            <span :class="row.gap > 0 ? 'text-emerald-300' : 'text-rose-300'">{{ row.gap > 0 ? '+' : '' }}{{ row.gap }} pts</span>
          </template>
        </DataTable>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Comportamiento comparado
        </h3>
        <div class="space-y-3">
          <div v-for="m in behaviorComparison" :key="m.label">
            <div class="flex items-center justify-between text-[9px] font-mono mb-1">
              <span class="text-slate-400">{{ m.label }}</span>
              <span><span class="text-emerald-300">{{ m.buyers }}</span> <span class="text-slate-600">/</span> <span class="text-slate-400">{{ m.nonBuyers }}</span></span>
            </div>
            <div class="flex gap-1 h-2">
              <div class="flex-1 rounded-l bg-pulso-void overflow-hidden">
                <div class="h-full bg-emerald-400" :style="{ width: `${m.buyerPct}%` }"></div>
              </div>
              <div class="flex-1 rounded-r bg-pulso-void overflow-hidden">
                <div class="h-full bg-slate-500" :style="{ width: `${m.nonBuyerPct}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-3 text-[8px] font-mono text-slate-500">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-emerald-400"></span> Compradores</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-slate-500"></span> No compradores</span>
        </div>
      </div>
    </div>

    <div class="hud-card">
      <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
        Rasgos distintivos del segmento
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div v-for="t in traits" :key="t.label" class="p-3 rounded-lg bg-pulso-void/50 border border-pulso-border/50">
          <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">{{ t.label }}</p>
          <p class="font-tech text-lg font-bold mt-0.5" :class="t.tone">{{ t.value }}</p>
          <p class="text-[8px] font-mono text-slate-600">{{ t.note }}</p>
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { bySource, currency, number, pathStats } from '../engine'
import type { Session, Visitor } from '../types'

const { filtered } = useAnalytics()
const active = ref('all')
const custom = ref<{ id: string; label: string; predicate: (s: Session, v?: Visitor) => boolean }[]>([])

const baseSegments = [
  { id: 'all', label: 'Todos' },
  { id: 'buyers', label: 'Compradores' },
  { id: 'nonbuyers', label: 'No compradores' },
  { id: 'leads', label: 'Leads' },
  { id: 'no-followup', label: 'Leads sin seguimiento' },
  { id: 'quiz-drop', label: 'Abandonaron test' },
  { id: 'mobile', label: 'Móvil' },
  { id: 'new', label: 'Nuevos' },
  { id: 'returning', label: 'Recurrentes' },
]

const segments = computed(() => [...baseSegments, ...custom.value.map(c => ({ id: c.id, label: c.label }))])

function matchSegment(id: string, s: Session): boolean {
  const contacted = new Set(filtered.value.communications.map(c => c.visitor_id))
  switch (id) {
    case 'buyers': return s.purchased
    case 'nonbuyers': return !s.purchased
    case 'leads': return s.form_submitted
    case 'no-followup': return s.form_submitted && !contacted.has(s.visitor_id)
    case 'quiz-drop': return s.quiz_started && !s.quiz_completed
    case 'mobile': return s.device === 'mobile'
    case 'new': return !filtered.value.visitors.find(v => v.id === s.visitor_id)?.is_returning
    case 'returning': return !!filtered.value.visitors.find(v => v.id === s.visitor_id)?.is_returning
    default: {
      const c = custom.value.find(x => x.id === id)
      return c ? c.predicate(s, filtered.value.visitors.find(v => v.id === s.visitor_id)) : true
    }
  }
}

const activeSegment = computed(() => {
  const sessions = filtered.value.sessions.filter(s => matchSegment(active.value, s))
  const vids = new Set(sessions.map(s => s.visitor_id))
  const sales = filtered.value.sales.filter(s => vids.has(s.visitor_id))
  const revenue = sales.filter(s => s.payment_status !== 'Devuelto').reduce((a, s) => a + s.total, 0)
  return {
    sessions,
    visitors: filtered.value.visitors.filter(v => vids.has(v.id)),
    leads: new Set(sessions.filter(s => s.form_submitted).map(s => s.visitor_id)).size,
    appointments: sessions.filter(s => s.booked).length,
    sales: new Set(sales.map(s => s.visitor_id)).size,
    conversion: vids.size ? Math.round((new Set(sales.map(s => s.visitor_id)).size / vids.size) * 100) : 0,
    avgTicket: sales.length ? revenue / new Set(sales.map(s => s.visitor_id)).size : 0,
    scroll: sessions.length ? Math.round(sessions.reduce((a, s) => a + s.scroll_avg, 0) / sessions.length) : 0,
  }
})

const compareChart = computed(() => {
  const ids = ['all', 'buyers', 'nonbuyers', 'leads', 'quiz-drop', 'mobile']
  return {
    labels: ids.map(id => baseSegments.find(s => s.id === id)?.label || id),
    datasets: [
      { label: 'Visitantes', data: ids.map(id => new Set(filtered.value.sessions.filter(s => matchSegment(id, s)).map(s => s.visitor_id)).size), backgroundColor: '#38bdf8bb', borderRadius: 4 },
      { label: 'Leads', data: ids.map(id => new Set(filtered.value.sessions.filter(s => matchSegment(id, s) && s.form_submitted).map(s => s.visitor_id)).size), backgroundColor: '#10b981bb', borderRadius: 4 },
      { label: 'Compras', data: ids.map(id => new Set(filtered.value.sessions.filter(s => matchSegment(id, s) && s.purchased).map(s => s.visitor_id)).size), backgroundColor: '#f59e0bbb', borderRadius: 4 },
    ],
  }
})

const sourceRows = computed(() => {
  const map = new Map<string, number>()
  activeSegment.value.sessions.forEach(s => map.set(s.source, (map.get(s.source) || 0) + 1))
  const colors: Record<string, string> = { instagram: '#ec4899', facebook: '#3b82f6', google: '#f59e0b', tiktok: '#22d3ee', organico: '#10b981', directo: '#94a3b8', referido: '#8b5cf6' }
  return [...map.entries()].map(([k, v]) => ({ label: k, value: v, color: colors[k] || '#38bdf8' }))
})

const sourceChart = computed(() => ({
  labels: sourceRows.value.map(r => r.label),
  datasets: [{ data: sourceRows.value.map(r => r.value), backgroundColor: sourceRows.value.map(r => `${r.color}cc`), borderColor: sourceRows.value.map(r => r.color), borderWidth: 1 }],
}))

const pageComparison = computed(() => {
  const buyerIds = new Set(filtered.value.sessions.filter(s => s.purchased).map(s => s.id))
  const nonBuyerIds = new Set(filtered.value.sessions.filter(s => !s.purchased).map(s => s.id))
  const paths = pathStats(filtered.value)
  return paths.slice(0, 8).map(p => {
    const buyerViews = filtered.value.sessions.filter(s => buyerIds.has(s.id) && s.pageviews.some(pv => pv.path === p.path)).length
    const nonViews = filtered.value.sessions.filter(s => nonBuyerIds.has(s.id) && s.pageviews.some(pv => pv.path === p.path)).length
    const bPct = buyerIds.size ? Math.round((buyerViews / buyerIds.size) * 100) : 0
    const nPct = nonBuyerIds.size ? Math.round((nonViews / nonBuyerIds.size) * 100) : 0
    return { path: p.path, label: p.label, buyerPct: bPct, nonBuyerPct: nPct, gap: bPct - nPct }
  })
})

const behaviorComparison = computed(() => {
  const buyers = filtered.value.sessions.filter(s => s.purchased)
  const nonBuyers = filtered.value.sessions.filter(s => !s.purchased)
  const m = (arr: Session[], fn: (s: Session) => boolean) => arr.length ? Math.round((arr.filter(fn).length / arr.length) * 100) : 0
  return [
    { label: 'Inició evaluación', buyers: `${m(buyers, s => s.quiz_started)}%`, nonBuyers: `${m(nonBuyers, s => s.quiz_started)}%`, buyerPct: m(buyers, s => s.quiz_started), nonBuyerPct: m(nonBuyers, s => s.quiz_started) },
    { label: 'Completó evaluación', buyers: `${m(buyers, s => s.quiz_completed)}%`, nonBuyers: `${m(nonBuyers, s => s.quiz_completed)}%`, buyerPct: m(buyers, s => s.quiz_completed), nonBuyerPct: m(nonBuyers, s => s.quiz_completed) },
    { label: 'Dejó datos', buyers: `${m(buyers, s => s.form_submitted)}%`, nonBuyers: `${m(nonBuyers, s => s.form_submitted)}%`, buyerPct: m(buyers, s => s.form_submitted), nonBuyerPct: m(nonBuyers, s => s.form_submitted) },
    { label: 'Agendó cita', buyers: `${m(buyers, s => s.booked)}%`, nonBuyers: `${m(nonBuyers, s => s.booked)}%`, buyerPct: m(buyers, s => s.booked), nonBuyerPct: m(nonBuyers, s => s.booked) },
    { label: 'Más de 2 páginas', buyers: `${m(buyers, s => s.page_count > 2)}%`, nonBuyers: `${m(nonBuyers, s => s.page_count > 2)}%`, buyerPct: m(buyers, s => s.page_count > 2), nonBuyerPct: m(nonBuyers, s => s.page_count > 2) },
    { label: 'Scroll > 50%', buyers: `${m(buyers, s => s.scroll_avg > 50)}%`, nonBuyers: `${m(nonBuyers, s => s.scroll_avg > 50)}%`, buyerPct: m(buyers, s => s.scroll_avg > 50), nonBuyerPct: m(nonBuyers, s => s.scroll_avg > 50) },
  ]
})

const traits = computed(() => {
  const topSource = [...sourceRows.value].sort((a, b) => b.value - a.value)[0]
  const topPage = pageComparison.value[0]
  const deviceMap = new Map<string, number>()
  activeSegment.value.sessions.forEach(s => deviceMap.set(s.device, (deviceMap.get(s.device) || 0) + 1))
  const topDevice = [...deviceMap.entries()].sort((a, b) => b[1] - a[1])[0]
  return [
    { label: 'Fuente dominante', value: topSource?.label || '—', note: `${topSource?.value || 0} sesiones`, tone: 'text-cyan-300' },
    { label: 'Página más vista', value: topPage?.label || '—', note: `${topPage ? topPage.buyerPct : 0}% de compradores la vio`, tone: 'text-emerald-300' },
    { label: 'Dispositivo principal', value: topDevice ? (topDevice[0] === 'mobile' ? 'Móvil' : topDevice[0] === 'desktop' ? 'Escritorio' : 'Tablet') : '—', note: `${topDevice?.[1] || 0} sesiones`, tone: 'text-violet-300' },
    { label: 'Conversión del segmento', value: `${activeSegment.value.conversion}%`, note: 'Compras / visitantes', tone: 'text-amber-300' },
  ]
})

function addCustom() {
  const id = `custom_${Date.now()}`
  const minPages = 3
  custom.value.push({
    id,
    label: `Personalizado #${custom.value.length + 1}`,
    predicate: (s: Session) => s.page_count >= minPages,
  })
  active.value = id
}

const pageColumns: Column[] = [
  { key: 'label', label: 'Página' },
  { key: 'buyerPct', label: 'Compradores', align: 'right' },
  { key: 'nonBuyerPct', label: 'No compradores', align: 'right' },
  { key: 'gap', label: 'Diferencia', align: 'right' },
]

const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
void bySource
void currency
</script>
