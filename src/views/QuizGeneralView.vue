<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    <!-- Header -->
    <header class="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">👁️</div>
          <div>
            <span class="font-bold text-sm text-white">ÓPTICA JOHANNA</span>
            <span class="text-[10px] block font-mono text-emerald-400 -mt-0.5">PULSO ANALYTICS · QUIZ 1 // CHEQUEO INTEGRAL</span>
          </div>
        </div>
        <a href="/analytics/live" class="text-[10px] font-mono text-emerald-400 border border-emerald-400/30 rounded px-2 py-1 hover:bg-emerald-400/10 transition">📊 Ver Analítica en Vivo →</a>
      </div>
      <!-- Barra de progreso -->
      <div v-if="step > 0 && step <= 3" class="h-1 bg-slate-800">
        <div class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500" :style="{ width: `${(step / 3) * 100}%` }"></div>
      </div>
    </header>

    <main class="flex-1 max-w-xl w-full mx-auto px-4 py-10 flex flex-col justify-center">

      <!-- =================== PASO 0: BIENVENIDA =================== -->
      <div v-if="step === 0" class="space-y-6 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          EVALUACIÓN VISUAL GENERAL · 1 MINUTO
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          ¿Notas <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">cambios o cansancio</span> en tu visión?
        </h1>
        <p class="text-sm text-slate-400 leading-relaxed">
          Descubre si necesitas actualización de lentes o examen de refracción con nuestro chequeo guiado.
        </p>
        <div class="grid grid-cols-3 gap-2.5 text-left pt-2">
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">⏱️</span>
            <p class="text-xs font-bold text-slate-200">1 Minuto</p>
            <p class="text-[10px] text-slate-500">3 preguntas clave</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🔬</span>
            <p class="text-xs font-bold text-slate-200">Clínico</p>
            <p class="text-[10px] text-slate-500">Optometría integral</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🎁</span>
            <p class="text-xs font-bold text-slate-200">Sin Costo</p>
            <p class="text-[10px] text-slate-500">Evaluación gratuita</p>
          </div>
        </div>
        <button @click="startQuiz" class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer">
          Iniciar Chequeo Ahora
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <p class="text-[11px] font-mono text-slate-500">🔒 Evaluación avalada por Óptica Johanna · Guayaquil</p>
      </div>

      <!-- =================== PASO 1 =================== -->
      <div v-else-if="step === 1" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-emerald-400 font-semibold uppercase">// PREGUNTA 1 DE 3</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Qué molestia visual experimentas con mayor frecuencia?</h2>
          <p class="text-xs text-slate-400 mt-1">Selecciona la principal dificultad que notas en tu día a día.</p>
        </div>
        <div class="space-y-3">
          <button v-for="opt in q1Options" :key="opt.value"
            @click="selectStep1(opt.value, $event)"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="answers.sintomas === opt.value
              ? 'bg-emerald-600/20 border-emerald-500 text-white'
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
          <span class="text-xs font-mono text-emerald-400 font-semibold uppercase">// PREGUNTA 2 DE 3</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Tienes dificultad para ver de cerca o leer?</h2>
          <p class="text-xs text-slate-400 mt-1">¿Alejas el celular o libros para enfocar mejor las letras pequeñas?</p>
        </div>
        <div class="space-y-3">
          <button v-for="opt in q2Options" :key="opt.value"
            @click="selectStep2(opt.value, $event)"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="answers.vision_cerca === opt.value
              ? 'bg-teal-600/20 border-teal-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="font-semibold">{{ opt.emoji }} {{ opt.label }}</span>
            <span v-if="opt.note" class="block text-xs text-slate-500 mt-0.5">{{ opt.note }}</span>
          </button>
        </div>
      </div>

      <!-- =================== PASO 3 =================== -->
      <div v-else-if="step === 3" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-emerald-400 font-semibold uppercase">// PREGUNTA 3 DE 3</span>
          <h2 class="text-2xl font-bold text-white mt-1">¿Cómo es tu visión al conducir o ver letreros de lejos?</h2>
          <p class="text-xs text-slate-400 mt-1">Especialmente de noche o con luces brillantes.</p>
        </div>
        <div class="space-y-3">
          <button v-for="opt in q3Options" :key="opt.value"
            @click="selectStep3(opt.value, $event)"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="answers.vision_lejos === opt.value
              ? 'bg-cyan-600/20 border-cyan-500 text-white'
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'"
          >
            <span class="font-semibold">{{ opt.emoji }} {{ opt.label }}</span>
            <span v-if="opt.note" class="block text-xs text-slate-500 mt-0.5">{{ opt.note }}</span>
          </button>
        </div>
      </div>

      <!-- =================== RESULTADO =================== -->
      <div v-else-if="step === 4" class="space-y-6">
        <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900/80 border border-emerald-500/40">
          <div class="text-center mb-4">
            <span class="text-5xl block mb-2">{{ diagnosisEmoji }}</span>
            <h2 class="text-xl font-extrabold text-white">{{ diagnosisTitle }}</h2>
            <p class="text-sm text-slate-400 mt-2 leading-relaxed">{{ diagnosisText }}</p>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="rec in recommendations" :key="rec" class="flex items-start gap-2 text-sm text-slate-300">
              <span class="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
              <span>{{ rec }}</span>
            </div>
          </div>
        </div>

        <!-- FORMULARIO DE AGENDAMIENTO -->
        <div class="hud-card space-y-4">
          <h3 class="font-bold text-white text-base">📅 Agenda tu Examen Visual Gratuito</h3>
          <p class="text-xs text-slate-400">Revisión personalizada con optómetra certificado en Óptica Johanna.</p>

          <div class="space-y-3">
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Tu nombre completo</label>
              <input v-model="form.nombre" @focus="tracker.trackField('nombre', 'focus')" @input="tracker.trackField('nombre', 'fill')"
                type="text" placeholder="Ej. Ana Pérez"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Teléfono celular (Ecuador)</label>
              <input v-model="form.telefono" @focus="tracker.trackField('telefono', 'focus')" @input="tracker.trackField('telefono', 'fill')"
                type="tel" placeholder="09XXXXXXXX"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
              <p v-if="phoneError" class="text-xs text-rose-400 mt-1">{{ phoneError }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Fecha preferida</label>
                <input v-model="form.fecha_cita" type="date" :min="todayStr"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-400 transition"
                />
              </div>
              <div>
                <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Hora preferida</label>
                <select v-model="form.hora_cita" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-400 transition">
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
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 cursor-pointer'"
          >
            {{ tracker.isSubmitting.value ? 'Guardando cita...' : '📅 Confirmar Mi Cita Sin Costo' }}
          </button>
          <p class="text-[10px] text-slate-500 text-center">🔒 Tu información está protegida y se usa exclusivamente para tu cita</p>
        </div>
      </div>

      <!-- =================== CONFIRMACIÓN =================== -->
      <div v-else-if="step === 5" class="text-center space-y-6">
        <div class="text-7xl animate-bounce">🎉</div>
        <h2 class="text-2xl font-extrabold text-white">¡Cita Registrada con Éxito!</h2>
        <p class="text-sm text-slate-400">Un asesor se comunicará contigo para confirmar tu turno en Óptica Johanna.</p>
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2 text-sm text-slate-300">
          <p>📋 <strong class="text-white">Paciente:</strong> {{ form.nombre }}</p>
          <p>📱 <strong class="text-white">Teléfono:</strong> {{ form.telefono }}</p>
          <p v-if="form.fecha_cita">📅 <strong class="text-white">Horario:</strong> {{ form.fecha_cita }} {{ form.hora_cita }}</p>
          <p>📍 <strong class="text-white">Sucursal:</strong> Óptica Johanna Matriz · Guayaquil</p>
        </div>
        <a href="/analytics/visitors" class="inline-block mt-4 px-6 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-sm hover:bg-emerald-500/25 transition">
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

// Inicializar tracker de Pulso para Quiz 1
const tracker = usePulsoTracker({
  clientSlug: 'optica',
  quizKey: 'quiz1',
  quizName: 'Quiz 1 · Chequeo Visual Integral',
})

const step = ref(0)
const answers = reactive({
  sintomas: '',
  vision_cerca: '',
  vision_lejos: '',
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
const horarios = ['08:30', '09:30', '10:30', '11:30', '14:30', '15:30', '16:30', '17:30']

// ===========================================================================
// OPCIONES CLÍNICAS QUIZ 1
// ===========================================================================
const q1Options = [
  { value: 'fatiga_ardor',  emoji: '🔥', label: 'Fatiga, pesadez o ardor al final del día', note: 'Esfuerzo visual acumulado' },
  { value: 'vision_borrosa',emoji: '😵', label: 'Visión borrosa o dificultad para enfocar',  note: 'Posible defecto refractivo' },
  { value: 'dolor_cabeza',  emoji: '🤕', label: 'Dolor de cabeza frontal o en sienes',     note: 'Común en sobreesfuerzo visual' },
  { value: 'ninguno',       emoji: '✨', label: 'No tengo molestias, quiero revisión preventiva', note: 'Chequeo anual de rutina' },
]

const q2Options = [
  { value: 'dificultad_cerca', emoji: '📱', label: 'Debo alejar la pantalla o libro para ver nítido', note: 'Signos frecuentes de presbicia' },
  { value: 'cansancio_cerca',   emoji: '⏳', label: 'Puedo leer pero me canso a los pocos minutos', note: 'Fatiga acomodativa' },
  { value: 'buena_cerca',       emoji: '✅', label: 'Veo con perfecta nitidez de cerca sin cansarme', note: 'Enfoque cercano saludable' },
]

const q3Options = [
  { value: 'borroso_lejos',    emoji: '🚗', label: 'Me cuesta leer letreros o placas de lejos', note: 'Sospecha de miopía / astigmatismo' },
  { value: 'deslumbramiento',  emoji: '💡', label: 'Las luces de noche me deslumbran mucho', note: 'Astigmatismo o aberraciones ópticas' },
  { value: 'buena_lejos',      emoji: '🎯', label: 'Veo nítido de lejos tanto de día como de noche', note: 'Visión lejana conservada' },
]

// ===========================================================================
// DIAGNÓSTICO
// ===========================================================================
const diagnosisEmoji = computed(() => {
  if (answers.vision_cerca === 'dificultad_cerca' || answers.vision_lejos === 'borroso_lejos') return '🔍'
  if (answers.sintomas === 'fatiga_ardor' || answers.sintomas === 'dolor_cabeza') return '⚠️'
  return '🟢'
})

const diagnosisTitle = computed(() => {
  if (answers.vision_cerca === 'dificultad_cerca') return 'Indicadores de Presbicia o Esfuerzo Acomodativo'
  if (answers.vision_lejos === 'borroso_lejos' || answers.vision_lejos === 'deslumbramiento') return 'Posible Defecto Refractivo (Miopía / Astigmatismo)'
  if (answers.sintomas === 'fatiga_ardor') return 'Fatiga Ocular & Tensión Visual'
  return 'Perfil Visual Preventivo Estable'
})

const diagnosisText = computed(() => {
  if (answers.vision_cerca === 'dificultad_cerca') {
    return 'Presentas síntomas característicos de presbicia o insuficiencia acomodativa. Un examen computarizado determinará la fórmula exacta para lectura o lentes progresivos.'
  }
  if (answers.vision_lejos === 'borroso_lejos') {
    return 'La dificultad para divisar de lejos y el deslumbramiento sugieren la presencia de astigmatismo o miopía. Lentes con antirreflejo mejorarán notablemente tu confort al conducir y ver a distancia.'
  }
  return 'Tus respuestas indican un perfil visual con necesidad de chequeo preventivo para optimizar tu descanso ocular y descartar tensión no percibida.'
})

const recommendations = computed(() => [
  'Refracción computarizada completa y fondo de ojo en consultorio',
  'Prueba de lentes antirreflejo y filtro especializado para tu jornada',
  'Asesoría en monturas acordes a tu graduación y morfología facial',
])

// ===========================================================================
// NAVEGACIÓN Y TELEMETRÍA
// ===========================================================================
async function startQuiz() {
  step.value = 1
  await tracker.trackQuizStart()
}

async function selectStep1(value: string, event: MouseEvent) {
  answers.sintomas = value
  await tracker.trackStep(1, { sintomas: value }, event)
  setTimeout(() => { step.value = 2 }, 350)
}

async function selectStep2(value: string, event: MouseEvent) {
  answers.vision_cerca = value
  await tracker.trackStep(2, { vision_cerca: value }, event)
  setTimeout(() => { step.value = 3 }, 350)
}

async function selectStep3(value: string, event: MouseEvent) {
  answers.vision_lejos = value
  await tracker.trackStep(3, { vision_lejos: value }, event)

  const diag = diagnosisTitle.value
  await tracker.trackCompleted({
    score: answers.vision_cerca === 'dificultad_cerca' || answers.vision_lejos === 'borroso_lejos' ? 75 : 45,
    diagnosis: diag,
    answers: { ...answers },
  })

  setTimeout(() => { step.value = 4 }, 350)
}

async function submitForm() {
  phoneError.value = ''
  submitError.value = ''

  const validation = normalizeEcuadorianPhone(form.telefono)
  if (!validation.isValid) {
    phoneError.value = validation.error || 'Número de celular no válido'
    return
  }

  const success = await tracker.submitBooking({
    nombre: form.nombre,
    telefono: form.telefono,
    fecha_cita: form.fecha_cita || null,
    hora_cita: form.hora_cita || null,
    sucursal: 'Matriz Guayaquil',
    metadata: { ...answers, diagnostico: diagnosisTitle.value },
  })

  if (success) {
    step.value = 5
  } else {
    submitError.value = tracker.errorMsg.value || 'Error al agendar. Intenta nuevamente.'
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
