<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    <!-- Header -->
    <header class="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">👁️</div>
          <div>
            <span class="font-bold text-sm text-white">ÓPTICA JOHANNA</span>
            <span class="text-[10px] block font-mono text-cyan-400 -mt-0.5">PULSO ANALYTICS · QUIZ 3 // FATIGA DIGITAL</span>
          </div>
        </div>
        <a href="/analytics/live" class="text-[10px] font-mono text-cyan-400 border border-cyan-400/30 rounded px-2 py-1 hover:bg-cyan-400/10 transition">📊 Ver Analítica en Vivo →</a>
      </div>
      <!-- Barra de progreso -->
      <div v-if="step > 0 && step <= 3" class="h-1 bg-slate-800">
        <div class="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500" :style="{ width: `${(step / 3) * 100}%` }"></div>
      </div>
    </header>

    <main class="flex-1 max-w-xl w-full mx-auto px-4 py-10 flex flex-col justify-center">

      <!-- =================== PASO 0: BIENVENIDA =================== -->
      <div v-if="step === 0" class="space-y-6 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          EVALUACIÓN CLÍNICA · 1 MINUTO
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          ¿Tus ojos <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">sienten la fatiga</span> digital?
        </h1>
        <p class="text-sm text-slate-400 leading-relaxed">
          Evalúa tu exposición a luz azul y descubre si necesitas protección visual especializada.
        </p>
        <div class="grid grid-cols-3 gap-2.5 text-left pt-2">
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">⏱️</span>
            <p class="text-xs font-bold text-slate-200">3 preguntas</p>
            <p class="text-[10px] text-slate-500">Solo 60 segundos</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🔬</span>
            <p class="text-xs font-bold text-slate-200">Clínico</p>
            <p class="text-[10px] text-slate-500">Basado en optometría</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🎁</span>
            <p class="text-xs font-bold text-slate-200">Gratis</p>
            <p class="text-[10px] text-slate-500">Cita sin costo</p>
          </div>
        </div>
        <button @click="startQuiz" class="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer">
          Comenzar Ahora
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <p class="text-[11px] font-mono text-slate-500">🔒 Evaluación confidencial avalada por Óptica Johanna</p>
      </div>

      <!-- =================== PASO 1 =================== -->
      <div v-else-if="step === 1" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-cyan-400 font-semibold uppercase">// PREGUNTA 1 DE 3</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Cuántas horas al día pasas frente a pantallas?</h2>
          <p class="text-xs text-slate-400 mt-1">Incluye celular, computadora, tablet y TV.</p>
        </div>
        <div class="space-y-3">
          <button v-for="opt in q1Options" :key="opt.value"
            @click="selectStep1(opt.value, $event)"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="answers.horas_pantalla === opt.value
              ? 'bg-blue-600/20 border-blue-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="font-semibold">{{ opt.emoji }} {{ opt.label }}</span>
            <span v-if="opt.note" class="block text-xs text-slate-500 mt-0.5">{{ opt.note }}</span>
          </button>
        </div>
      </div>

      <!-- =================== PASO 2 =================== -->
      <div v-else-if="step === 2" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-cyan-400 font-semibold uppercase">// PREGUNTA 2 DE 3</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Qué síntoma sientes con más frecuencia?</h2>
          <p class="text-xs text-slate-400 mt-1">Selecciona el que más te molesta al final de tu jornada.</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button v-for="opt in q2Options" :key="opt.value"
            @click="selectStep2(opt.value, $event)"
            class="p-4 rounded-xl border text-center transition-all"
            :class="answers.sintomas === opt.value
              ? 'bg-cyan-500/20 border-cyan-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="text-2xl block mb-2">{{ opt.emoji }}</span>
            <span class="text-sm font-semibold">{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- =================== PASO 3 =================== -->
      <div v-else-if="step === 3" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-cyan-400 font-semibold uppercase">// PREGUNTA 3 DE 3</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Usas lentes con filtro de luz azul actualmente?</h2>
        </div>
        <div class="space-y-3">
          <button v-for="opt in q3Options" :key="opt.value"
            @click="selectStep3(opt.value, $event)"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="answers.usa_lentes === opt.value
              ? 'bg-violet-600/20 border-violet-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="font-semibold">{{ opt.emoji }} {{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- =================== RESULTADO =================== -->
      <div v-else-if="step === 4" class="space-y-6">
        <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border border-cyan-500/40">
          <div class="text-center mb-4">
            <span class="text-5xl block mb-2">{{ diagnosisEmoji }}</span>
            <h2 class="text-xl font-extrabold text-white">{{ diagnosisTitle }}</h2>
            <p class="text-sm text-slate-400 mt-2 leading-relaxed">{{ diagnosisText }}</p>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="rec in recommendations" :key="rec" class="flex items-start gap-2 text-sm text-slate-300">
              <span class="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
              <span>{{ rec }}</span>
            </div>
          </div>
        </div>

        <!-- FORMULARIO DE AGENDAMIENTO CRO -->
        <div class="hud-card space-y-4">
          <!-- A) Titular persuasivo -->
          <h3 class="font-extrabold text-white text-base leading-snug">
            Tu resultado califica para una Evaluación de Fatiga y Filtro de Luz Azul — Sin Costo — en Óptica Johanna Guayaquil.
          </h3>

          <!-- B) Reversión de riesgo -->
          <div class="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-xs text-slate-400">
            <span class="text-cyan-400 mt-0.5 flex-shrink-0">🔒</span>
            <span>Sin compromiso de compra. No te llamaremos por teléfono; coordinas tu cupo <strong class="text-slate-200">100% por WhatsApp</strong>, sin costo y sin trámites extras.</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Tu nombre completo</label>
              <input v-model="form.nombre" @focus="tracker.trackField('nombre', 'focus')" @input="tracker.trackField('nombre', 'fill')"
                type="text" placeholder="Ej. Ana Pérez"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Celular de contacto (Ecuador)</label>
              <input v-model="form.telefono" @focus="tracker.trackField('telefono', 'focus')" @input="tracker.trackField('telefono', 'fill')"
                type="tel" placeholder="09XXXXXXXX"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
              <p v-if="phoneError" class="text-xs text-rose-400 mt-1">{{ phoneError }}</p>
            </div>

            <!-- C) Micro-selector de turnos -->
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Elige tu turno</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="selectTurno('manana', '10:30')"
                  :class="form.turno === 'manana'
                    ? 'bg-cyan-600/30 border-cyan-500 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-cyan-500/50'"
                  class="p-4 rounded-xl border text-center transition-all cursor-pointer"
                >
                  <span class="text-xl block mb-1">🌅</span>
                  <span class="font-bold text-sm block">Turno Mañana</span>
                  <span class="text-[11px] text-slate-400">10:30 a 12:30</span>
                </button>
                <button
                  @click="selectTurno('tarde', '15:30')"
                  :class="form.turno === 'tarde'
                    ? 'bg-blue-600/30 border-blue-500 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-blue-500/50'"
                  class="p-4 rounded-xl border text-center transition-all cursor-pointer"
                >
                  <span class="text-xl block mb-1">🌙</span>
                  <span class="font-bold text-sm block">Turno Tarde</span>
                  <span class="text-[11px] text-slate-400">15:30 a 18:00</span>
                </button>
              </div>
            </div>
          </div>

          <p v-if="submitError" class="text-xs text-rose-400">{{ submitError }}</p>

          <!-- D) Botón submit → WhatsApp -->
          <button @click="submitForm"
            :disabled="tracker.isSubmitting.value || !form.nombre || !form.telefono || !form.turno"
            class="w-full py-4 rounded-2xl font-bold text-sm transition-all"
            :class="tracker.isSubmitting.value || !form.nombre || !form.telefono || !form.turno
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer'"
          >
            {{ tracker.isSubmitting.value ? 'Guardando turno...' : form.turno ? `📱 Apartar turno ${form.turno === 'manana' ? 'de mañana' : 'de tarde'} por WhatsApp` : '📅 Selecciona un turno para continuar' }}
          </button>
          <p class="text-[10px] text-slate-500 text-center">🔒 Tu información está protegida y se usa exclusivamente para tu cita</p>
        </div>
      </div>

      <!-- =================== CONFIRMACIÓN =================== -->
      <div v-else-if="step === 5" class="text-center space-y-6">
        <div class="text-7xl animate-bounce">🎉</div>
        <h2 class="text-2xl font-extrabold text-white">¡Cita Confirmada!</h2>
        <p class="text-sm text-slate-400">Te enviamos la confirmación por WhatsApp. Te esperamos en Óptica Johanna Guayaquil.</p>
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2 text-sm text-slate-300">
          <p>📋 <strong class="text-white">Nombre:</strong> {{ form.nombre }}</p>
          <p>📱 <strong class="text-white">Celular:</strong> {{ form.telefono }}</p>
          <p v-if="form.turno">📅 <strong class="text-white">Turno:</strong> {{ form.turno === 'manana' ? 'Mañana (10:30 – 12:30)' : 'Tarde (15:30 – 18:00)' }}</p>
          <p>📍 <strong class="text-white">Sucursal:</strong> Óptica Johanna Matriz · Guayaquil</p>
        </div>
        <a href="/analytics/visitors" class="inline-block mt-4 px-6 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-sm hover:bg-cyan-500/25 transition">
          📊 Ver en Pulso Analytics →
        </a>
        <p class="text-[10px] text-slate-600 font-mono">Session: {{ tracker.sessionId.value }} · Visitor: {{ tracker.visitorId.value }}</p>
      </div>

    </main>
  </div>

  <!-- EXIT-INTENT MODAL -->
  <Teleport to="body">
    <div v-if="showExitModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="showExitModal = false">
      <div class="max-w-sm w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-2xl shadow-amber-500/10">
        <div class="text-center">
          <span class="text-4xl block mb-2">⚠️</span>
          <h3 class="text-lg font-extrabold text-white">¡Espera! Tu diagnóstico tiene un beneficio activo</h3>
          <p class="text-sm text-slate-400 mt-2">¿Deseas que te enviemos tu reporte por WhatsApp para que no lo pierdas?</p>
        </div>
        <button @click="sendReportByWhatsApp" class="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-green-500 hover:to-emerald-400 transition cursor-pointer">
          📱 Recibir mi reporte en WhatsApp
        </button>
        <button @click="showExitModal = false" class="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
          No, seguir revisando
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onUnmounted } from 'vue'
import { usePulsoTracker } from '../composables/usePulsoTracker'
import { normalizeEcuadorianPhone } from '../composables/usePulsoTracker'

// Inicializar el tracker
const tracker = usePulsoTracker({
  clientSlug: 'optica',
  quizKey: 'quiz3',
  quizName: 'Quiz 3 · Fatiga Digital & Luz Azul',
})

const step = ref(0)
const answers = reactive({
  horas_pantalla: '',
  sintomas: '',
  usa_lentes: '',
})

const form = reactive({
  nombre: '',
  telefono: '',
  fecha_cita: '',
  hora_cita: '',
  turno: '',
})

const phoneError = ref('')
const submitError = ref('')

const todayStr = new Date().toISOString().split('T')[0]
const horarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

// ===========================================================================
// OPCIONES
// ===========================================================================
const q1Options = [
  { value: 'menos4h', emoji: '😊', label: 'Menos de 4 horas', note: 'Exposición baja' },
  { value: '4a8h',    emoji: '⚠️', label: '4 a 8 horas',      note: 'Zona de alerta' },
  { value: 'mas8h',   emoji: '🔴', label: 'Más de 8 horas',   note: 'Riesgo elevado de fatiga' },
]

const q2Options = [
  { value: 'ojos_secos',  emoji: '👁️', label: 'Ojos secos' },
  { value: 'ardor',       emoji: '🔥', label: 'Ardor' },
  { value: 'cefalea',     emoji: '🤕', label: 'Dolor de cabeza' },
  { value: 'vision_borrosa', emoji: '😵', label: 'Visión borrosa' },
  { value: 'ninguno',     emoji: '✅', label: 'Sin molestias' },
]

const q3Options = [
  { value: 'si',           emoji: '✅', label: 'Sí, ya uso filtro de luz azul' },
  { value: 'no_quiero',    emoji: '❓', label: 'No, pero me interesa conocer opciones' },
  { value: 'no_no_sabe',   emoji: '🤷', label: 'No sé si los míos tienen filtro' },
  { value: 'no_no_usa',    emoji: '🕶️', label: 'No uso lentes actualmente' },
]

// ===========================================================================
// DIAGNOSIS
// ===========================================================================
const diagnosisEmoji = computed(() => {
  if (answers.horas_pantalla === 'mas8h') return '🔴'
  if (answers.horas_pantalla === '4a8h') return '🟡'
  return '🟢'
})

const diagnosisTitle = computed(() => {
  if (answers.horas_pantalla === 'mas8h') return 'Fatiga Visual Digital Severa'
  if (answers.horas_pantalla === '4a8h') return 'Fatiga Visual Digital Moderada'
  return 'Perfil Visual Saludable'
})

const diagnosisText = computed(() => {
  if (answers.horas_pantalla === 'mas8h') return `Con más de 8 horas diarias frente a pantallas y ${answers.sintomas !== 'ninguno' ? 'síntomas de ' + answers.sintomas.replace('_', ' ') : 'exposición intensa'}, tu sistema visual está bajo estrés constante. Se recomienda evaluación especializada urgente.`
  if (answers.horas_pantalla === '4a8h') return 'Tu nivel de exposición genera fatiga acumulada. Con lentes adecuados y ajustes de hábitos puedes mejorar significativamente tu comodidad visual.'
  return 'Tu nivel de exposición es moderado. Una evaluación preventiva te ayudará a mantener una visión óptima a largo plazo.'
})

const recommendations = computed(() => {
  const recs = []
  if (answers.horas_pantalla !== 'menos4h') recs.push('Implementar la regla 20-20-20: cada 20 min, descansar 20 seg mirando a 20 pies de distancia')
  if (answers.sintomas === 'ojos_secos') recs.push('Usar lágrimas artificiales sin conservantes durante la jornada')
  if (answers.usa_lentes === 'no_quiero' || answers.usa_lentes === 'no_no_sabe') recs.push('Consultar sobre lentes oftálmicos con filtro de luz azul certificado')
  recs.push('Evaluación visual completa gratuita con nuestro especialista')
  return recs.slice(0, 3)
})

// ===========================================================================
// WHATSAPP
// ===========================================================================
function openWhatsApp(msg: string) {
  const phone = '593999999999' // TODO: cambiar por número real de Óptica Johanna
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}

function sendReportByWhatsApp() {
  const phone = '593999999999' // TODO: cambiar por número real
  const msg = `Hola, acabo de hacer la evaluación de fatiga visual de Óptica Johanna. Mi resultado: ${diagnosisTitle.value}. Me gustaría recibir mi reporte y conocer opciones de lentes con filtro sin compromiso.`
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  showExitModal.value = false
}

// ===========================================================================
// EXIT-INTENT
// ===========================================================================
const showExitModal = ref(false)
let exitTimer: ReturnType<typeof setTimeout> | null = null
let exitIntentBound = false

function onMouseMove(e: MouseEvent) {
  if (e.clientY < 50 && !showExitModal.value) {
    showExitModal.value = true
    removeExitListeners()
  }
}
function resetExitTimer() {
  if (exitTimer) clearTimeout(exitTimer)
  exitTimer = setTimeout(() => {
    if (!showExitModal.value) showExitModal.value = true
  }, 7000)
}
function addExitListeners() {
  if (exitIntentBound) return
  exitIntentBound = true
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('click', resetExitTimer)
  document.addEventListener('keydown', resetExitTimer)
  resetExitTimer()
}
function removeExitListeners() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('click', resetExitTimer)
  document.removeEventListener('keydown', resetExitTimer)
  if (exitTimer) { clearTimeout(exitTimer); exitTimer = null }
  exitIntentBound = false
}

watch(step, (val) => {
  if (val === 4) addExitListeners()
  else removeExitListeners()
})
onUnmounted(() => removeExitListeners())

// ===========================================================================
// NAVEGACIÓN
// ===========================================================================
async function startQuiz() {
  step.value = 1
  await tracker.trackQuizStart()
}

async function selectStep1(value: string, event: MouseEvent) {
  answers.horas_pantalla = value
  await tracker.trackStep(1, { horas_pantalla: value }, event)
  setTimeout(() => { step.value = 2 }, 350)
}

async function selectStep2(value: string, event: MouseEvent) {
  answers.sintomas = value
  await tracker.trackStep(2, { sintomas: value }, event)
  setTimeout(() => { step.value = 3 }, 350)
}

async function selectStep3(value: string, event: MouseEvent) {
  answers.usa_lentes = value
  await tracker.trackStep(3, { usa_lentes: value }, event)

  const diag = diagnosisTitle.value
  await tracker.trackCompleted({
    score: answers.horas_pantalla === 'mas8h' ? 85 : answers.horas_pantalla === '4a8h' ? 55 : 25,
    diagnosis: diag,
    answers: { ...answers },
  })

  setTimeout(() => { step.value = 4 }, 350)
}

function selectTurno(turno: string, hora: string) {
  form.turno = turno
  form.hora_cita = hora
}

async function submitForm() {
  phoneError.value = ''
  submitError.value = ''

  const validation = normalizeEcuadorianPhone(form.telefono)
  if (!validation.isValid) {
    phoneError.value = validation.error || 'Número inválido'
    return
  }

  const success = await tracker.submitBooking({
    nombre: form.nombre,
    telefono: form.telefono,
    fecha_cita: form.fecha_cita || null,
    hora_cita: form.hora_cita || null,
    sucursal: 'Matriz Guayaquil',
    metadata: { ...answers, turno: form.turno, diagnostico: diagnosisTitle.value },
  })

  if (success) {
    const msg = `¡Hola! Acabo de completar el chequeo de fatiga visual de Óptica Johanna (${diagnosisTitle.value}). Aparté el turno ${form.turno === 'manana' ? 'de la mañana (10:30)' : 'de la tarde (15:30)'} para mi evaluación gratuita en Matriz Guayaquil. ¿Me confirmas la dirección?`
    openWhatsApp(msg)
    step.value = 5
  } else {
    submitError.value = tracker.errorMsg.value || 'Error al guardar. Intenta de nuevo.'
  }
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hud-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 1rem;
  padding: 1.25rem;
}
</style>
