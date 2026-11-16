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
      <div v-if="step > 0 && step <= 2" class="h-1 bg-slate-800">
        <div class="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-400 transition-all duration-500" :style="{ width: `${(step / 2) * 100}%` }"></div>
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
          Mantén tu pantalla a 40 cm de tus ojos y lee las letras que aparecen. Dos rondas rápidas para conocer tu agudeza estimada.
        </p>
        <div class="grid grid-cols-3 gap-2.5 text-left pt-2">
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">📏</span>
            <p class="text-xs font-bold text-slate-200">A 40 cm</p>
            <p class="text-[10px] text-slate-500">Distancia estándar</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xl block mb-1">🎯</span>
            <p class="text-xs font-bold text-slate-200">Letras Snellen</p>
            <p class="text-[10px] text-slate-500">Escala optométrica</p>
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

      <!-- =================== PASO 1: RONDA 1 — letras reducidas (16px) =================== -->
      <div v-else-if="step === 1" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-violet-400 font-semibold uppercase">// RONDA 1 DE 2 · ESCALA BASE REDUCIDA</span>
          <h2 class="text-xl font-bold text-white mt-1">¿Puedes leer con claridad estas letras?</h2>
          <p class="text-xs text-slate-400 mt-1">Mantén tu celular o pantalla a 40 cm de distancia. No te acerques.</p>
        </div>

        <!-- Letras Ronda 1 (Tamaño reducido considerablemente: 16px) -->
        <div class="p-8 rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center shadow-inner min-h-[140px]">
          <span class="select-none tracking-[0.4em] font-bold text-white transition-all" style="font-size: 16px; font-family: 'Courier New', monospace;">
            {{ currentLetters.join('  ') }}
          </span>
          <span class="text-[10px] font-mono text-slate-500 mt-4 tracking-wider uppercase">Cartilla Digital · Escala 20/40 (Distancia 40 cm)</span>
        </div>

        <p class="text-center text-xs text-slate-500">Evalúa si las distingues con nitidez inmediata sin entrecerrar los ojos.</p>

        <div class="grid grid-cols-2 gap-3">
          <button
            @click="handleGreen(1, $event)"
            class="p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-white text-center hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <span class="text-2xl block mb-1">🟢</span>
            <span class="font-bold text-sm block">Las veo bien</span>
            <span class="text-[11px] text-slate-400">Distingo todas con claridad</span>
          </button>
          <button
            @click="handleRed(1, $event)"
            class="p-4 rounded-xl border border-rose-500/50 bg-rose-500/10 text-white text-center hover:bg-rose-500/20 transition cursor-pointer"
          >
            <span class="text-2xl block mb-1">🔴</span>
            <span class="font-bold text-sm block">No las veo bien</span>
            <span class="text-[11px] text-slate-400">Se ven borrosas o difusas</span>
          </button>
        </div>
      </div>

      <!-- =================== PASO 2: RONDA 2 — letras mínimas (9.5px) =================== -->
      <div v-else-if="step === 2" class="space-y-6">
        <div>
          <span class="text-xs font-mono text-violet-400 font-semibold uppercase">// RONDA 2 DE 2 · ESCALA FINA MÍNIMA</span>
          <h2 class="text-xl font-bold text-white mt-1">¿Y esta escala aún más pequeña?</h2>
          <p class="text-xs text-slate-400 mt-1">Escala de alta exigencia óptica a 40 cm. Mantén la misma distancia.</p>
        </div>

        <!-- Letras Ronda 2 (Tamaño mínimo: 9.5px, casi no se ve para mayores de 50 años) -->
        <div class="p-8 rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center shadow-inner min-h-[140px]">
          <span class="select-none tracking-[0.45em] font-bold text-white transition-all" style="font-size: 9.5px; font-family: 'Courier New', monospace;">
            {{ currentLetters.join('  ') }}
          </span>
          <span class="text-[10px] font-mono text-slate-500 mt-4 tracking-wider uppercase">Cartilla Digital · Escala 20/20 Fina (Distancia 40 cm)</span>
        </div>

        <p class="text-center text-xs text-slate-500">¿Logras leer todas las letras o se difuminan los bordes?</p>

        <div class="grid grid-cols-2 gap-3">
          <button
            @click="handleGreen(2, $event)"
            class="p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-white text-center hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <span class="text-2xl block mb-1">🟢</span>
            <span class="font-bold text-sm block">Las veo bien</span>
            <span class="text-[11px] text-slate-400">Distingo todas con claridad</span>
          </button>
          <button
            @click="handleRed(2, $event)"
            class="p-4 rounded-xl border border-rose-500/50 bg-rose-500/10 text-white text-center hover:bg-rose-500/20 transition cursor-pointer"
          >
            <span class="text-2xl block mb-1">🔴</span>
            <span class="font-bold text-sm block">No las veo bien</span>
            <span class="text-[11px] text-slate-400">Se ven borrosas o no distingo</span>
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

        <!-- FORMULARIO DE AGENDAMIENTO CRO -->
        <div class="hud-card space-y-4">
          <!-- A) Titular persuasivo -->
          <h3 class="font-extrabold text-white text-base leading-snug">
            Tu resultado califica para un Examen Computarizado de Agudeza con Optómetra — Sin Costo — en Óptica Johanna Guayaquil.
          </h3>

          <!-- B) Reversión de riesgo -->
          <div class="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-xs text-slate-400">
            <span class="text-emerald-400 mt-0.5 flex-shrink-0">🔒</span>
            <span>Sin compromiso de compra. No te llamaremos por teléfono; coordinas tu cupo <strong class="text-slate-200">100% por WhatsApp</strong>, sin costo y sin formularios adicionales.</span>
          </div>

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

            <!-- C) Micro-selector de turnos -->
            <div>
              <label class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Elige tu turno</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="selectTurno('manana', '10:30')"
                  :class="form.turno === 'manana'
                    ? 'bg-emerald-600/30 border-emerald-500 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-emerald-500/50'"
                  class="p-4 rounded-xl border text-center transition-all cursor-pointer"
                >
                  <span class="text-xl block mb-1">🌅</span>
                  <span class="font-bold text-sm block">Turno Mañana</span>
                  <span class="text-[11px] text-slate-400">10:30 a 12:30</span>
                </button>
                <button
                  @click="selectTurno('tarde', '15:30')"
                  :class="form.turno === 'tarde'
                    ? 'bg-violet-600/30 border-violet-500 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-violet-500/50'"
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
              : 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 cursor-pointer'"
          >
            {{ tracker.isSubmitting.value ? 'Guardando turno...' : form.turno ? `📱 Apartar turno ${form.turno === 'manana' ? 'de mañana' : 'de tarde'} por WhatsApp` : '📅 Selecciona un turno para continuar' }}
          </button>
          <p class="text-[10px] text-slate-500 text-center">🔒 Tu información médica se guarda bajo estricta confidencialidad</p>
        </div>
      </div>

      <!-- =================== CONFIRMACIÓN =================== -->
      <div v-else-if="step === 5" class="text-center space-y-6">
        <div class="text-7xl animate-bounce">🎉</div>
        <h2 class="text-2xl font-extrabold text-white">¡Examen Confirmado!</h2>
        <p class="text-sm text-slate-400">Te enviamos la confirmación por WhatsApp. Te esperamos en Óptica Johanna para tu evaluación completa.</p>
        <div class="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-left space-y-2 text-sm text-slate-300">
          <p>📋 <strong class="text-white">Nombre:</strong> {{ form.nombre }}</p>
          <p>📱 <strong class="text-white">Celular:</strong> {{ form.telefono }}</p>
          <p>🎯 <strong class="text-white">Agudeza estimada:</strong> {{ acuityScore }}</p>
          <p v-if="form.turno">📅 <strong class="text-white">Turno:</strong> {{ form.turno === 'manana' ? 'Mañana (10:30 – 12:30)' : 'Tarde (15:30 – 18:00)' }}</p>
          <p>📍 <strong class="text-white">Lugar:</strong> Óptica Johanna Matriz · Guayaquil</p>
        </div>
        <a href="/analytics/visitors" class="inline-block mt-4 px-6 py-3 rounded-xl bg-violet-500/15 border border-violet-500/40 text-violet-300 font-mono text-sm hover:bg-violet-500/25 transition">
          📊 Ver en Pulso Analytics →
        </a>
        <p class="text-[10px] text-slate-600 font-mono">Session: {{ tracker.sessionId.value }} · Visitor: {{ tracker.visitorId.value }}</p>
      </div>

    </main>
  </div>

  <!-- RED OFFER MODAL — aparece al presionar botón rojo -->
  <Teleport to="body">
    <div v-if="showRedOfferModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="max-w-sm w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-2xl shadow-rose-500/10">
        <div class="text-center">
          <span class="text-4xl block mb-2">👁️</span>
          <h3 class="text-lg font-extrabold text-white leading-tight">Tu visión podría estar afectando tu calidad de vida</h3>
          <p class="text-sm text-slate-300 mt-3 leading-relaxed">
            Detectamos una dificultad para distinguir esta escala. <strong class="text-white">Una corrección óptica adecuada</strong> puede devolverte el 100% de nitidez.
          </p>
          <div class="mt-4 p-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-left space-y-1.5 text-xs text-slate-300">
            <p>🎯 <strong class="text-white">Examen Computarizado Sin Costo</strong> en Óptica Johanna</p>
            <p>💬 <strong class="text-white">Coordinas 100% por WhatsApp</strong> — sin llamadas</p>
            <p>⏱️ <strong class="text-white">Dura menos de 20 minutos</strong> y es completamente gratis</p>
            <p>📍 <strong class="text-white">Matriz Guayaquil</strong> — elige tu horario ahora</p>
          </div>
        </div>
        <div class="text-center text-xs text-slate-500 italic mt-2">
          Planifica tu visita — no te va a costar nada y puedes ir cuando quieras
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button @click="bookFromRedOffer('manana')" class="p-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-white text-xs font-bold text-center hover:bg-emerald-500/20 transition cursor-pointer">
            🌅 Turno<br>Mañana<br><span class="text-slate-400 font-normal">10:30 – 12:30</span>
          </button>
          <button @click="bookFromRedOffer('tarde')" class="p-3 rounded-xl border border-violet-500/50 bg-violet-500/10 text-white text-xs font-bold text-center hover:bg-violet-500/20 transition cursor-pointer">
            🌙 Turno<br>Tarde<br><span class="text-slate-400 font-normal">15:30 – 18:00</span>
          </button>
        </div>
        <button @click="continueTest" class="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer">
          Continuar el test de todas formas
        </button>
      </div>
    </div>
  </Teleport>

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

// Inicializar tracker de Pulso para Quiz 2
const tracker = usePulsoTracker({
  clientSlug: 'optica',
  quizKey: 'quiz2',
  quizName: 'Quiz 2 · VisiónCheck Agudeza Visual',
})

const step = ref(0)
const answers = reactive({
  ronda1: '',
  ronda2: '',
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

// ===========================================================================
// SETS DE LETRAS
// ===========================================================================
const letterSets = [
  ['E', 'F', 'P', 'T', 'O', 'Z'], // ronda 1 — letras más reconocibles
  ['C', 'D', 'L', 'N', 'V', 'R'], // ronda 2 — letras más difíciles
]

function pickRandomLetters(setIndex: number): string[] {
  const pool = [...letterSets[setIndex]]
  const result: string[] = []
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

const currentLetters = ref<string[]>(pickRandomLetters(0))
const currentRound = ref(1)

// ===========================================================================
// MODALES
// ===========================================================================
const showRedOfferModal = ref(false)
const redResult = ref('')

// ===========================================================================
// DIAGNÓSTICO DE AGUDEZA
// ===========================================================================
const acuityScore = computed(() => {
  if (answers.ronda1 === 'no_vio') return '20/60 — Dificultad Visual Alta'
  if (answers.ronda2 === 'no_vio') return '20/40 — Dificultad Visual Moderada'
  return '20/20 — Agudeza Excelente'
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
    return 'Tu capacidad de discriminación en letras de escala estándar es adecuada. Un chequeo presencial confirmará si existe fatiga o esfuerzo muscular no manifiesto.'
  }
  if (acuityScore.value.includes('20/40')) {
    return 'Detectamos cierta dificultad en letras de escala fina. Es común cuando existe un leve astigmatismo o pérdida de acomodación. Una pequeña corrección óptica te devolverá el 100% de nitidez.'
  }
  return 'Se identificó dificultad para distinguir las letras base a distancia de lectura. Se aconseja una refracción clínica prioritaria para prevenir mayor esfuerzo ocular.'
})

const recommendations = computed(() => [
  'Examen con cartilla optométrica Snellen y foróptero en Óptica Johanna',
  'Medición de agudeza visual binocular y monocular',
  'Prescripción de lunas antirreflejo y filtro UV de alta definición',
])

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
  const msg = `Hola, acabo de hacer el test visual de Óptica Johanna. Mi resultado: ${diagnosisTitle.value}. Me gustaría recibir mi reporte y conocer opciones sin compromiso.`
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
// NAVEGACIÓN — RONDA VERDE (el usuario VE bien)
// ===========================================================================
async function handleGreen(roundNum: number, event: MouseEvent) {
  if (roundNum === 1) {
    answers.ronda1 = 'vio'
    await tracker.trackStep(1, { resultado: 'vio', ronda: 1 }, event)
    // Pasar a ronda 2 con letras nuevas
    currentRound.value = 2
    currentLetters.value = pickRandomLetters(1)
    setTimeout(() => { step.value = 2 }, 350)
  } else {
    answers.ronda2 = 'vio'
    await tracker.trackStep(2, { resultado: 'vio', ronda: 2 }, event)
    await tracker.trackCompleted({
      score: 95,
      diagnosis: diagnosisTitle.value,
      answers: { ...answers, agudeza: acuityScore.value },
    })
    setTimeout(() => { step.value = 4 }, 350)
  }
}

// ===========================================================================
// NAVEGACIÓN — RONDA ROJA (el usuario NO ve bien)
// ===========================================================================
async function handleRed(roundNum: number, event: MouseEvent) {
  redResult.value = roundNum === 1 ? '20/60 — Dificultad Visual Alta' : '20/40 — Dificultad Visual Moderada'
  if (roundNum === 1) {
    answers.ronda1 = 'no_vio'
  } else {
    answers.ronda2 = 'no_vio'
  }
  showRedOfferModal.value = true
  await tracker.trackStep(roundNum, { resultado: 'no_vio', ronda: roundNum }, event)
}

function bookFromRedOffer(turno: string) {
  form.turno = turno
  form.hora_cita = turno === 'manana' ? '10:30' : '15:30'
  showRedOfferModal.value = false
  // Ir directamente al resultado con diagnóstico negativo
  tracker.trackCompleted({
    score: currentRound.value === 1 ? 30 : 60,
    diagnosis: diagnosisTitle.value,
    answers: { ...answers, agudeza: acuityScore.value },
  })
  step.value = 4
}

function continueTest() {
  showRedOfferModal.value = false
  if (currentRound.value === 1) {
    // Si estaba en ronda 1, permitirle intentar la ronda 2
    currentRound.value = 2
    currentLetters.value = pickRandomLetters(1)
    step.value = 2
  } else {
    // Si ya falló en ronda 2, ir al resultado
    tracker.trackCompleted({
      score: answers.ronda1 === 'no_vio' ? 30 : 60,
      diagnosis: diagnosisTitle.value,
      answers: { ...answers, agudeza: acuityScore.value },
    })
    step.value = 4
  }
}

// ===========================================================================
// START
// ===========================================================================
async function startQuiz() {
  currentLetters.value = pickRandomLetters(0)
  currentRound.value = 1
  step.value = 1
  await tracker.trackQuizStart()
}

function selectTurno(turno: string, hora: string) {
  form.turno = turno
  form.hora_cita = hora
}

// ===========================================================================
// SUBMIT
// ===========================================================================
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
    sucursal: 'Matriz Guayaquil',
    metadata: { ...answers, agudeza_estimada: acuityScore.value, diagnostico: diagnosisTitle.value, turno: form.turno },
  })

  if (success) {
    const msg = `¡Hola! Terminé el test de agudeza visual (Score: ${acuityScore.value}). Aparté el turno ${form.turno === 'manana' ? 'de la mañana (10:30)' : 'de la tarde (15:30)'} para mi examen computarizado gratuito en Óptica Johanna Guayaquil. ¿Me confirmas la dirección?`
    openWhatsApp(msg)
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
