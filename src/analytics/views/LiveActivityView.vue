<template>
  <PageHeader
    code="03 // LIVE ACTIVITY"
    title="Actividad en tiempo real"
    description="Qué está sucediendo ahora mismo: páginas consultadas, etapas del embudo, origen y acciones recientes. La actividad inactiva se separa de la actividad real."
  >
    <template #tag>
      <span class="badge badge-green">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
        STREAM ACTIVO
      </span>
    </template>
    <template #actions>
      <span class="text-[9px] font-mono text-slate-500">AUTO-REFRESH 5s · {{ clock }}</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2.5 mb-4">
      <StatCard label="Activos ahora" :value="live.length" icon="🟢" tone="green" note="Últimos 30 minutos" />
      <StatCard label="En evaluación" :value="inQuiz" icon="📝" tone="cyan" note="Test en progreso" />
      <StatCard label="En formulario" :value="inForm" icon="🧾" tone="amber" note="Completando datos" />
      <StatCard label="Reservaron" :value="live.filter(s => s.booked).length" icon="📅" tone="violet" note="En esta ventana" />
      <StatCard label="Interacciones" :value="interactions" icon="👆" tone="cyan" note="Clics y scroll" />
      <StatCard label="Errores" :value="live.filter(s => s.had_error).length" icon="⚠️" tone="rose" note="Sesiones con error" />
      <StatCard label="Conversión en vivo" :value="`${liveConversion}%`" icon="🎯" tone="green" note="Compras / activos" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Sesiones activas</h3>
          <span class="text-[9px] font-mono text-slate-500">ÚLTIMA ACTIVIDAD</span>
        </div>
        <div v-if="live.length" class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          <div
            v-for="s in live"
            :key="s.id"
            class="p-2.5 rounded-lg bg-pulso-void/50 border border-pulso-border/50 hover:border-cyan-500/30 transition-colors"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-2 h-2 rounded-full bg-emerald-400 live-pulse flex-shrink-0"></span>
                <div class="min-w-0">
                  <p class="text-[10px] font-mono text-slate-200 truncate">
                    {{ s.visitor_id }} <span class="text-slate-500">· {{ cityOf(s.visitor_id) }}</span>
                  </p>
                  <p class="text-[8px] font-mono text-slate-500 truncate">
                    {{ s.pageviews[s.pageviews.length - 1]?.label || 'Landing' }} · {{ sourceLabel(s.source) }}
                  </p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-[10px] font-mono text-cyan-300">{{ elapsed(s.started_at) }}</p>
                <p class="text-[8px] font-mono text-slate-500">{{ s.device === 'mobile' ? '📱' : s.device === 'desktop' ? '💻' : '📟' }} {{ s.browser }}</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="badge text-[8px] py-0 px-1.5" :class="stageOf(s).className">{{ stageOf(s).label }}</span>
              <span v-if="s.quiz_started && !s.quiz_completed" class="badge badge-violet text-[8px] py-0 px-1.5">
                TEST {{ s.quiz_steps.filter(x => x.answered).length }}/{{ s.quiz_steps.length || 6 }}
              </span>
              <span v-if="s.form_started && !s.form_submitted" class="badge badge-amber text-[8px] py-0 px-1.5">FORMULARIO</span>
              <span v-if="s.had_error" class="badge badge-rose text-[8px] py-0 px-1.5">ERROR ⚠</span>
              <span v-if="s.clicks > 0" class="badge badge-muted text-[8px] py-0 px-1.5">{{ s.clicks }} clics</span>
            </div>

            <!-- Progreso del recorrido -->
            <div class="flex items-center gap-1 mt-2">
              <span
                v-for="(step, i) in journeySteps"
                :key="step"
                class="h-1 flex-1 rounded-full"
                :class="i < stageIndex(s) ? 'bg-cyan-400' : 'bg-slate-800'"
                :title="step"
              ></span>
            </div>
          </div>
        </div>
        <div v-else class="py-16 text-center font-mono">
          <p class="text-[11px] text-slate-400">// SIN SESIONES ACTIVAS</p>
          <p class="text-[9px] text-slate-600 mt-1">La actividad aparecerá aquí cuando alguien navegue en el sitio.</p>
        </div>
      </div>

      <div class="space-y-4">
        <ChartCard title="Páginas activas" subtitle="Dónde están ahora" type="bar" :data="pageChart" :height="170" :options="smallOptions" :empty="live.length === 0" />
        <ChartCard title="Origen del tráfico en vivo" subtitle="Fuente de la sesión" type="doughnut" :data="sourceChart" :height="170" :options="doughnutOptions" :empty="live.length === 0" />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-2 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Flujo de eventos reciente</h3>
          <span class="badge badge-cyan text-[8px]">{{ recentEvents.length }} EVENTOS</span>
        </div>
        <div class="max-h-[380px] overflow-y-auto divide-y divide-pulso-border/20">
          <div v-for="e in recentEvents" :key="e.id" class="flex items-center gap-2 py-1.5 text-[9px] font-mono">
            <span class="text-slate-600 w-14 flex-shrink-0">{{ timeOf(e.ts) }}</span>
            <span class="badge text-[8px] py-0 px-1.5 flex-shrink-0" :class="eventClass(e.type)">{{ e.type }}</span>
            <span class="text-slate-300 truncate flex-1">{{ e.label }}</span>
            <span class="text-slate-600 flex-shrink-0">{{ e.page }}</span>
          </div>
          <div v-if="recentEvents.length === 0" class="py-8 text-center text-[10px] text-slate-500">Sin eventos recientes.</div>
        </div>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Salud del seguimiento
        </h3>
        <div class="space-y-3">
          <div v-for="h in health" :key="h.label">
            <div class="flex items-center justify-between text-[9px] font-mono mb-1">
              <span class="text-slate-400">{{ h.label }}</span>
              <span :class="h.ok ? 'text-emerald-300' : 'text-amber-300'">{{ h.value }}</span>
            </div>
            <div class="h-1.5 rounded bg-pulso-void overflow-hidden">
              <div class="h-full rounded" :class="h.ok ? 'bg-emerald-400' : 'bg-amber-400'" :style="{ width: `${h.pct}%` }"></div>
            </div>
          </div>
        </div>
        <div class="mt-3 p-2.5 rounded-lg bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
          La actividad se calcula con eventos con latido &lt; 30 min. Una pestaña abierta sin interacción no se considera un visitante activo.
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import { useAnalytics } from '../store'
import { liveSessions } from '../engine'
import { sourceLabel } from '../demo'
import type { Session } from '../types'

const { filtered, dataset } = useAnalytics()
const tick = ref(0)
let timer: ReturnType<typeof setInterval>

const live = computed(() => {
  void tick.value
  return liveSessions(filtered.value)
})
const clock = computed(() => {
  void tick.value
  return new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
})

const inQuiz = computed(() => live.value.filter(s => s.quiz_started && !s.quiz_completed).length)
const inForm = computed(() => live.value.filter(s => s.form_started && !s.form_submitted).length)
const interactions = computed(() => live.value.reduce((a, s) => a + s.clicks, 0))
const liveConversion = computed(() => live.value.length ? Math.round((live.value.filter(s => s.purchased).length / live.value.length) * 100) : 0)

const journeySteps = ['Llegada', 'Interacción', 'Test', 'Formulario', 'Reserva']

function stageIndex(s: Session) {
  if (s.booked) return 5
  if (s.form_started) return 4
  if (s.quiz_started) return 3
  if (s.clicks > 0 || s.scroll_avg > 30) return 2
  return 1
}
function stageOf(s: Session) {
  const idx = stageIndex(s)
  const labels = ['Llegada', 'Navegando', 'Interactuando', 'En evaluación', 'En formulario', 'Reservó']
  const classes = ['badge-muted', 'badge-cyan', 'badge-cyan', 'badge-violet', 'badge-amber', 'badge-green']
  return { label: labels[idx], className: classes[idx] }
}

const recentEvents = computed(() => {
  void tick.value
  const cutoff = Date.now() - 20 * 60_000
  return [...filtered.value.events]
    .filter(e => new Date(e.ts).getTime() >= cutoff)
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 50)
})

const pageChart = computed(() => {
  const map = new Map<string, number>()
  live.value.forEach(s => {
    const label = s.pageviews[s.pageviews.length - 1]?.label || 'Landing'
    map.set(label, (map.get(label) || 0) + 1)
  })
  return {
    labels: [...map.keys()],
    datasets: [{ data: [...map.values()], backgroundColor: '#38bdf8bb', borderRadius: 4 }],
  }
})

const sourceChart = computed(() => {
  const map = new Map<string, number>()
  live.value.forEach(s => map.set(s.source, (map.get(s.source) || 0) + 1))
  const palette: Record<string, string> = { instagram: '#ec4899', facebook: '#3b82f6', google: '#f59e0b', tiktok: '#22d3ee', organico: '#10b981', directo: '#94a3b8', referido: '#8b5cf6' }
  return {
    labels: [...map.keys()].map(sourceLabel),
    datasets: [{ data: [...map.values()], backgroundColor: [...map.keys()].map(k => `${palette[k] || '#38bdf8'}cc`), borderColor: [...map.keys()].map(k => palette[k] || '#38bdf8'), borderWidth: 1 }],
  }
})

const health = computed(() => {
  const total = dataset.value.visitors.length || 1
  return [
    { label: 'Sesiones con interacción', value: `${Math.round((live.value.filter(s => s.clicks > 0).length / Math.max(1, live.value.length)) * 100)}%`, pct: (live.value.filter(s => s.clicks > 0).length / Math.max(1, live.value.length)) * 100, ok: true },
    { label: 'Datos con UTM', value: `${Math.round((filtered.value.sessions.filter(s => s.source !== 'directo').length / Math.max(1, filtered.value.sessions.length)) * 100)}%`, pct: (filtered.value.sessions.filter(s => s.source !== 'directo').length / Math.max(1, filtered.value.sessions.length)) * 100, ok: true },
    { label: 'Cobertura de identificadores', value: `${Math.round((filtered.value.visitors.length / total) * 100)}%`, pct: (filtered.value.visitors.length / total) * 100, ok: true },
    { label: 'Sesiones con error', value: `${live.value.filter(s => s.had_error).length}`, pct: Math.min(100, live.value.filter(s => s.had_error).length * 10), ok: live.value.filter(s => s.had_error).length === 0 },
  ]
})

function elapsed(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  return mins < 1 ? 'ahora' : `${mins}m`
}
function cityOf(visitorId: string) {
  return dataset.value.visitors.find(v => v.id === visitorId)?.city || 'Ecuador'
}
function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function eventClass(type: string) {
  const map: Record<string, string> = {
    visita: 'badge-cyan', page_view: 'badge-muted', scroll: 'badge-muted', click: 'badge-cyan',
    quiz_start: 'badge-violet', quiz_step: 'badge-violet', quiz_complete: 'badge-green',
    form_start: 'badge-amber', form_field: 'badge-muted', form_submit: 'badge-green', form_abandon: 'badge-rose',
    booking: 'badge-green', sale: 'badge-green', error: 'badge-rose', exit: 'badge-muted',
  }
  return map[type] || 'badge-muted'
}

onMounted(() => { timer = setInterval(() => { tick.value++ }, 5000) })
onUnmounted(() => clearInterval(timer))

const smallOptions = {
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } },
}
const doughnutOptions = { cutout: '62%', plugins: { legend: { display: false } } }
</script>
