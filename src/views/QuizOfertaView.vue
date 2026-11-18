<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-start font-sans">
    <main class="w-full max-w-sm">

      <!-- ENCABEZADO -->
      <div class="bg-slate-900 text-white text-center px-5 py-6">
        <p class="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">👓 Óptica Johanna · Guayaquil</p>
        <h1 class="text-3xl font-black leading-tight">
          ¿Cuál armazón<br>te gusta más?
        </h1>
        <p class="text-lg text-slate-300 mt-2 leading-snug">
          Elige tu estilo y recibe un<br>
          <strong class="text-amber-300 text-xl">descuento especial</strong>
          + examen gratis 🎁
        </p>
      </div>

      <!-- INSTRUCCIÓN -->
      <div class="bg-amber-50 border-b border-amber-200 px-5 py-3 text-center">
        <p class="text-base font-bold text-amber-800">👇 Presiona el que más te guste</p>
      </div>

      <!-- TARJETAS DE LENTES -->
      <div class="divide-y divide-slate-100">

        <!-- OPCIÓN 1: Elegante Mujer -->
        <button
          @click="handleFrameClick('cat_eye', 'Armazón Cat Eye Elegante')"
          class="w-full text-left bg-white hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer border-none p-0"
        >
          <div class="relative overflow-hidden" style="height: 180px;">
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80&fit=crop"
              alt="Armazón elegante cat eye"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <span class="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full uppercase">Para ella</span>
                <p class="text-white font-black text-xl mt-1 leading-none">Cat Eye Clásico</p>
                <p class="text-rose-200 text-sm font-medium">Elegante · Sofisticado</p>
              </div>
              <div class="text-right">
                <span class="text-slate-300 text-sm line-through block">$45</span>
                <span class="text-amber-300 font-black text-2xl">$25</span>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 flex items-center justify-between bg-rose-50">
            <span class="text-base font-bold text-slate-800">Quiero este con descuento</span>
            <span class="text-2xl">💬</span>
          </div>
        </button>

        <!-- OPCIÓN 2: Clásico Hombre -->
        <button
          @click="handleFrameClick('rectangular', 'Armazón Rectangular Clásico')"
          class="w-full text-left bg-white hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer border-none p-0"
        >
          <div class="relative overflow-hidden" style="height: 180px;">
            <img
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80&fit=crop"
              alt="Armazón clásico rectangular"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <span class="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full uppercase">Para él</span>
                <p class="text-white font-black text-xl mt-1 leading-none">Rectangular Clásico</p>
                <p class="text-blue-200 text-sm font-medium">Formal · Duradero</p>
              </div>
              <div class="text-right">
                <span class="text-slate-300 text-sm line-through block">$45</span>
                <span class="text-amber-300 font-black text-2xl">$25</span>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 flex items-center justify-between bg-blue-50">
            <span class="text-base font-bold text-slate-800">Quiero este con descuento</span>
            <span class="text-2xl">💬</span>
          </div>
        </button>

        <!-- OPCIÓN 3: Redondo Unisex -->
        <button
          @click="handleFrameClick('redondo', 'Armazón Redondo Moderno')"
          class="w-full text-left bg-white hover:bg-emerald-50 active:bg-emerald-100 transition-colors cursor-pointer border-none p-0"
        >
          <div class="relative overflow-hidden" style="height: 180px;">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80&fit=crop"
              alt="Armazón redondo moderno unisex"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <span class="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-full uppercase">Unisex</span>
                <p class="text-white font-black text-xl mt-1 leading-none">Redondo Moderno</p>
                <p class="text-emerald-200 text-sm font-medium">Juvenil · Para todos</p>
              </div>
              <div class="text-right">
                <span class="text-slate-300 text-sm line-through block">$45</span>
                <span class="text-amber-300 font-black text-2xl">$25</span>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 flex items-center justify-between bg-emerald-50">
            <span class="text-base font-bold text-slate-800">Quiero este con descuento</span>
            <span class="text-2xl">💬</span>
          </div>
        </button>

      </div>

      <!-- PIE DE PÁGINA -->
      <div class="bg-slate-50 border-t border-slate-200 px-5 py-5 text-center space-y-2">
        <p class="text-base font-bold text-slate-700">
          🎁 Incluye examen visual <strong class="text-emerald-700">sin costo</strong>
        </p>
        <p class="text-sm text-slate-500">🔒 Sin compromiso · Coordinas por WhatsApp · Sin llamadas</p>
        <p class="text-xs text-slate-400 pt-2">© {{ new Date().getFullYear() }} Óptica Johanna · Guayaquil</p>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase, hasSupabaseConfig } from '../supabase'
import { usePulsoTracker } from '../composables/usePulsoTracker'

// ============================================================
// CONFIGURACIÓN — fácil de cambiar
// ============================================================
const whatsappNumber = '593980753069'

// ============================================================
// TELEMETRÍA PULSO ANALYTICS
// ============================================================
const tracker = usePulsoTracker({
  clientSlug: 'opticajohanna',
  quizKey: 'quiz5',
  quizName: 'Quiz 5 · Elige tu armazón',
})

const leadId = ref<number | null>(null)

onMounted(async () => {
  // Pulso script injection
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

  ;(window as any).pulso?.step?.(1, { action: 'visita_selector_armazon_quiz5' })
  tracker.trackStep(1, { action: 'visita_selector_armazon_quiz5' })

  if (hasSupabaseConfig) {
    try {
      const res = await supabase.from('leads').insert({
        nombre: 'Visitante Selector Armazón',
        telefono: '',
        edad: 55,
        estado: 'Viendo Oferta',
        origen: 'quiz5',
        resultado: 'Viendo selector de armazones con descuento',
        respuestas: { etapa: 'selector_armazon', quiz: 'quiz5', client_id: 'opticajohanna' },
      }).select('id').single()
      if (res.data) leadId.value = res.data.id
    } catch (e) {}
  }
})

async function handleFrameClick(frameKey: string, frameLabel: string) {
  // Telemetría
  ;(window as any).pulso?.booking?.({
    action: 'elegir_armazon_quiz5',
    armazon: frameKey,
  })

  await tracker.submitBooking({
    nombre: '',
    telefono: '',
    edad: 55,
    metadata: { quiz: 'quiz5', armazon: frameKey, armazon_label: frameLabel },
  })

  if (hasSupabaseConfig && leadId.value) {
    supabase.from('leads').update({
      estado: 'Agendado',
      estado_cita: 'Nueva',
      respuestas: { armazon: frameKey, etapa: 'eligio_armazon_whatsapp', quiz: 'quiz5' },
    }).eq('id', leadId.value).then(() => {})
  }

  // Mensaje pre-llenado según el armazón elegido
  const msg = `Hola, vi los armazones en la página de Óptica Johanna y me gustó el *${frameLabel}*. Me gustaría aprovechar el descuento y el examen visual gratis. ¿Cómo lo aparto?`
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')
}
</script>
