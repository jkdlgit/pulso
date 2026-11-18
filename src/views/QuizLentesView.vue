<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 relative">
    <main class="w-full max-w-lg">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 border border-slate-150 overflow-hidden">
        
        <!-- Header con identidad médica y ciudad -->
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-emerald-600/20">
              👓
            </div>
            <div>
              <span class="font-extrabold text-slate-900 text-sm tracking-tight block">Óptica Johanna</span>
              <span class="text-[11px] text-slate-500 block">Matriz Guayaquil · 16 años de experiencia</span>
            </div>
          </div>
          <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {{ step <= 3 ? `Pregunta ${step} de 3` : 'Resultado' }}
          </span>
        </div>

        <!-- Barra de Progreso Superior -->
        <div v-if="step <= 3" class="w-full h-2 bg-slate-150 rounded-full mb-6 overflow-hidden">
          <div
            class="h-full bg-emerald-500 rounded-full transition-all duration-300"
            :style="{ width: `${(step / 3) * 100}%` }"
          ></div>
        </div>

        <!-- ============================================================ -->
        <!-- PREGUNTA 1: ¿Qué te molesta más? -->
        <!-- ============================================================ -->
        <div v-if="step === 1" class="space-y-4">
          <h2 class="text-2xl sm:text-[26px] font-black text-slate-900 leading-tight">
            1. ¿Qué te molesta más al mirar?
          </h2>
          <p class="text-base text-slate-600 leading-relaxed">
            Selecciona la situación en la que sientes mayor dificultad o cansancio:
          </p>

          <div class="space-y-3 pt-2">
            <button
              v-for="opt in molestiaOptions"
              :key="opt.id"
              @click="handleSelectMolestia(opt.id, opt.label)"
              class="w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-3.5 bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800"
            >
              <span class="text-3xl flex-shrink-0">{{ opt.icon }}</span>
              <span class="text-lg font-bold flex-1 leading-snug">{{ opt.label }}</span>
              <span class="text-emerald-600 font-bold text-xl">→</span>
            </button>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- PREGUNTA 2: ¿Hace cuánto no te examinas la vista? -->
        <!-- ============================================================ -->
        <div v-else-if="step === 2" class="space-y-4">
          <h2 class="text-2xl sm:text-[26px] font-black text-slate-900 leading-tight">
            2. ¿Hace cuánto no te examinas la vista?
          </h2>
          <p class="text-base text-slate-600 leading-relaxed">
            Un examen anual ayuda a prevenir el desgaste ocular y dolores de cabeza:
          </p>

          <div class="space-y-3 pt-2">
            <button
              v-for="opt in tiempoOptions"
              :key="opt.id"
              @click="handleSelectTiempo(opt.id, opt.label)"
              class="w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-3.5 bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800"
            >
              <span class="text-3xl flex-shrink-0">{{ opt.icon }}</span>
              <span class="text-lg font-bold flex-1 leading-snug">{{ opt.label }}</span>
              <span class="text-emerald-600 font-bold text-xl">→</span>
            </button>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- PREGUNTA 3: ¿Para qué necesitas más ver bien? -->
        <!-- ============================================================ -->
        <div v-else-if="step === 3" class="space-y-4">
          <h2 class="text-2xl sm:text-[26px] font-black text-slate-900 leading-tight">
            3. ¿Para qué necesitas más ver con claridad?
          </h2>
          <p class="text-base text-slate-600 leading-relaxed">
            Así sabremos qué tipo de filtro y aumento es el más adecuado para ti:
          </p>

          <div class="space-y-3 pt-2">
            <button
              v-for="opt in necesidadOptions"
              :key="opt.id"
              @click="handleSelectNecesidad(opt.id, opt.label)"
              class="w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-3.5 bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800"
            >
              <span class="text-3xl flex-shrink-0">{{ opt.icon }}</span>
              <span class="text-lg font-bold flex-1 leading-snug">{{ opt.label }}</span>
              <span class="text-emerald-600 font-bold text-xl">→</span>
            </button>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- RESULTADO PARCIAL & OFERTA PRINCIPAL -->
        <!-- ============================================================ -->
        <div v-else-if="step === 4" class="space-y-5 text-center">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl">
            👓
          </div>

          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Hemos analizado tus respuestas.
          </h2>

          <!-- Resultado parcial que despierta interés -->
          <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left shadow-sm">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">⚠️</span>
              <span class="font-bold text-amber-950 text-sm uppercase tracking-wide">Diagnóstico preliminar:</span>
            </div>
            <p class="text-slate-800 text-base leading-relaxed">
              Tus respuestas muestran señales de vista cansada. Te recomendamos lentes con filtro antifatiga y antirreflejo. Un examen visual gratis puede confirmarlo.
            </p>
          </div>

          <!-- Oferta Principal + Beneficio Extra -->
          <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-left space-y-2">
            <div class="flex items-start gap-2.5">
              <span class="text-2xl flex-shrink-0">🎁</span>
              <div>
                <p class="font-black text-emerald-950 text-base">Tu beneficio en Guayaquil:</p>
                <p class="text-emerald-950 text-sm mt-0.5">
                  ✓ <strong>Evaluación visual gratis:</strong> Con optómetra certificado y equipo computarizado.
                </p>
                <p class="text-emerald-950 text-sm mt-0.5">
                  ✓ <strong>Beneficio extra:</strong> Descuento especial en tus lentes si decides continuar.
                </p>
              </div>
            </div>
          </div>

          <!-- Selector táctil de 2 horarios de 1 toque -->
          <div class="text-left space-y-2">
            <p class="text-sm font-bold text-slate-700 uppercase tracking-wider">Elige tu horario de preferencia:</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="selectedTurno = 'manana'"
                :class="selectedTurno === 'manana'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-bold shadow-md'
                  : 'bg-white border-slate-200 text-slate-600'"
                class="p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[76px]"
              >
                <span class="text-2xl leading-none">🌅</span>
                <span class="text-sm font-bold">Mañana</span>
                <span class="text-xs text-slate-500">10:30 a 12:30</span>
              </button>
              <button
                type="button"
                @click="selectedTurno = 'tarde'"
                :class="selectedTurno === 'tarde'
                  ? 'bg-violet-50 border-violet-500 text-violet-950 ring-2 ring-violet-400 font-bold shadow-md'
                  : 'bg-white border-slate-200 text-slate-600'"
                class="p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[76px]"
              >
                <span class="text-2xl leading-none">🌙</span>
                <span class="text-sm font-bold">Tarde</span>
                <span class="text-xs text-slate-500">15:30 a 18:00</span>
              </button>
            </div>
          </div>

          <!-- Botón final masivo para WhatsApp -->
          <button
            @click="handleWhatsAppBooking"
            class="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] active:scale-[0.98] text-white min-h-[56px] rounded-2xl text-lg font-black shadow-xl shadow-[#25D366]/40 transition-all cursor-pointer border-none"
          >
            <span class="text-2xl">💬</span> Agendar mi evaluación gratis por WhatsApp
          </button>

          <!-- Textos de confianza requeridos -->
          <p class="text-sm font-bold text-slate-700">
            Sin compromiso. Te respondemos en minutos.
          </p>
          <p class="text-xs text-slate-500">
            🔒 No te llamaremos por teléfono; coordinas tu cupo 100% por chat.
          </p>
        </div>

      </div>

      <p class="text-center text-xs text-slate-400 mt-6 font-medium">
        &copy; {{ new Date().getFullYear() }} Óptica Johanna &mdash; Guayaquil, Ecuador
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { supabase, hasSupabaseConfig } from '@/supabase'
import { usePulsoTracker } from '@/composables/usePulsoTracker'

const tracker = usePulsoTracker({
  clientSlug: 'opticajohanna',
  quizKey: 'quiz4',
  quizName: 'Quiz 4 · Lentes y Vista Cansada',
})

const step = ref(1)
const selectedTurno = ref<'manana' | 'tarde'>('manana')
const leadId = ref<number | null>(null)

const answers = reactive({
  molestia: '',
  tiempo: '',
  necesidad: '',
})

const molestiaOptions = [
  { id: 'celular', label: 'Leer el celular o letras pequeñas', icon: '📱' },
  { id: 'noche', label: 'Manejar de noche o luces de frente', icon: '🚗' },
  { id: 'television', label: 'Ver la televisión o enfocar de lejos', icon: '📺' },
]

const tiempoOptions = [
  { id: 'menos_1', label: 'Menos de 1 año', icon: '🗓️' },
  { id: 'mas_1', label: 'Más de 1 año', icon: '⏳' },
  { id: 'no_recuerdo', label: 'No recuerdo o nunca me he examinado', icon: '❓' },
]

const necesidadOptions = [
  { id: 'leer', label: 'Leer y ver el celular sin cansancio', icon: '📖' },
  { id: 'trabajar', label: 'Trabajar y actividades del día', icon: '💼' },
  { id: 'manejar', label: 'Manejar y salir a la calle con seguridad', icon: '🚘' },
]

onMounted(async () => {
  ;(window as any).pulso?.step?.(1, { action: 'inicio_quiz4' })
  tracker.trackStep(1, { action: 'inicio_quiz4' })

  if (hasSupabaseConfig) {
    try {
      const res = await supabase.from('leads').insert({
        nombre: 'Visitante Quiz 4',
        telefono: '',
        edad: 50,
        estado: 'Paso 1',
        origen: 'quiz4',
        resultado: 'Inició test de lentes y vista cansada',
        respuestas: { etapa: 'paso_1', quiz: 'quiz4', client_id: 'opticajohanna' },
      }).select('id').single()
      if (res.data) leadId.value = res.data.id
    } catch (e) {}
  }
})

function handleSelectMolestia(id: string, label: string) {
  answers.molestia = label
  step.value = 2
  ;(window as any).pulso?.step?.(2, { molestia: id })
  tracker.trackStep(2, { molestia: label })
}

function handleSelectTiempo(id: string, label: string) {
  answers.tiempo = label
  step.value = 3
  ;(window as any).pulso?.step?.(3, { tiempo: id })
  tracker.trackStep(3, { tiempo: label })
}

function handleSelectNecesidad(id: string, label: string) {
  answers.necesidad = label
  step.value = 4
  ;(window as any).pulso?.completed?.({
    molestia: answers.molestia,
    tiempo: answers.tiempo,
    necesidad: answers.necesidad,
  })
  tracker.trackCompleted({
    score: 85,
    diagnosis: 'Vista cansada detectada. Se recomienda filtro antifatiga y examen gratuito.',
    answers: { ...answers },
  })

  if (hasSupabaseConfig && leadId.value) {
    supabase.from('leads').update({
      estado: 'Viendo Resultados',
      resultado: 'Vista cansada. Recomendado filtro antifatiga.',
      respuestas: { ...answers, etapa: 'completado', quiz: 'quiz4' },
    }).eq('id', leadId.value).then(() => {})
  }
}

async function handleWhatsAppBooking() {
  const turnoTexto = selectedTurno.value === 'manana' ? 'en la mañana (10:30 a 12:30)' : 'en la tarde (15:30 a 18:00)'

  ;(window as any).pulso?.booking?.({
    action: 'agendar_evaluacion_quiz4',
    turno: selectedTurno.value,
  })

  await tracker.submitBooking({
    nombre: '',
    telefono: '',
    edad: 50,
    metadata: {
      quiz: 'quiz4',
      turno: selectedTurno.value,
      respuestas: { ...answers },
    },
  })

  if (hasSupabaseConfig && leadId.value) {
    supabase.from('leads').update({
      estado: 'Agendado',
      estado_cita: 'Nueva',
      respuestas: { ...answers, turno: selectedTurno.value, etapa: 'agendado_whatsapp' },
    }).eq('id', leadId.value).then(() => {})
  }

  const msg = `Hola, completé el test de vista cansada en la web de Óptica Johanna. Mis respuestas muestran vista cansada y deseo apartar mi evaluación visual gratis en Guayaquil ${turnoTexto}.`
  window.open(`https://wa.me/593980753069?text=${encodeURIComponent(msg)}`, '_blank')
}
</script>
