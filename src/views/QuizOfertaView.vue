<template>
  <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
    <main class="w-full max-w-lg space-y-4">
      
      <!-- ============================================================ -->
      <!-- TOP BAR: AUTORIDAD & UBICACIÓN -->
      <!-- ============================================================ -->
      <div class="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
            👓
          </div>
          <div>
            <h3 class="font-black text-slate-900 text-sm tracking-tight leading-none">ÓPTICA JOHANNA</h3>
            <span class="text-[11px] text-slate-500 font-medium">Matriz {{ configVenta.ciudad }} · {{ configVenta.aniosExperiencia }} años de experiencia</span>
          </div>
        </div>
        <a
          :href="whatsappUrlCita"
          target="_blank"
          @click="handleBookingClick('top_bar')"
          class="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
        >
          <span>💬</span> Chat
        </a>
      </div>

      <!-- ============================================================ -->
      <!-- BANNER DE URGENCIA & CUENTA REGRESIVA (3 DÍAS) -->
      <!-- ============================================================ -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-3.5 shadow-md border border-slate-700 text-center">
        <div class="flex items-center justify-center gap-2 text-xs font-bold text-amber-300 mb-2">
          <span>⏳</span>
          <span class="uppercase tracking-wider">Cortesía especial por tiempo limitado</span>
        </div>

        <!-- Reloj Contador Digital -->
        <div class="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          <div class="bg-slate-950/80 rounded-xl p-2 border border-slate-700">
            <span class="text-xl font-black text-white font-mono block leading-none">{{ countdown.days }}</span>
            <span class="text-[10px] text-slate-400 uppercase font-mono">Días</span>
          </div>
          <div class="bg-slate-950/80 rounded-xl p-2 border border-slate-700">
            <span class="text-xl font-black text-white font-mono block leading-none">{{ countdown.hours }}</span>
            <span class="text-[10px] text-slate-400 uppercase font-mono">Horas</span>
          </div>
          <div class="bg-slate-950/80 rounded-xl p-2 border border-slate-700">
            <span class="text-xl font-black text-white font-mono block leading-none">{{ countdown.minutes }}</span>
            <span class="text-[10px] text-slate-400 uppercase font-mono">Min</span>
          </div>
          <div class="bg-slate-950/80 rounded-xl p-2 border border-slate-700">
            <span class="text-xl font-black text-amber-400 font-mono block leading-none">{{ countdown.seconds }}</span>
            <span class="text-[10px] text-slate-400 uppercase font-mono">Seg</span>
          </div>
        </div>

        <div class="mt-2.5 text-xs text-amber-200 font-medium flex items-center justify-center gap-1">
          <span>⚠️</span>
          <span>Agenda limitada: Solo 4 cupos gratuitos para hoy en {{ configVenta.ciudad }}.</span>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- CARD PRINCIPAL: PREGUNTA SÍ MENTAL & BENEFICIO -->
      <!-- ============================================================ -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center space-y-4">
        
        <!-- Título con pregunta que se contesta 'SÍ' mentalmente -->
        <h1 class="text-2xl sm:text-[28px] font-black text-slate-900 leading-tight">
          ¿Sientes que últimamente tienes que alejar las cosas para poder leerlas bien?
        </h1>

        <!-- Subtítulo con el beneficio -->
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
          Recupera la nitidez de tu vista sin pagar nada por tu examen. Separa tu Evaluación Visual Computarizada con Optómetra en {{ configVenta.ciudad }}.
        </p>

        <!-- SECCIÓN DE RECIPROCIDAD & COMPARACIÓN DE PRECIO -->
        <div class="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-left space-y-3">
          <p class="text-xs font-black uppercase tracking-wider text-emerald-950">
            Lo que recibes hoy completamente gratis:
          </p>

          <div class="flex items-start justify-between gap-2 border-b border-emerald-200/80 pb-2">
            <div>
              <p class="text-sm font-bold text-slate-900">1. Examen Visual Computarizado</p>
              <p class="text-xs text-slate-500">Graduación exacta para presbicia y fatiga</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 line-through block">$35.00</span>
              <span class="text-sm font-black text-emerald-700">HOY: $0</span>
            </div>
          </div>

          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-sm font-bold text-slate-900">2. Mantenimiento y limpieza ultrasónica</p>
              <p class="text-xs text-slate-500">Ajuste de tornillos y calibración de tus lentes</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 line-through block">$15.00</span>
              <span class="text-sm font-black text-emerald-700">HOY: $0</span>
            </div>
          </div>
        </div>

        <!-- BOTÓN PRINCIPAL #1 (ARRIBA) -->
        <div class="pt-2 space-y-2">
          <button
            @click="handleBookingClick('cta_superior')"
            class="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] active:scale-[0.98] text-white min-h-[56px] rounded-2xl text-lg font-black shadow-xl shadow-[#25D366]/40 transition-all cursor-pointer border-none"
          >
            <span class="text-2xl">💬</span> Agendar mi cita gratis por WhatsApp
          </button>

          <!-- Garantía -->
          <p class="text-xs text-slate-500">
            🔒 Sin compromiso de compra. No te llamaremos por teléfono.
          </p>

          <!-- Enlace secundario más discreto -->
          <div class="pt-1">
            <button
              @click="handlePreciosClick"
              class="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
            >
              Consultar precios de lentes y armazones
            </button>
          </div>
        </div>

      </div>

      <!-- ============================================================ -->
      <!-- SECCIÓN DE AUTORIDAD & MARCAS -->
      <!-- ============================================================ -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 text-left">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
            👨‍⚕️
          </div>
          <div>
            <h4 class="font-extrabold text-slate-900 text-base leading-snug">
              {{ configVenta.profesional }}
            </h4>
            <p class="text-xs text-slate-500">
              {{ configVenta.aniosExperiencia }} años de experiencia cuidando la salud visual en {{ configVenta.ciudad }}
            </p>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          Atención personalizada con equipos computarizados de alta precisión. Trabajamos con tecnología antirreflejo Blue Block, lentes progresivos para presbicia y marcas certificadas:
        </p>

        <!-- Marcas aliadas -->
        <div class="flex flex-wrap gap-2 pt-1">
          <span class="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">Essilor</span>
          <span class="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">Rodenstock</span>
          <span class="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">Transitions</span>
          <span class="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">Blue Block</span>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- SECCIÓN DE PRUEBA SOCIAL (TESTIMONIOS REALES FÁCILES DE CAMBIAR) -->
      <!-- ============================================================ -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3.5 text-left">
        <h4 class="font-black text-slate-900 text-sm uppercase tracking-wider">
          Opiniones de pacientes en {{ configVenta.ciudad }}:
        </h4>

        <div
          v-for="(t, i) in configVenta.testimonios"
          :key="i"
          class="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-1.5"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-xs">{{ t.nombre }}</span>
            <span class="text-amber-400 text-xs">⭐⭐⭐⭐⭐</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed italic">
            "{{ t.comentario }}"
          </p>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- BOTÓN PRINCIPAL #2 (CIERRE INFERIOR CON HORARIO) -->
      <!-- ============================================================ -->
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center space-y-4">
        <h3 class="font-black text-slate-900 text-xl leading-tight">
          Elige tu horario y aparta tu examen gratuito hoy
        </h3>

        <!-- Selector táctil de turnos -->
        <div class="grid grid-cols-2 gap-3 text-left">
          <button
            type="button"
            @click="selectedTurno = 'manana'"
            :class="selectedTurno === 'manana'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-bold shadow-md'
              : 'bg-white border-slate-200 text-slate-600'"
            class="p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1"
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
            class="p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1"
          >
            <span class="text-2xl leading-none">🌙</span>
            <span class="text-sm font-bold">Tarde</span>
            <span class="text-xs text-slate-500">15:30 a 18:00</span>
          </button>
        </div>

        <button
          @click="handleBookingClick('cta_inferior')"
          class="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] active:scale-[0.98] text-white min-h-[56px] rounded-2xl text-lg font-black shadow-xl shadow-[#25D366]/40 transition-all cursor-pointer border-none"
        >
          <span class="text-2xl">💬</span> Agendar mi cita gratis por WhatsApp
        </button>

        <p class="text-xs font-bold text-slate-700">
          Sin compromiso. Te respondemos en minutos.
        </p>

        <div>
          <button
            @click="handlePreciosClick"
            class="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
          >
            Consultar precios
          </button>
        </div>
      </div>

      <p class="text-center text-xs text-slate-400 py-4 font-medium">
        &copy; {{ new Date().getFullYear() }} Óptica Johanna &mdash; {{ configVenta.ciudad }}, Ecuador
      </p>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { supabase, hasSupabaseConfig } from '@/supabase'
import { usePulsoTracker } from '@/composables/usePulsoTracker'

// ============================================================
// DATOS FÁCILES DE REEMPLAZAR
// ============================================================
const configVenta = reactive({
  whatsappNumber: '593980753069',
  ciudad: 'Guayaquil',
  diasLimite: 3,
  aniosExperiencia: 16,
  profesional: 'Lic. Optómetra Madeline',
  testimonios: [
    {
      nombre: 'Rosa M. Benavides, 58 años',
      comentario: 'Tenía que estirar el brazo para leer la Biblia o los mensajes. Fui a la revisión gratuita, me trataron con mucha paciencia y mis lentes nuevos me devolvieron la tranquilidad.',
    },
    {
      nombre: 'Don Carlos Villacís, 64 años',
      comentario: 'Excelente atención. Rápido, sin rodeos y muy profesionales. Además me calibraron los lentes de mi esposa sin costo. Recomendado 100%.',
    },
    {
      nombre: 'Carmen Delgado, 53 años',
      comentario: 'Pensé que por ser gratis me iban a obligar a comprar algo, pero no. Coordiné la hora por WhatsApp y me atendieron a tiempo. Muy amables.',
    },
  ],
})

// ============================================================
// TELEMETRÍA PULSO ANALYTICS
// ============================================================
const tracker = usePulsoTracker({
  clientSlug: 'opticajohanna',
  quizKey: 'quiz5',
  quizName: 'Quiz 5 · Oferta Examen Computarizado',
})

const selectedTurno = ref<'manana' | 'tarde'>('manana')
const leadId = ref<number | null>(null)

// ============================================================
// RELOJ DE CUENTA REGRESIVA
// ============================================================
const countdown = reactive({
  days: '02',
  hours: '14',
  minutes: '35',
  seconds: '50',
})

let timerInterval: ReturnType<typeof setInterval> | null = null

function initCountdown() {
  const STORAGE_KEY = 'oculus_offer_deadline_quiz5'
  let targetTime = localStorage.getItem(STORAGE_KEY)
  
  if (!targetTime) {
    const future = Date.now() + configVenta.diasLimite * 24 * 60 * 60 * 1000
    targetTime = future.toString()
    localStorage.setItem(STORAGE_KEY, targetTime)
  }

  const update = () => {
    const diff = parseInt(targetTime!, 10) - Date.now()
    if (diff <= 0) {
      countdown.days = '00'
      countdown.hours = '00'
      countdown.minutes = '00'
      countdown.seconds = '00'
      return
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const m = Math.floor((diff / (1000 * 60)) % 60)
    const s = Math.floor((diff / 1000) % 60)

    countdown.days = String(d).padStart(2, '0')
    countdown.hours = String(h).padStart(2, '0')
    countdown.minutes = String(m).padStart(2, '0')
    countdown.seconds = String(s).padStart(2, '0')
  }

  update()
  timerInterval = setInterval(update, 1000)
}

onMounted(async () => {
  initCountdown()

  // Inyectar o activar script de Pulso si estuviese presente
  const scriptId = 'pulso-tracker-script'
  let script = document.getElementById(scriptId) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.src = '/tracker.js?v=0.8'
    script.setAttribute('data-client', 'opticajohanna')
    script.setAttribute('data-quiz', 'quiz5')
    script.setAttribute('data-site', 'opticajohanna/quiz5')
    script.defer = true
    document.head.appendChild(script)
  } else {
    ;(window as any).pulso?.setClientAndQuiz?.('opticajohanna', 'quiz5')
    ;(window as any).pulso?.visit?.()
  }

  ;(window as any).pulso?.step?.(1, { action: 'visita_pagina_venta_quiz5' })
  tracker.trackStep(1, { action: 'visita_pagina_venta_quiz5' })

  if (hasSupabaseConfig) {
    try {
      const res = await supabase.from('leads').insert({
        nombre: 'Visitante Página Venta',
        telefono: '',
        edad: 55,
        estado: 'Viendo Oferta',
        origen: 'quiz5',
        resultado: 'Leyendo oferta examen computarizado sin costo',
        respuestas: { etapa: 'pagina_venta', quiz: 'quiz5', client_id: 'opticajohanna' },
      }).select('id').single()
      if (res.data) leadId.value = res.data.id
    } catch (e) {}
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const whatsappUrlCita = computed(() => {
  const turnoTexto = selectedTurno.value === 'manana' ? 'de la mañana (10:30 a 12:30)' : 'de la tarde (15:30 a 18:00)'
  const msg = `Hola, vi la oferta de examen visual computarizado gratis en Guayaquil y deseo agendar mi cita para el turno ${turnoTexto}.`
  return `https://wa.me/${configVenta.whatsappNumber}?text=${encodeURIComponent(msg)}`
})

async function handleBookingClick(posicion: string) {
  ;(window as any).pulso?.booking?.({
    action: 'agendar_cita_quiz5',
    posicion,
    turno: selectedTurno.value,
  })

  await tracker.submitBooking({
    nombre: '',
    telefono: '',
    edad: 55,
    metadata: {
      quiz: 'quiz5',
      posicion,
      turno: selectedTurno.value,
    },
  })

  if (hasSupabaseConfig && leadId.value) {
    supabase.from('leads').update({
      estado: 'Agendado',
      estado_cita: 'Nueva',
      respuestas: { turno: selectedTurno.value, etapa: 'agendado_whatsapp', posicion, quiz: 'quiz5' },
    }).eq('id', leadId.value).then(() => {})
  }

  window.open(whatsappUrlCita.value, '_blank')
}

function handlePreciosClick() {
  ;(window as any).pulso?.track?.('click_consultar_precios', { quiz: 'quiz5' })
  const msg = 'Hola, me gustaría consultar la lista de precios de lentes y armazones en Óptica Johanna.'
  const url = `https://wa.me/${configVenta.whatsappNumber}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}
</script>
