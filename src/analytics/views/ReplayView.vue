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
          <div class="relative rounded-xl border border-pulso-border/70 bg-[#060a14] overflow-hidden" style="height: 380px">
            <!-- Barra de navegador -->
            <div class="h-8 bg-pulso-surface border-b border-pulso-border/60 flex items-center gap-2 px-3 z-10 relative">
              <span class="w-2 h-2 rounded-full bg-rose-500/70"></span>
              <span class="w-2 h-2 rounded-full bg-amber-500/70"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-500/70"></span>
              <div class="flex-1 mx-2 h-5 rounded bg-pulso-void border border-pulso-border/50 flex items-center px-2 text-[8px] font-mono text-slate-400 truncate">
                https://{{ business?.website || 'sitio-cliente.ec' }}{{ currentPage }}
              </div>
            </div>

            <!-- Contenido Reconstruido del Quiz / Sitio -->
            <div class="p-4 sm:p-6 h-[calc(100%-2rem)] overflow-y-auto flex items-center justify-center relative select-none bg-gradient-to-b from-[#080d1a] to-[#040711]">
              <!-- Card del Quiz Reconstruido -->
              <div class="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 text-slate-800">
                <!-- Header del Quiz -->
                <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span class="font-tech text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {{ session.landing_page.includes('quiz2') ? 'Quiz 2 · VisiónCheck' : 'Quiz 1 · Chequeo Visual' }}
                    </span>
                  </div>
                  <span class="text-[8px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full font-bold">
                    {{ isResultStage ? 'RESULTADOS' : `PASO ${activeQuizStep?.step || 1} DE 3` }}
                  </span>
                </div>

                <!-- Caso A: Pantalla de Resultado / Agendamiento -->
                <div v-if="isResultStage" class="text-center py-2 space-y-2">
                  <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg shadow-sm">
                    👓
                  </div>
                  <h4 class="font-bold text-xs text-slate-900 leading-tight">
                    {{ session.quiz_completed ? 'Evaluación Visual Completada' : 'Resultado Diagnóstico' }}
                  </h4>
                  <p class="text-[9px] text-slate-600 leading-relaxed px-2">
                    {{ session.booked ? 'Cita médica agendada en Óptica Johanna (Matriz Guayaquil).' : 'Tus síntomas indican necesidad de examen visual computarizado.' }}
                  </p>
                  <div class="pt-1">
                    <button class="w-full py-2 px-3 rounded-xl bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-md">
                      <span>💬</span>
                      <span>{{ session.booked ? 'Turno Confirmado en WhatsApp' : 'Agendar mi Cita Gratuita' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Caso B: Pregunta Clínica Activa del Quiz -->
                <div v-else class="space-y-2">
                  <h4 class="font-bold text-[11px] text-slate-900 leading-snug">
                    {{ activeQuizStep?.question || '¿Cuál es tu molestia principal en los ojos?' }}
                  </h4>
                  
                  <div class="space-y-1.5 pt-1">
                    <div
                      v-for="(opt, optIdx) in mockOptionsForStep"
                      :key="optIdx"
                      class="p-2 rounded-xl border text-[10px] font-medium flex items-center justify-between transition-all"
                      :class="opt.isSelected 
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'"
                    >
                      <div class="flex items-center gap-2">
                        <span>{{ opt.icon }}</span>
                        <span>{{ opt.text }}</span>
                      </div>
                      <span v-if="opt.isSelected" class="w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cursor / clic con Tooltip informativo -->
            <div
              v-if="currentEvent && (currentEvent.type === 'click' || currentEvent.metadata?.x)"
              class="absolute z-20 pointer-events-none transition-all duration-300"
              :style="{ left: `${currentEvent.metadata?.x ?? 50}%`, top: `${Math.min(85, Math.max(15, currentEvent.metadata?.y ?? 50))}%`, transform: 'translate(-50%,-50%)' }"
            >
              <!-- Tooltip flotante con la acción real -->
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-950/95 border border-rose-500/60 text-rose-100 text-[8px] font-mono px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                <span>🔴</span>
                <span class="font-bold">{{ currentEvent.label || 'Clic en pantalla' }}</span>
              </div>

              <!-- Anillo y pulso de clic -->
              <div class="relative w-7 h-7 rounded-full border-2 border-rose-400 bg-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,.8)] flex items-center justify-center">
                <span class="w-2 h-2 rounded-full bg-white"></span>
                <span class="absolute inset-0 rounded-full border border-white animate-ping"></span>
              </div>
            </div>

            <!-- Overlay de scroll -->
            <div class="absolute right-2 top-10 bottom-10 w-1.5 rounded bg-pulso-void/80 overflow-hidden z-10">
              <div class="w-full bg-cyan-400/70 transition-all duration-500" :style="{ height: `${scrollDepth}%`, marginTop: `${100 - scrollDepth}%` }"></div>
            </div>

            <div class="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[8px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded border border-pulso-border/50">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{{ currentEvent ? `${currentEvent.type.toUpperCase()} · ${currentEvent.label}` : 'SIN EVENTO' }}</span>
              </span>
              <span class="text-slate-500">RECONSTRUCCIÓN VECTORIAL DOM (PRIVACIDAD POR DISEÑO)</span>
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

const isResultStage = computed(() => {
  const p = currentPage.value.toLowerCase()
  const ev = currentEvent.value?.type || ''
  const lbl = currentEvent.value?.label?.toLowerCase() || ''
  return p.includes('resultado') || p.includes('agendar') || ev === 'booking' || ev === 'sale' || lbl.includes('resultado') || lbl.includes('cita') || (session.value?.quiz_completed && index.value >= frames.value.length - 2)
})

const activeQuizStep = computed(() => {
  if (!session.value?.quiz_steps || session.value.quiz_steps.length === 0) return null
  const steps = session.value.quiz_steps
  const evStep = currentEvent.value?.metadata?.step
  if (typeof evStep === 'number' && evStep >= 1 && evStep <= steps.length) {
    return steps[evStep - 1]
  }
  const total = steps.length
  const ratio = frames.value.length > 0 ? index.value / frames.value.length : 0
  const stepIdx = Math.min(total - 1, Math.floor(ratio * total))
  return steps[stepIdx]
})

const mockOptionsForStep = computed(() => {
  const step = activeQuizStep.value?.step || 1
  const ans = (activeQuizStep.value?.answer || '').toLowerCase()

  if (step === 1) {
    return [
      { icon: '👓', text: 'Cansancio o fatiga visual', isSelected: ans.includes('fatiga') || ans.includes('cansancio') || true },
      { icon: '🔍', text: 'Visión borrosa de cerca', isSelected: ans.includes('cerca') || ans.includes('borrosa') },
      { icon: '🚗', text: 'Visión borrosa de lejos', isSelected: ans.includes('lejos') },
      { icon: '✨', text: 'Dolor de cabeza frecuente', isSelected: ans.includes('cabeza') || ans.includes('dolor') },
    ]
  } else if (step === 2) {
    return [
      { icon: '📱', text: 'Más de 5 horas frente a pantallas', isSelected: true },
      { icon: '💼', text: 'De 2 a 4 horas al día', isSelected: false },
      { icon: '🌿', text: 'Menos de 2 horas al día', isSelected: false },
    ]
  } else {
    return [
      { icon: '👓', text: 'Uso lentes actualmente', isSelected: ans.includes('sí') || ans.includes('lentes') },
      { icon: '✨', text: 'Nunca he usado lentes', isSelected: !ans.includes('sí') },
    ]
  }
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
