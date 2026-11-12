<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    <!-- Header -->
    <header class="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/20">🔍</div>
          <div>
            <span class="font-bold text-sm text-white">ÓPTICA JOHANNA</span>
            <span class="text-[10px] block font-mono text-violet-400 -mt-0.5">PULSO ANALYTICS · QUIZ 2 // VISIÓNCHECK</span>
          </div>
        </div>
        <a href="/analytics/live" class="text-[10px] font-mono text-violet-400 border border-violet-400/30 rounded px-2 py-1 hover:bg-violet-400/10 transition">📊 Ver Analítica en Vivo →</a>
      </div>
      <!-- Barra de progreso -->
      <div v-if="step > 0 && step <= 3" class="h-1 bg-slate-800">
        <div class="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-400 transition-all duration-500" :style="{ width: `${(step / 3) * 100}%` }"></div>
      </div>
    </header>

    <main class="flex-1 max-w-xl w-full mx-auto px-4 py-10 flex flex-col justify-center">

      <!-- =================== PASO 0: BIENVENIDA =================== -->
      <div v-if="step === 0" class="space-y-6 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
          TEST DE AGUDEZA VISUAL INTERACTIVO
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Comprueba tu <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">agudeza y nitidez</span> visual
        </h1>
        <p class="text-sm text-slate-400 leading-relaxed">
          Calibra tu vista a 40 cm de la pantalla con optotipos optométricos interactivos y conoce tu agudeza estimada.
        </p>
        <div class="grid grid-cols-3 gap-2.5 text-left pt-2">
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">📏</span>
            <p class="text-xs font-bold text-slate-200">A 40 cm</p>
            <p class="text-[10px] text-slate-500">Distancia estándar</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🎯</span>
            <p class="text-xs font-bold text-slate-200">Optotipos</p>
            <p class="text-[10px] text-slate-500">Prueba Snellen / E</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🎁</span>
            <p class="text-xs font-bold text-slate-200">Gratuito</p>
            <p class="text-[10px] text-slate-500">Diagnóstico preliminar</p>
          </div>
        </div>
        <button @click="startQuiz" class="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-bold text-base shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer">
          Comenzar VisiónCheck
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <p class="text-[11px] font-mono text-slate-500">🔒 Prueba interactiva calibrada para pantallas por Óptica Johanna</p>
      </div>

      <!-- =================== PASO 1: PRUEBA OPTOTIPO RONDA 1 =================== -->
      <div v-else-if="step === 1" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-violet-400 font-semibold uppercase">// RONDA 1 DE 3 · AGUDEZA BASE</span>
          <h2 class="text-xl font-bold text-white mt-1">¿Hacia qué dirección apuntan las tres barras del símbolo?</h2>
          <p class="text-xs text-slate-400 mt-1">Mantén tu celular o pantalla a 40 cm de tus ojos.</p>
        </div>

        <!-- Símbolo Optotipo -->
        <div class="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-inner">
          <div class="w-20 h-20 border-4 border-white flex flex-col justify-between p-2 transform rotate-90 rounded bg-slate-950">
            <div class="h-2 bg-white rounded-full"></div>
            <div class="h-2 bg-white w-2/3 rounded-full"></div>
            <div class="h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button v-for="dir in optotypeDirections1" :key="dir.value"
            @click="selectStep1(dir.value, $event)"
            class="p-4 rounded-xl border text-center transition-all"
            :class="answers.optotipo1 === dir.value
              ? 'bg-violet-600/30 border-violet-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="text-2xl block mb-1">{{ dir.icon }}</span>
            <span class="font-semibold text-sm">{{ dir.label }}</span>
          </button>
        </div>
      </div>

      <!-- =================== PASO 2: PRUEBA OPTOTIPO RONDA 2 =================== -->
      <div v-else-if="step === 2" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-violet-400 font-semibold uppercase">// RONDA 2 DE 3 · ENFOQUE FINO</span>
          <h2 class="text-xl font-bold text-white mt-1">¿Hacia dónde apunta este optotipo más pequeño?</h2>
          <p class="text-xs text-slate-400 mt-1">No te acerques a la pantalla. Evalúa tu nitidez natural.</p>
        </div>

        <!-- Símbolo Optotipo Reducido -->
        <div class="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-inner">
          <div class="w-10 h-10 border-2 border-white flex flex-col justify-between p-1 transform rotate-180 rounded bg-slate-950">
            <div class="h-1 bg-white rounded-full"></div>
            <div class="h-1 bg-white w-2/3 rounded-full"></div>
            <div class="h-1 bg-white rounded-full"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button v-for="dir in optotypeDirections2" :key="dir.value"
            @click="selectStep2(dir.value, $event)"
            class="p-4 rounded-xl border text-center transition-all"
            :class="answers.optotipo2 === dir.value
              ? 'bg-violet-600/30 border-violet-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="text-2xl block mb-1">{{ dir.icon }}</span>
            <span class="font-semibold text-sm">{{ dir.label }}</span>
          </button>
        </div>
      </div>

      <!-- =================== PASO 3: HISTORIAL & HÁBITOS =================== -->
      <div v-else-if="step === 3" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-violet-400 font-semibold uppercase">// PREGUNTA 3 DE 3 · ANTECEDENTES</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Cuándo fue tu último examen visual completo?</h2>
          <p class="text-xs text-slate-400 mt-1">Nos ayuda a contextualizar la precisión de tu fórmula actual.</p>
        </div>
        <div class="space-y-3">
          <button v-for="opt in q3HistoryOptions" :key="opt.value"
            @click="selectStep3(opt.value, $event)"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="answers.ultimo_chequeo === opt.value
              ? 'bg-purple-600/20 border-purple-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="font-semibold">{{ opt.emoji }} {{ opt.label }}</span>
            <span v-if="opt.note" class="block text-xs text-slate-500 mt-0.5">{{ opt.note }}</span>
          </button>
        </div>
      </div>

      <!-- =================== RESULTADO =================== -->
      <div v-else-if="step === 4" class="space-y-6">
        <div class="p-5 rounded-2xl bg-gradient-to-br from-violet-950/60 to-slate-900/80 border border-violet-500/40">
          <div class="text-center mb-4">
            <span class="text-5xl block mb-2">{{ diagnosisEmoji }}</span>
            <span class="text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">AGUDEZA ESTIMADA: {{ acuityScore }}</span>
            <h2 class="text-xl font-extrabold text-white mt-1">{{ diagnosisTitle }}</h2>
            <p class="text-sm text-slate-400 mt-2 leading-relaxed">{{ diagnosisText }}</p>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="rec in recommendations" :key="rec" class="flex items-start gap-2 text-sm text-slate-300">
              <span class="text-violet-400 mt-0.5 flex-shrink-0">✓</span>
              <span>{{ rec }}</span>
            </div>
          </div>
        </div>

        <!-- FORMULARIO DE AGENDAMIENTO -->
        <div class="hud-card space-y-4">
          <h3 class="font-bold text-white text-base">📅 Confirma tu Examen Optométrico Sin Costo</h3>
          <p class="text-xs text-slate-400">Verifica tu refracción exacta en consultorio con equipo computarizado.</p>

          <div class="space-y-3">
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Nombre y apellido</label>
              <input v-model="form.nombre" @focus="tracker.trackField('nombre', 'focus')" @input="tracker.trackField('nombre', 'fill')"
                type="text" placeholder="Ej. Carlos Mendoza"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 transition"
              />
            </div>
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Celular de contacto (Ecuador)</label>
              <input v-model="form.telefono" @focus="tracker.trackField('telefono', 'focus')" @input="tracker.trackField('telefono', 'fill')"
                type="tel" placeholder="09XXXXXXXX"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 transition"
              />
              <p v-if="phoneError" class="text-xs text-rose-400 mt-1">{{ phoneError }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Fecha preferida</label>
                <input v-model="form.fecha_cita" type="date" :min="todayStr"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-400 transition"
                />
              </div>
              <div>
                <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Hora preferida</label>
                <select v-model="form.hora_cita" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-400 transition">
                  <option value="">Cualquier hora</option>
                  <option v-for="h in horarios" :key="h" :value="h">{{ h }}</option>
                </select>
              </div>
            </div>
          </div>

          <p v-if="submitError" class="text-xs text-rose-400">{{ submitError }}</p>

          <button @click="submitForm"
            :disabled="tracker.isSubmitting.value || !form.nombre || !form.telefono"
            class="w-full py-4 rounded-2xl font-bold text-sm transition-all"
            :class="tracker.isSubmitting.value || !form.nombre || !form.telefono
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 cursor-pointer'"
          >
            {{ tracker.isSubmitting.value ? 'Guardando turno...' : '📅 Confirmar Examen en Consultorio' }}
          </button>
          <p class="text-[10px] text-slate-500 text-center">🔒 Tu información médica se guarda bajo estricta confidencialidad</p>
        </div>
      </div>

      <!-- =================== CONFIRMACIÓN =================== -->
      <div v-else-if="step === 5" class="text-center space-y-6">
        <div class="text-7xl animate-bounce">🎉</div>
        <h2 class="text-2xl font-extrabold text-white">¡Examen Confirmado!</h2>
        <p class="text-sm text-slate-400">Te esperamos en Óptica Johanna para tu evaluación completa con autorrefractómetro.</p>
        <div class="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-left space-y-2 text-sm text-slate-300">
          <p>📋 <strong class="text-white">Nombre:</strong> {{ form.nombre }}</p>
          <p>📱 <strong class="text-white">Celular:</strong> {{ form.telefono }}</p>
          <p>🎯 <strong class="text-white">Agudeza estimada:</strong> {{ acuityScore }}</p>
          <p v-if="form.fecha_cita">📅 <strong class="text-white">Cita:</strong> {{ form.fecha_cita }} {{ form.hora_cita }}</p>
          <p>📍 <strong class="text-white">Lugar:</strong> Óptica Johanna Matriz · Sangolquí</p>
        </div>
        <a href="/analytics/visitors" class="inline-block mt-4 px-6 py-3 rounded-xl bg-violet-500/15 border border-violet-500/40 text-violet-300 font-mono text-sm hover:bg-violet-500/25 transition">
          📊 Ver en Pulso Analytics →
        </a>
        <p class="text-[10px] text-slate-600 font-mono">Session: {{ tracker.sessionId.value }} · Visitor: {{ tracker.visitorId.value }}</p>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { usePulsoTracker } from '../composables/usePulsoTracker'
import { normalizeEcuadorianPhone } from '../composables/usePulsoTracker'

// Inicializar tracker de Pulso para Quiz 2
const tracker = usePulsoTracker({
  clientSlug: 'optica',
  quizKey: 'quiz2',
  quizName: 'Quiz 2 · VisiónCheck Agudeza Visual',
})

const step = ref(0)
const answers = reactive({
  optotipo1: '',
  optotipo2: '',
  ultimo_chequeo: '',
})

const form = reactive({
  nombre: '',
  telefono: '',
  fecha_cita: '',
  hora_cita: '',
})

const phoneError = ref('')
const submitError = ref('')
const todayStr = new Date().toISOString().split('T')[0]
const horarios = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00']

// Opciones de dirección optotipo ronda 1
const optotypeDirections1 = [
  { value: 'derecha',   icon: '➡️', label: 'Hacia la derecha' },
  { value: 'arriba',    icon: '⬆️', label: 'Hacia arriba' },
  { value: 'izquierda', icon: '⬅️', label: 'Hacia la izquierda' },
  { value: 'abajo',     icon: '⬇️', label: 'Hacia abajo' },
]

// Opciones de dirección optotipo ronda 2
const optotypeDirections2 = [
  { value: 'izquierda', icon: '⬅️', label: 'Hacia la izquierda' },
  { value: 'arriba',    icon: '⬆️', label: 'Hacia arriba' },
  { value: 'derecha',   icon: '➡️', label: 'Hacia la derecha' },
  { value: 'abajo',     icon: '⬇️', label: 'Hacia abajo' },
]

// Historial
const q3HistoryOptions = [
  { value: 'mas_1ano',   emoji: '⏳', label: 'Hace más de 1 año', note: 'Es momento de renovar o verificar graduación' },
  { value: 'nunca',      emoji: '🆕', label: 'Nunca me he realizado un examen', note: 'Recomendable chequeo inicial completo' },
  { value: 'uso_lentes', emoji: '🕶️', label: 'Uso lentes pero siento que ya no veo tan nítido', note: 'Posible cambio en dioptrías' },
  { value: 'reciente',   emoji: '✅', label: 'Hace menos de 6 meses', note: 'Control de rutina al día' },
]

// ===========================================================================
// DIAGNÓSTICO DE AGUDEZA
// ===========================================================================
const acuityScore = computed(() => {
  if (answers.optotipo1 === 'derecha' && answers.optotipo2 === 'izquierda') return '20/20 (Excelente)'
  if (answers.optotipo1 === 'derecha') return '20/40 (Leve Disminución)'
  return '20/60 o menor (Requiere Evaluación)'
})

const diagnosisEmoji = computed(() => {
  if (acuityScore.value.includes('20/20')) return '🟢'
  if (acuityScore.value.includes('20/40')) return '🟡'
  return '🔴'
})

const diagnosisTitle = computed(() => {
  if (acuityScore.value.includes('20/20')) return 'Agudeza Visual Alta Conservada'
  if (acuityScore.value.includes('20/40')) return 'Disminución Moderada de Nitidez'
  return 'Compromiso de Agudeza Visual Detectado'
})

const diagnosisText = computed(() => {
  if (acuityScore.value.includes('20/20')) {
    return 'Tu capacidad de discriminación en optotipos estándar es adecuada. Un chequeo presencial confirmará si existe fatiga o esfuerzo muscular no manifiesto.'
  }
  if (acuityScore.value.includes('20/40')) {
    return 'Detectamos cierta dificultad en optotipos de escala fina. Es común cuando existe un leve astigmatismo o pérdida de acomodación. Una pequeña corrección óptica te devolverá el 100% de nitidez.'
  }
  return 'Se identificó dificultad para discernir la orientación de los optotipos a distancia de lectura. Se aconseja una refracción clínica prioritaria para prevenir mayor esfuerzo ocular.'
})

const recommendations = computed(() => [
  'Examen con cartilla optométrica Snellen y foróptero en Óptica Johanna',
  'Medición de agudeza visual binocular y monocular',
  'Prescripción de lunas antirreflejo y filtro UV de alta definición',
])

// ===========================================================================
// NAVEGACIÓN Y TELEMETRÍA
// ===========================================================================
async function startQuiz() {
  step.value = 1
  await tracker.trackQuizStart()
}

async function selectStep1(value: string, event: MouseEvent) {
  answers.optotipo1 = value
  await tracker.trackStep(1, { optotipo1: value }, event)
  setTimeout(() => { step.value = 2 }, 350)
}

async function selectStep2(value: string, event: MouseEvent) {
  answers.optotipo2 = value
  await tracker.trackStep(2, { optotipo2: value }, event)
  setTimeout(() => { step.value = 3 }, 350)
}

async function selectStep3(value: string, event: MouseEvent) {
  answers.ultimo_chequeo = value
  await tracker.trackStep(3, { ultimo_chequeo: value }, event)

  const diag = diagnosisTitle.value
  await tracker.trackCompleted({
    score: acuityScore.value.includes('20/20') ? 95 : acuityScore.value.includes('20/40') ? 60 : 30,
    diagnosis: diag,
    answers: { ...answers, agudeza: acuityScore.value },
  })

  setTimeout(() => { step.value = 4 }, 350)
}

async function submitForm() {
  phoneError.value = ''
  submitError.value = ''

  const validation = normalizeEcuadorianPhone(form.telefono)
  if (!validation.isValid) {
    phoneError.value = validation.error || 'Número de celular inválido'
    return
  }

  const success = await tracker.submitBooking({
    nombre: form.nombre,
    telefono: form.telefono,
    fecha_cita: form.fecha_cita || null,
    hora_cita: form.hora_cita || null,
    sucursal: 'Matriz Sangolquí',
    metadata: { ...answers, agudeza_estimada: acuityScore.value, diagnostico: diagnosisTitle.value },
  })

  if (success) {
    step.value = 5
  } else {
    submitError.value = tracker.errorMsg.value || 'Error al guardar cita. Intenta de nuevo.'
  }
}
</script>

<style scoped>
.hud-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 1rem;
  padding: 1.25rem;
}
</style>
