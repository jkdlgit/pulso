<template>
  <PageHeader
    code="07 // SESSION REPLAY"
    title="Reconstrucción de sesiones"
    description="Reconstrucción cronológica de interacciones (páginas, clics, scroll, formularios y errores). No es una grabación de pantalla: se ocultan datos personales y campos sensibles."
  >
    <template #actions>
      <span class="badge badge-amber text-[9px]">PRIVACIDAD POR DISEÑO</span>
    </template>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <!-- Lista de sesiones -->
      <div class="hud-card xl:col-span-1 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold">Sesiones</h3>
          <span class="badge badge-cyan text-[8px]">{{ sessions.length }}</span>
        </div>
        <div class="p-2 border-b border-pulso-border/40">
          <input
            v-model="search"
            placeholder="Buscar visitante..."
            class="w-full bg-pulso-void border border-pulso-border rounded px-2 py-1.5 text-[9px] font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div class="max-h-[560px] overflow-y-auto divide-y divide-pulso-border/20">
          <button
            v-for="s in filteredSessions"
            :key="s.id"
            @click="select(s.id)"
            class="w-full text-left p-2.5 hover:bg-cyan-500/5 transition-colors"
            :class="selectedId === s.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'border-l-2 border-transparent'"
          >
            <div class="flex items-center justify-between text-[9px] font-mono">
              <span class="text-slate-300">{{ s.visitor_id.slice(-8) }}</span>
              <span class="text-slate-500">{{ formatDate(s.started_at, true) }}</span>
            </div>
            <p class="text-[8px] font-mono text-slate-500 mt-0.5 truncate">
              {{ s.device }} · {{ sourceLabel(s.source) }} · {{ s.page_count }} pág.
            </p>
            <div class="flex items-center gap-1 mt-1">
              <span v-if="s.quiz_completed" class="badge badge-green text-[7px] py-0 px-1">TEST</span>
              <span v-if="s.lead_captured" class="badge badge-amber text-[7px] py-0 px-1">LEAD</span>
              <span v-if="s.purchased" class="badge badge-green text-[7px] py-0 px-1">COMPRA</span>
              <span v-if="s.had_error" class="badge badge-rose text-[7px] py-0 px-1">ERROR</span>
            </div>
          </button>
          <div v-if="filteredSessions.length === 0" class="p-6 text-center text-[9px] text-slate-500">
            Sin sesiones para los filtros actuales.
          </div>
        </div>
      </div>

      <!-- Reproductor -->
      <div class="xl:col-span-3 space-y-4" v-if="session">
        <div class="hud-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-pulso-border/50">
            <div>
              <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold">
                Sesión {{ session.visitor_id }}
              </h3>
              <p class="text-[9px] font-mono text-slate-500">
                {{ formatDate(session.started_at, true) }} · {{ Math.round(session.duration_s / 60) }} min · {{ session.page_count }} páginas · {{ sourceLabel(session.source) }}
              </p>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="badge badge-muted text-[8px]">{{ session.device }}</span>
              <span class="badge badge-muted text-[8px]">{{ session.browser }}</span>
              <span class="badge badge-cyan text-[8px]">{{ frames.length }} EVENTOS</span>
            </div>
          </div>

          <!-- Pantalla reconstruida -->
          <div class="relative rounded-xl border border-pulso-border/70 bg-[#060a14] overflow-hidden" style="height: 300px">
            <!-- Barra de navegador -->
            <div class="h-8 bg-pulso-surface border-b border-pulso-border/60 flex items-center gap-2 px-3">
              <span class="w-2 h-2 rounded-full bg-rose-500/70"></span>
              <span class="w-2 h-2 rounded-full bg-amber-500/70"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-500/70"></span>
              <div class="flex-1 mx-2 h-5 rounded bg-pulso-void border border-pulso-border/50 flex items-center px-2 text-[8px] font-mono text-slate-400 truncate">
                https://{{ business?.website || 'sitio-cliente.ec' }}{{ currentPage }}
              </div>
            </div>

            <!-- Contenido simulado -->
            <div class="p-5 opacity-25 select-none">
              <div class="h-7 w-1/2 rounded bg-slate-600/50 mb-3"></div>
              <div class="h-3 w-3/4 rounded bg-slate-700/50 mb-2"></div>
              <div class="h-3 w-2/3 rounded bg-slate-700/40 mb-4"></div>
              <div class="grid grid-cols-3 gap-3">
                <div class="h-20 rounded bg-slate-700/30"></div>
                <div class="h-20 rounded bg-slate-700/25"></div>
                <div class="h-20 rounded bg-slate-700/30"></div>
              </div>
              <div class="h-8 w-32 rounded bg-cyan-500/20 mt-4"></div>
            </div>

            <!-- Cursor / clic -->
            <div
              v-if="currentEvent && (currentEvent.type === 'click' || currentEvent.metadata?.x)"
              class="absolute w-6 h-6 rounded-full border-2 border-rose-400 bg-rose-500/30 shadow-[0_0_18px_rgba(244,63,94,.7)] transition-all duration-500"
              :style="{ left: `${currentEvent.metadata?.x ?? 50}%`, top: `${currentEvent.metadata?.y ?? 50}%`, transform: 'translate(-50%,-50%)' }"
            >
              <span class="absolute inset-0 rounded-full border border-white/50 animate-ping"></span>
            </div>

            <!-- Overlay de scroll -->
            <div class="absolute right-2 top-10 bottom-2 w-1.5 rounded bg-pulso-void/80 overflow-hidden">
              <div class="w-full bg-cyan-400/70 transition-all duration-500" :style="{ height: `${scrollDepth}%`, marginTop: `${100 - scrollDepth}%` }"></div>
            </div>

            <div class="absolute bottom-2 left-3 text-[8px] font-mono text-slate-500">
              {{ currentEvent ? `${currentEvent.type.toUpperCase()} · ${currentEvent.label}` : 'SIN EVENTO' }}
            </div>
          </div>

          <!-- Controles -->
          <div class="mt-3 flex items-center gap-3">
            <button @click="toggle" class="btn-hud text-[10px] py-1.5 px-3 w-20">
              {{ playing ? '❚❚ PAUSA' : '▶ PLAY' }}
            </button>
            <button @click="step(-1)" class="btn-hud-secondary text-[10px] py-1.5 px-2">◀</button>
            <button @click="step(1)" class="btn-hud-secondary text-[10px] py-1.5 px-2">▶</button>
            <input
              v-model.number="index"
              type="range"
              :min="0"
              :max="Math.max(0, frames.length - 1)"
              class="flex-1 accent-cyan-400"
            />
            <span class="text-[9px] font-mono text-slate-400 w-16 text-right">{{ index + 1 }} / {{ frames.length }}</span>
            <select v-model.number="speed" class="bg-pulso-void border border-pulso-border rounded px-1.5 py-1 text-[9px] font-mono text-slate-300">
              <option :value="1200">0.5x</option>
              <option :value="700">1x</option>
              <option :value="350">2x</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Timeline -->
          <div class="hud-card">
            <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
              Línea de tiempo
            </h3>
            <div class="max-h-[300px] overflow-y-auto space-y-1 pr-1">
              <button
                v-for="(e, i) in frames"
                :key="e.id"
                @click="index = i"
                class="w-full flex items-center gap-2 p-1.5 rounded text-left text-[9px] font-mono transition-colors"
                :class="i === index ? 'bg-cyan-500/10 border border-cyan-500/30' : 'border border-transparent hover:bg-pulso-void/60'"
              >
                <span class="text-slate-600 w-12 flex-shrink-0">{{ timeOf(e.ts) }}</span>
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="eventDot(e.type)"></span>
                <span class="text-slate-300 truncate flex-1">{{ e.label }}</span>
                <span class="text-slate-600">{{ e.page }}</span>
              </button>
            </div>
          </div>

          <!-- Resumen del recorrido -->
          <div class="hud-card">
            <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
              Resumen de la sesión
            </h3>
            <div class="grid grid-cols-2 gap-2 text-[9px] font-mono">
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">INTERACCIÓN</p>
                <p class="text-slate-200">{{ session.clicks }} clics · scroll {{ session.scroll_avg }}%</p>
              </div>
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">EVALUACIÓN</p>
                <p :class="session.quiz_completed ? 'text-emerald-300' : session.quiz_started ? 'text-amber-300' : 'text-slate-400'">
                  {{ session.quiz_completed ? 'Completada' : session.quiz_started ? 'Abandonada' : 'No inició' }}
                </p>
              </div>
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">FORMULARIO</p>
                <p :class="session.form_submitted ? 'text-emerald-300' : session.form_started ? 'text-amber-300' : 'text-slate-400'">
                  {{ session.form_submitted ? 'Enviado' : session.form_started ? 'Abandonado' : 'No inició' }}
                </p>
              </div>
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">RESULTADO</p>
                <p :class="session.purchased ? 'text-emerald-300' : 'text-slate-400'">
                  {{ session.purchased ? `Compra ${currency(session.revenue)}` : session.booked ? 'Cita agendada' : 'Sin conversión' }}
                </p>
              </div>
            </div>

            <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500 mt-3 mb-1.5">// RECORRIDO</p>
            <div class="flex flex-wrap items-center gap-1">
              <template v-for="(p, i) in session.pageviews" :key="i">
                <span class="badge badge-cyan text-[8px] py-0 px-1.5">{{ p.label }}</span>
                <span v-if="i < session.pageviews.length - 1" class="text-slate-600 text-[9px]">→</span>
              </template>
            </div>

            <div class="mt-3 p-2 rounded bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
              🔒 Los campos de formulario se muestran como “completado/no completado”. Nunca se reproducen valores personales ni datos de salud.
            </div>
          </div>
        </div>
      </div>

      <div v-else class="xl:col-span-3 hud-card flex items-center justify-center py-20 text-[10px] font-mono text-slate-500">
        Selecciona una sesión para reconstruir su recorrido.
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import { useAnalytics } from '../store'
import { currency, formatDate } from '../engine'
import { sourceLabel } from '../demo'
import type { AnalyticsEvent, Session } from '../types'

const { filtered, business } = useAnalytics()
const search = ref('')
const selectedId = ref('')
const index = ref(0)
const playing = ref(false)
const speed = ref(700)
let timer: ReturnType<typeof setInterval> | null = null

const sessions = computed(() => [...filtered.value.sessions].sort((a, b) => b.started_at.localeCompare(a.started_at)))
const filteredSessions = computed(() => sessions.value.filter(s => {
  const q = search.value.trim().toLowerCase()
  return !q || s.visitor_id.toLowerCase().includes(q) || s.source.includes(q)
}).slice(0, 80))

watch(filteredSessions, list => {
  if (!selectedId.value && list.length) selectedId.value = list[0].id
  if (selectedId.value && !list.some(s => s.id === selectedId.value)) selectedId.value = list[0]?.id || ''
}, { immediate: true })

const session = computed<Session | undefined>(() => filtered.value.sessions.find(s => s.id === selectedId.value))
const frames = computed<AnalyticsEvent[]>(() =>
  session.value
    ? filtered.value.events.filter(e => e.session_id === session.value!.id).sort((a, b) => a.ts.localeCompare(b.ts))
    : []
)

const currentEvent = computed(() => frames.value[index.value])
const currentPage = computed(() => currentEvent.value?.page || session.value?.landing_page || '/')
const scrollDepth = computed(() => {
  const e = currentEvent.value
  if (!e) return 0
  if (e.type === 'scroll') return Number(e.metadata?.scroll ?? 50)
  return Math.min(100, Math.round((index.value / Math.max(1, frames.value.length)) * 100))
})

watch(selectedId, () => { index.value = 0; stop() })
watch(frames, () => { if (index.value >= frames.value.length) index.value = Math.max(0, frames.value.length - 1) })

function select(id: string) {
  selectedId.value = id
}
function step(dir: number) {
  index.value = Math.min(Math.max(0, index.value + dir), Math.max(0, frames.value.length - 1))
}
function toggle() {
  if (playing.value) stop()
  else {
    if (index.value >= frames.value.length - 1) index.value = 0
    playing.value = true
    timer = setInterval(() => {
      if (index.value >= frames.value.length - 1) stop()
      else index.value++
    }, speed.value)
  }
}
function stop() {
  playing.value = false
  if (timer) { clearInterval(timer); timer = null }
}
watch(speed, () => { if (playing.value) { stop(); toggle() } })
onUnmounted(stop)

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function eventDot(type: string) {
  if (type === 'click') return 'bg-rose-400'
  if (type === 'scroll') return 'bg-cyan-400'
  if (type === 'error') return 'bg-rose-500'
  if (type === 'sale') return 'bg-emerald-400'
  if (type === 'booking') return 'bg-violet-400'
  if (type.includes('quiz')) return 'bg-cyan-400'
  if (type.includes('form')) return 'bg-amber-400'
  return 'bg-slate-500'
}
</script>
