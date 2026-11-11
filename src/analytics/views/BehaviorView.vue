<template>
  <PageHeader
    code="05 // BEHAVIOR ANALYTICS"
    title="Navegación y comportamiento dentro del sitio"
    description="Páginas consultadas, profundidad, scroll, clics y puntos de salida. El tiempo se muestra como referencia: permanecer no equivale a prestar atención."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ pathRows.length }} PÁGINAS</span>
      <span class="badge badge-muted text-[9px]">{{ number(filtered.sessions.length) }} SESIONES</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Páginas / sesión" :value="pagesPerSession" icon="📄" note="Profundidad media" />
      <StatCard label="Duración media" :value="`${avgDuration}s`" icon="⏱️" note="Tiempo activo estimado" />
      <StatCard label="Scroll medio" :value="`${avgScroll}%`" icon="📜" tone="cyan" note="Profundidad de lectura" />
      <StatCard label="Tasa de interacción" :value="`${engagementRate}%`" icon="👆" tone="green" note="Scroll o clic relevante" />
      <StatCard label="Clics totales" :value="number(totalClicks)" icon="🖱️" note="Elementos seleccionados" />
      <StatCard label="Salidas en landing" :value="`${bounceRate}%`" icon="🚪" tone="rose" note="Sin avanzar de página" />
      <StatCard label="Errores" :value="number(errorSessions)" icon="⚠️" tone="rose" note="Sesiones con error" />
      <StatCard label="Conversión" :value="`${kpis.conversionRate}%`" icon="💳" tone="green" note="Compradores / visitantes" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <div>
            <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Diagrama de recorrido agregado</h3>
            <p class="text-[9px] font-mono text-slate-500 mt-0.5">Fuente → página de entrada → evaluación → resultado</p>
          </div>
          <span class="badge badge-cyan text-[8px]">SANKEY</span>
        </div>
        <SankeyFlow :columns="sankeyColumns" :links="sankeyLinks" :height="320" />
      </div>

      <ChartCard
        title="Profundidad de navegación"
        subtitle="Páginas vistas por sesión"
        type="bar"
        :data="depthChart"
        :height="300"
        :options="barOptions"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard title="Scroll por página" subtitle="Profundidad media alcanzada" type="bar" :data="scrollChart" :height="230" :options="horizontalOptions" />
      <ChartCard title="Páginas más vistas" subtitle="Volumen de consultas" type="bar" :data="viewsChart" :height="230" :options="horizontalOptions" />
      <ChartCard title="Páginas de salida" subtitle="Dónde terminan las sesiones" type="bar" :data="exitChart" :height="230" :options="horizontalOptions" />
    </div>

    <div class="hud-card mb-4">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Rendimiento por página</h3>
        <span class="text-[9px] font-mono text-slate-500">ORDENADO POR VISITAS</span>
      </div>
      <DataTable :columns="columns" :rows="pathRows" row-key="path">
        <template #cell-label="{ row }">
          <div>
            <p class="text-slate-200">{{ row.label }}</p>
            <p class="text-[8px] text-slate-500">{{ row.path }}</p>
          </div>
        </template>
        <template #cell-avgScroll="{ row }">
          <div class="flex items-center justify-end gap-2">
            <div class="w-16 h-1.5 rounded bg-pulso-void overflow-hidden">
              <div class="h-full bg-cyan-400" :style="{ width: `${row.avgScroll}%` }"></div>
            </div>
            <span>{{ row.avgScroll }}%</span>
          </div>
        </template>
        <template #cell-exitRate="{ row }">
          <span :class="row.exitRate > 40 ? 'text-rose-300' : 'text-slate-300'">{{ row.exitRate }}%</span>
        </template>
        <template #cell-conversionRate="{ row }">
          <span class="text-emerald-300">{{ row.conversionRate }}%</span>
        </template>
      </DataTable>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Elementos con más interacción
        </h3>
        <div class="space-y-1.5">
          <div v-for="c in topClicks" :key="c.label" class="flex items-center justify-between text-[10px] font-mono p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-300">{{ c.label }}</span>
            <span class="text-cyan-300 font-bold">{{ c.count }}</span>
          </div>
          <div v-if="topClicks.length === 0" class="py-6 text-center text-[10px] text-slate-500">Sin clics registrados.</div>
        </div>
      </div>
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Señales de fricción
        </h3>
        <div class="space-y-2 text-[10px] font-mono">
          <div class="p-2 rounded bg-rose-500/5 border border-rose-500/20">
            <p class="text-rose-300 font-bold">{{ worstExit.label }} concentra la mayor salida</p>
            <p class="text-slate-400">{{ worstExit.exitRate }}% de las sesiones que llegan a esta página terminan ahí.</p>
          </div>
          <div class="p-2 rounded bg-amber-500/5 border border-amber-500/20">
            <p class="text-amber-300 font-bold">{{ lowestScroll.label }} recibe poca lectura</p>
            <p class="text-slate-400">Scroll medio de {{ lowestScroll.avgScroll }}%: el contenido inferior podría no estar viéndose.</p>
          </div>
          <div class="p-2 rounded bg-cyan-500/5 border border-cyan-500/20">
            <p class="text-cyan-300 font-bold">{{ errorSessions }} sesiones con errores técnicos</p>
            <p class="text-slate-400">Revisar consola y eventos de interacción antes de asumir un problema de contenido.</p>
          </div>
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
import SankeyFlow from '../components/SankeyFlow.vue'
import { useAnalytics } from '../store'
import { currency, number, pathStats } from '../engine'
import { sourceLabel } from '../demo'

const { filtered, kpis } = useAnalytics()
const pathRows = computed(() => pathStats(filtered.value))
const sessions = computed(() => filtered.value.sessions)
const pagesPerSession = computed(() => sessions.value.length ? (sessions.value.reduce((a, s) => a + s.page_count, 0) / sessions.value.length).toFixed(1) : '0.0')
const avgDuration = computed(() => Math.round(sessions.value.length ? sessions.value.reduce((a, s) => a + s.duration_s, 0) / sessions.value.length : 0))
const avgScroll = computed(() => Math.round(sessions.value.length ? sessions.value.reduce((a, s) => a + s.scroll_avg, 0) / sessions.value.length : 0))
const engagementRate = computed(() => sessions.value.length ? Math.round((sessions.value.filter(s => s.scroll_avg >= 40 || s.clicks >= 2 || s.quiz_started).length / sessions.value.length) * 100) : 0)
const totalClicks = computed(() => sessions.value.reduce((a, s) => a + s.clicks, 0))
const errorSessions = computed(() => sessions.value.filter(s => s.had_error).length)
const bounceRate = computed(() => {
  if (!sessions.value.length) return 0
  return Math.round((sessions.value.filter(s => s.page_count <= 1).length / sessions.value.length) * 100)
})

const depthChart = computed(() => {
  const buckets = [1, 2, 3, 4, 5, 6]
  return {
    labels: buckets.map(b => b === 6 ? '6+' : `${b} pág.`),
    datasets: [{
      label: 'Sesiones',
      data: buckets.map(b => sessions.value.filter(s => b === 6 ? s.page_count >= 6 : s.page_count === b).length),
      backgroundColor: ['#f43f5eaa', '#f59e0baa', '#38bdf8aa', '#22d3eeaa', '#10b981aa', '#8b5cf6aa'],
      borderRadius: 4,
    }],
  }
})

const scrollChart = computed(() => ({
  labels: pathRows.value.slice(0, 7).map(p => p.label),
  datasets: [{ label: 'Scroll %', data: pathRows.value.slice(0, 7).map(p => p.avgScroll), backgroundColor: '#38bdf8bb', borderRadius: 4 }],
}))
const viewsChart = computed(() => ({
  labels: pathRows.value.slice(0, 7).map(p => p.label),
  datasets: [{ label: 'Vistas', data: pathRows.value.slice(0, 7).map(p => p.views), backgroundColor: '#10b981bb', borderRadius: 4 }],
}))
const exitChart = computed(() => ({
  labels: [...pathRows.value].sort((a, b) => b.exits - a.exits).slice(0, 7).map(p => p.label),
  datasets: [{ label: 'Salidas', data: [...pathRows.value].sort((a, b) => b.exits - a.exits).slice(0, 7).map(p => p.exits), backgroundColor: '#f43f5eaa', borderRadius: 4 }],
}))

const worstExit = computed(() => [...pathRows.value].filter(p => p.views >= 20).sort((a, b) => b.exitRate - a.exitRate)[0] || { label: '—', exitRate: 0 })
const lowestScroll = computed(() => [...pathRows.value].filter(p => p.views >= 20).sort((a, b) => a.avgScroll - b.avgScroll)[0] || { label: '—', avgScroll: 0 })

const topClicks = computed(() => {
  const map = new Map<string, number>()
  filtered.value.events.filter(e => e.type === 'click').forEach(e => map.set(e.label, (map.get(e.label) || 0) + 1))
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 6)
})

const sankeyColumns = computed(() => {
  const srcMap = new Map<string, number>()
  const landMap = new Map<string, number>()
  sessions.value.forEach(s => {
    srcMap.set(s.source, (srcMap.get(s.source) || 0) + 1)
    landMap.set(s.landing_page, (landMap.get(s.landing_page) || 0) + 1)
  })
  const pageLabel = (p: string) => filtered.value.base.businesses.length ? (p === '/' ? 'Landing' : p.replace('/', '').replace(/-/g, ' ')) : p
  const palette = ['#ec4899', '#3b82f6', '#f59e0b', '#22d3ee', '#94a3b8', '#10b981', '#8b5cf6']
  return [
    { label: 'Fuente', nodes: [...srcMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v], i) => ({ key: `src_${k}`, label: sourceLabel(k), value: v, color: palette[i] })) },
    { label: 'Entrada', nodes: [...landMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v], i) => ({ key: `land_${k}`, label: pageLabel(k), value: v, color: palette[(i + 2) % palette.length] })) },
    {
      label: 'Evaluación',
      nodes: [
        { key: 'quiz', label: 'Inició test', value: sessions.value.filter(s => s.quiz_started).length, color: '#8b5cf6' },
        { key: 'nav', label: 'Solo navegó', value: sessions.value.filter(s => !s.quiz_started).length, color: '#64748b' },
      ],
    },
    {
      label: 'Resultado',
      nodes: [
        { key: 'done', label: 'Completó', value: sessions.value.filter(s => s.quiz_completed).length, color: '#10b981' },
        { key: 'drop', label: 'Abandonó', value: sessions.value.filter(s => s.quiz_started && !s.quiz_completed).length, color: '#f59e0b' },
        { key: 'sale', label: 'Compró', value: sessions.value.filter(s => s.purchased).length, color: '#22d3ee' },
      ],
    },
  ]
})

const sankeyLinks = computed(() => {
  const links: { source: string; target: string; value: number; color?: string }[] = []
  const srcMap = new Map<string, Map<string, number>>()
  const landQuiz = new Map<string, number>()
  const landNav = new Map<string, number>()
  const quizDone = new Map<string, number>()
  const quizDrop = new Map<string, number>()
  const doneSale = new Map<string, number>()
  const doneNoSale = new Map<string, number>()

  sessions.value.forEach(s => {
    if (!srcMap.has(s.source)) srcMap.set(s.source, new Map())
    const m = srcMap.get(s.source)!
    m.set(s.landing_page, (m.get(s.landing_page) || 0) + 1)
    if (s.quiz_started) {
      landQuiz.set(s.landing_page, (landQuiz.get(s.landing_page) || 0) + 1)
      if (s.quiz_completed) {
        quizDone.set('quiz', (quizDone.get('quiz') || 0) + 1)
        if (s.purchased) doneSale.set('done', (doneSale.get('done') || 0) + 1)
        else doneNoSale.set('done', (doneNoSale.get('done') || 0) + 1)
      } else {
        quizDrop.set('quiz', (quizDrop.get('quiz') || 0) + 1)
      }
    } else {
      landNav.set(s.landing_page, (landNav.get(s.landing_page) || 0) + 1)
    }
  })

  srcMap.forEach((lands, src) => lands.forEach((v, land) => links.push({ source: `src_${src}`, target: `land_${land}`, value: v })))
  landQuiz.forEach((v, land) => links.push({ source: `land_${land}`, target: 'quiz', value: v, color: '#8b5cf6' }))
  landNav.forEach((v, land) => links.push({ source: `land_${land}`, target: 'nav', value: v, color: '#64748b' }))
  quizDone.forEach(v => links.push({ source: 'quiz', target: 'done', value: v, color: '#10b981' }))
  quizDrop.forEach(v => links.push({ source: 'quiz', target: 'drop', value: v, color: '#f59e0b' }))
  doneSale.forEach(v => links.push({ source: 'done', target: 'sale', value: v, color: '#22d3ee' }))
  doneNoSale.forEach(v => links.push({ source: 'done', target: 'drop', value: v, color: '#64748b' }))
  return links.filter(l => l.value > 0)
})

const columns: Column[] = [
  { key: 'label', label: 'Página' },
  { key: 'views', label: 'Vistas', align: 'right' },
  { key: 'visitors', label: 'Visitantes', align: 'right' },
  { key: 'avgSeconds', label: 'Tiempo medio', align: 'right', format: r => `${r.avgSeconds}s` },
  { key: 'avgScroll', label: 'Scroll', align: 'right' },
  { key: 'exits', label: 'Salidas', align: 'right' },
  { key: 'exitRate', label: 'Tasa salida', align: 'right' },
  { key: 'conversions', label: 'Conversiones', align: 'right' },
  { key: 'conversionRate', label: 'Conv. %', align: 'right' },
]

const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const horizontalOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 8 } } } } }
void currency
</script>
