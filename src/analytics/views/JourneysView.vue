<template>
  <PageHeader
    code="11 // CUSTOMER JOURNEYS"
    title="Recorrido completo del cliente"
    description="Reconstrucción del trayecto desde el primer contacto identificable hasta el resultado comercial. Cada dato se marca como observado, declarado, registrado o inferido."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ paths.length }} RECORRIDOS</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Visitantes" :value="number(kpis.visitors)" icon="👥" />
      <StatCard label="Interactuaron" :value="number(kpis.engaged)" icon="👆" tone="cyan" />
      <StatCard label="Leads" :value="number(kpis.leads)" icon="🧾" tone="amber" />
      <StatCard label="Citas" :value="number(kpis.appointments)" icon="📅" tone="violet" />
      <StatCard label="Asistencias" :value="number(kpis.attended)" icon="📍" tone="violet" />
      <StatCard label="Compras" :value="number(kpis.sales)" icon="💳" tone="green" />
      <StatCard label="Días hasta compra" :value="`${avgDaysToClose}d`" icon="⏳" tone="slate" note="Primer contacto → venta" />
      <StatCard label="Ingreso medio" :value="currency(kpis.avgTicket)" icon="💵" tone="green" />
    </div>

    <!-- Comparador compradores / no compradores -->
    <div class="hud-card mb-4 py-3">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500 mr-1">Comparar recorridos:</span>
        <button
          v-for="s in segments"
          :key="s.id"
          @click="segment = s.id"
          class="px-2.5 py-1.5 rounded text-[9px] font-mono border transition-all"
          :class="segment === s.id ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-slate-400 border-pulso-border/60 hover:text-slate-200'"
        >
          {{ s.label }}
        </button>
        <div class="flex-1"></div>
        <span class="badge badge-muted text-[8px]">{{ segmentSessions.length }} SESIONES EN EL SEGMENTO</span>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <div>
            <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Diagrama de flujo del recorrido</h3>
            <p class="text-[9px] font-mono text-slate-500 mt-0.5">Fuente → entrada → interacción → conversión</p>
          </div>
          <span class="badge badge-cyan text-[8px]">SANKEY</span>
        </div>
        <SankeyFlow :columns="sankeyColumns" :links="sankeyLinks" :height="330" />
      </div>

      <ChartCard
        title="Duración del recorrido"
        subtitle="Días entre primer contacto y compra"
        type="bar"
        :data="closeTimeChart"
        :height="330"
        :options="barOptions"
        :empty="salesList.length === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Recorridos más frecuentes</h3>
          <span class="text-[9px] font-mono text-slate-500">TOP {{ paths.length }}</span>
        </div>
        <div class="divide-y divide-pulso-border/20">
          <div v-for="(p, i) in paths" :key="p.path" class="p-3 hover:bg-cyan-500/5 transition-colors">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-2 min-w-0">
                <span class="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[8px] text-cyan-300 font-bold flex-shrink-0">
                  {{ i + 1 }}
                </span>
                <div class="min-w-0">
                  <p class="text-[10px] font-mono text-slate-200 leading-snug">{{ p.path }}</p>
                  <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span class="badge badge-muted text-[8px] py-0 px-1.5">{{ p.count }} sesiones</span>
                    <span v-if="p.buyers" class="badge badge-green text-[8px] py-0 px-1.5">{{ p.buyers }} compradores</span>
                    <span v-if="p.revenue" class="badge badge-amber text-[8px] py-0 px-1.5">{{ currency(p.revenue) }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="font-tech text-sm text-cyan-300">{{ pct(p.buyers, p.count) }}%</p>
                <p class="text-[8px] font-mono text-slate-500">conversión</p>
              </div>
            </div>
          </div>
          <div v-if="paths.length === 0" class="p-10 text-center text-[10px] font-mono text-slate-500">
            Sin recorridos para los filtros actuales.
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Etapas típicas del comprador
          </h3>
          <div class="space-y-1.5">
            <div v-for="(st, i) in buyerStages" :key="st.label" class="flex items-center gap-2 text-[9px] font-mono">
              <span class="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[8px] text-emerald-300 flex-shrink-0">{{ i + 1 }}</span>
              <span class="text-slate-300 flex-1">{{ st.label }}</span>
              <span class="text-emerald-300 font-bold">{{ st.pct }}%</span>
            </div>
          </div>
        </div>

        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Origen de los datos
          </h3>
          <div class="space-y-1.5 text-[9px] font-mono">
            <div v-for="o in dataOrigins" :key="o.label" class="flex items-start gap-2 p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
              <span class="text-sm flex-shrink-0">{{ o.icon }}</span>
              <div>
                <p class="text-slate-300 font-bold">{{ o.label }}</p>
                <p class="text-slate-500 leading-relaxed">{{ o.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hud-card">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Líneas de tiempo individuales</h3>
        <span class="text-[9px] font-mono text-slate-500">CLIC PARA EXPANDIR</span>
      </div>
      <div class="space-y-2">
        <div v-for="s in individualSessions" :key="s.id" class="rounded-lg border border-pulso-border/50 bg-pulso-void/40 overflow-hidden">
          <button @click="expanded = expanded === s.id ? '' : s.id" class="w-full flex items-center justify-between gap-2 p-2.5 hover:bg-cyan-500/5 transition-colors">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-1.5 h-1.5 rounded-full" :class="s.purchased ? 'bg-emerald-400' : s.lead_captured ? 'bg-amber-400' : 'bg-slate-600'"></span>
              <span class="text-[10px] font-mono text-slate-300 truncate">{{ s.visitor_id }}</span>
              <span class="badge text-[8px] py-0 px-1.5" :class="s.purchased ? 'badge-green' : s.lead_captured ? 'badge-amber' : 'badge-muted'">
                {{ s.purchased ? 'COMPRÓ' : s.lead_captured ? 'LEAD' : 'VISITANTE' }}
              </span>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0 text-[8px] font-mono text-slate-500">
              <span>{{ s.page_count }} pág.</span>
              <span>{{ Math.round(s.duration_s / 60) }} min</span>
              <span>{{ formatDate(s.started_at, true) }}</span>
              <span class="text-slate-600">{{ expanded === s.id ? '▲' : '▼' }}</span>
            </div>
          </button>
          <div v-if="expanded === s.id" class="p-3 pt-0">
            <div class="relative pl-4">
              <div class="absolute left-1 top-1 bottom-1 w-px bg-pulso-border"></div>
              <div v-for="(ev, i) in timelineOf(s)" :key="i" class="relative flex items-start gap-2 py-1">
                <span class="absolute -left-[11px] top-2 w-2 h-2 rounded-full border" :class="ev.dot"></span>
                <span class="text-[8px] font-mono text-slate-600 w-24 flex-shrink-0">{{ ev.when }}</span>
                <div class="min-w-0">
                  <p class="text-[9px] font-mono text-slate-300">{{ ev.label }}</p>
                  <p v-if="ev.detail" class="text-[8px] font-mono text-slate-500">{{ ev.detail }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="individualSessions.length === 0" class="p-8 text-center text-[10px] font-mono text-slate-500">
          Sin sesiones para mostrar.
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
import SankeyFlow from '../components/SankeyFlow.vue'
import { useAnalytics } from '../store'
import { currency, formatDate, journeyPaths, number } from '../engine'
import { sourceLabel } from '../demo'
import type { Session } from '../types'

const { filtered, kpis } = useAnalytics()

const segment = ref<'all' | 'buyers' | 'nonbuyers'>('all')
const expanded = ref('')

const segments = [
  { id: 'all' as const, label: 'Todos' },
  { id: 'buyers' as const, label: 'Compradores' },
  { id: 'nonbuyers' as const, label: 'No compradores' },
]

const segmentSessions = computed(() =>
  filtered.value.sessions.filter(s =>
    segment.value === 'all' ? true : segment.value === 'buyers' ? s.purchased : !s.purchased
  )
)

const paths = computed(() => {
  const list = journeyPaths(filtered.value, segment.value === 'buyers').slice(0, 8)
  return segment.value === 'all' ? list : list
})

const salesList = computed(() => filtered.value.sales)
const avgDaysToClose = computed(() =>
  salesList.value.length
    ? Math.round(salesList.value.reduce((a, s) => a + s.days_to_close, 0) / salesList.value.length)
    : 0
)

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)

const closeTimeChart = computed(() => {
  const buckets = [[1, 3], [4, 7], [8, 14], [15, 30], [31, 999]]
  return {
    labels: buckets.map(b => (b[1] === 999 ? '30+ días' : `${b[0]}–${b[1]} días`)),
    datasets: [{
      label: 'Compras',
      data: buckets.map(b => salesList.value.filter(s => s.days_to_close >= b[0] && s.days_to_close <= b[1]).length),
      backgroundColor: '#10b981bb',
      borderRadius: 4,
    }],
  }
})

const buyerStages = computed(() => {
  const total = filtered.value.sessions.length || 1
  const buyers = segment.value === 'nonbuyers' ? [] : filtered.value.sessions.filter(s => s.purchased)
  return [
    { label: 'Llegó al sitio', pct: 100 },
    { label: 'Interactuó con contenido', pct: pct(segmentSessions.value.filter(s => s.scroll_avg >= 40 || s.clicks >= 2).length, total) },
    { label: 'Inició evaluación', pct: pct(segmentSessions.value.filter(s => s.quiz_started).length, total) },
    { label: 'Completó evaluación', pct: pct(segmentSessions.value.filter(s => s.quiz_completed).length, total) },
    { label: 'Dejó datos', pct: pct(segmentSessions.value.filter(s => s.form_submitted).length, total) },
    { label: 'Agendó cita', pct: pct(segmentSessions.value.filter(s => s.booked).length, total) },
    { label: 'Asistió', pct: pct(segmentSessions.value.filter(s => s.attended).length, total) },
    { label: 'Compró', pct: pct(buyers.length, total) },
  ]
})

const dataOrigins = [
  { icon: '👁️', label: 'Observado', text: 'Páginas, clics, scroll y tiempos capturados en el sitio con consentimiento.' },
  { icon: '✍️', label: 'Declarado', text: 'Datos que la persona escribe en evaluaciones y formularios.' },
  { icon: '🏪', label: 'Registrado por el negocio', text: 'Citas, asistencias, cotizaciones y ventas anotadas en el local.' },
  { icon: '📥', label: 'Importado', text: 'Inversión, impresiones y clics reportados por las plataformas.' },
  { icon: '🧮', label: 'Calculado / inferido', text: 'Conversiones, tiempos y atribución. Siempre marcados y explicables.' },
]

const sankeyColumns = computed(() => {
  const src = new Map<string, number>()
  const land = new Map<string, number>()
  segmentSessions.value.forEach(s => {
    src.set(s.source, (src.get(s.source) || 0) + 1)
    land.set(s.landing_page, (land.get(s.landing_page) || 0) + 1)
  })
  const palette = ['#ec4899', '#3b82f6', '#f59e0b', '#22d3ee', '#94a3b8', '#10b981', '#8b5cf6']
  const pageLabel = (p: string) => (p === '/' ? 'Landing' : p.replace('/', '').replace(/-/g, ' '))
  return [
    { label: 'Fuente', nodes: [...src.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v], i) => ({ key: `s_${k}`, label: sourceLabel(k), value: v, color: palette[i % palette.length] })) },
    { label: 'Entrada', nodes: [...land.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v], i) => ({ key: `l_${k}`, label: pageLabel(k), value: v, color: palette[(i + 2) % palette.length] })) },
    {
      label: 'Conversión',
      nodes: [
        { key: 'lead', label: 'Dejó datos', value: segmentSessions.value.filter(s => s.form_submitted).length, color: '#f59e0b' },
        { key: 'no_lead', label: 'Sin datos', value: segmentSessions.value.filter(s => !s.form_submitted).length, color: '#64748b' },
      ],
    },
    {
      label: 'Resultado',
      nodes: [
        { key: 'buy', label: 'Compró', value: segmentSessions.value.filter(s => s.purchased).length, color: '#10b981' },
        { key: 'no_buy', label: 'No compró', value: segmentSessions.value.filter(s => !s.purchased).length, color: '#475569' },
      ],
    },
  ]
})

const sankeyLinks = computed(() => {
  const links: { source: string; target: string; value: number; color?: string }[] = []
  const srcLand = new Map<string, Map<string, number>>()
  const landLead = new Map<string, number>()
  const landNoLead = new Map<string, number>()
  let leadBuy = 0, leadNoBuy = 0, noLeadBuy = 0, noLeadNoBuy = 0

  segmentSessions.value.forEach(s => {
    if (!srcLand.has(s.source)) srcLand.set(s.source, new Map())
    const m = srcLand.get(s.source)!
    m.set(s.landing_page, (m.get(s.landing_page) || 0) + 1)
    if (s.form_submitted) {
      landLead.set(s.landing_page, (landLead.get(s.landing_page) || 0) + 1)
      if (s.purchased) leadBuy++; else leadNoBuy++
    } else {
      landNoLead.set(s.landing_page, (landNoLead.get(s.landing_page) || 0) + 1)
      if (s.purchased) noLeadBuy++; else noLeadNoBuy++
    }
  })

  srcLand.forEach((lands, src) => lands.forEach((v, land) => links.push({ source: `s_${src}`, target: `l_${land}`, value: v })))
  landLead.forEach((v, land) => links.push({ source: `l_${land}`, target: 'lead', value: v, color: '#f59e0b' }))
  landNoLead.forEach((v, land) => links.push({ source: `l_${land}`, target: 'no_lead', value: v, color: '#64748b' }))
  if (leadBuy) links.push({ source: 'lead', target: 'buy', value: leadBuy, color: '#10b981' })
  if (leadNoBuy) links.push({ source: 'lead', target: 'no_buy', value: leadNoBuy, color: '#475569' })
  if (noLeadBuy) links.push({ source: 'no_lead', target: 'buy', value: noLeadBuy, color: '#10b981' })
  if (noLeadNoBuy) links.push({ source: 'no_lead', target: 'no_buy', value: noLeadNoBuy, color: '#475569' })
  return links.filter(l => l.value > 0)
})

const individualSessions = computed(() =>
  [...segmentSessions.value].sort((a, b) => b.started_at.localeCompare(a.started_at)).slice(0, 10)
)

function timelineOf(s: Session) {
  const events: { when: string; label: string; detail?: string; dot: string }[] = []
  events.push({ when: formatDate(s.started_at, true), label: 'Primera visita', detail: `${sourceLabel(s.source)} · ${s.device}`, dot: 'border-cyan-500 bg-cyan-500/30' })
  s.pageviews.forEach(pv => {
    events.push({ when: `${pv.seconds}s`, label: pv.label, detail: `${pv.scroll}% scroll · ${pv.clicks} clics`, dot: 'border-slate-600 bg-slate-700' })
  })
  if (s.quiz_started) events.push({ when: '—', label: s.quiz_completed ? 'Completó la evaluación' : 'Abandonó la evaluación', dot: s.quiz_completed ? 'border-violet-500 bg-violet-500/30' : 'border-rose-500 bg-rose-500/30' })
  if (s.form_submitted) events.push({ when: '—', label: 'Dejó sus datos', detail: 'Dato declarado', dot: 'border-amber-500 bg-amber-500/30' })
  if (s.booked) events.push({ when: '—', label: s.attended ? 'Agendó y asistió' : 'Agendó cita', detail: s.confirmed ? 'Confirmada' : 'Sin confirmar', dot: 'border-violet-500 bg-violet-500/30' })
  if (s.purchased) events.push({ when: '—', label: 'Compra realizada', detail: currency(s.revenue), dot: 'border-emerald-500 bg-emerald-500/30' })
  return events
}

const barOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } },
    y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } },
  },
}
</script>
