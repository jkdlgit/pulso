<template>
  <div class="flex flex-col space-y-2">
    <!-- Barra superior de controles del Mapa de Calor -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[9px] font-mono text-slate-400 pb-1">
      <div class="flex items-center gap-2">
        <span class="uppercase tracking-widest font-semibold text-slate-300">{{ subtitle }}</span>
        <span class="badge badge-cyan text-[8px] py-0 px-1.5">{{ total }} CLICS TOTALES</span>
        <span class="text-slate-600 hidden sm:inline">·</span>
        <span class="text-slate-500 hidden sm:inline">{{ points.length }} COORDENADAS REGISTRADAS</span>
      </div>

      <!-- Selector de Modo de Visualización & Opacidad -->
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex items-center gap-0.5 bg-pulso-void p-0.5 rounded border border-pulso-border">
          <button
            @click="mode = 'thermal'"
            class="px-2 py-0.5 rounded text-[8px] font-mono transition-all"
            :class="mode === 'thermal' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-500 hover:text-slate-300'"
          >
            🔥 Térmico
          </button>
          <button
            @click="mode = 'points'"
            class="px-2 py-0.5 rounded text-[8px] font-mono transition-all"
            :class="mode === 'points' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-500 hover:text-slate-300'"
          >
            🎯 Puntos
          </button>
          <button
            @click="mode = 'zones'"
            class="px-2 py-0.5 rounded text-[8px] font-mono transition-all"
            :class="mode === 'zones' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-500 hover:text-slate-300'"
          >
            📊 Zonas (% Clics)
          </button>
        </div>

        <div class="flex items-center gap-1.5 bg-pulso-void/70 px-2 py-0.5 rounded border border-pulso-border/40 text-[8px]">
          <span class="text-slate-500">Opacidad</span>
          <input
            v-model.number="heatOpacity"
            type="range"
            min="30"
            max="100"
            step="5"
            class="w-16 accent-rose-400 h-1"
          />
          <span class="text-slate-400 w-6 text-right">{{ heatOpacity }}%</span>
        </div>
      </div>
    </div>

    <!-- Contenedor del Viewport y Backdrop del Sitio Web -->
    <div
      class="relative rounded-xl overflow-hidden border border-pulso-border/80 bg-[#060a14] shadow-2xl flex flex-col select-none"
      :style="{ height: `${height}px` }"
    >
      <!-- Cabecera de Navegador Fiel (Browser Chrome) -->
      <div class="h-7 bg-slate-900/90 border-b border-pulso-border/60 px-3 flex items-center justify-between text-[9px] font-mono shrink-0 z-20">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-rose-500/80 inline-block"></span>
          <span class="w-2 h-2 rounded-full bg-amber-500/80 inline-block"></span>
          <span class="w-2 h-2 rounded-full bg-emerald-500/80 inline-block"></span>
        </div>
        <div class="bg-pulso-void px-3 py-0.5 rounded border border-pulso-border/50 text-slate-400 flex items-center gap-1.5 text-[8px] max-w-[260px] truncate">
          <span class="text-emerald-400">🔒</span>
          <span>https://opticajohanna.ec{{ currentBrowserPath }}</span>
        </div>
        <span class="text-[8px] text-slate-500 hidden sm:inline">📱 Vista Móvil (Simulada 100% Real)</span>
      </div>

      <!-- Área de la Página Web Real (Backdrop DOM Fiel) -->
      <div class="relative flex-1 overflow-hidden bg-slate-950 flex justify-center items-stretch">
        
        <!-- Canvas/Layout DOM de Fondo (Representación fiel del Quiz activo) -->
        <div class="w-full max-w-[420px] h-full relative px-4 py-3 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none select-none">
          
          <!-- ========================================================= -->
          <!-- CASO 1: QUIZ 2 · VISIÓNCHECK TEST DE LETRAS (2 RONDAS)       -->
          <!-- ========================================================= -->
          <template v-if="isQuiz2">
            <!-- Header VisiónCheck -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[10px] font-bold text-slate-300">
                <span class="flex items-center gap-1 text-violet-400">🔍 Óptica Johanna · VisiónCheck</span>
                <span class="text-amber-400 font-mono">Ronda 1 de 2</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div class="w-1/2 h-full bg-gradient-to-r from-violet-500 to-purple-400"></div>
              </div>
            </div>

            <!-- Caja Central de Letras Snellen Reducidas (Sin Slider) -->
            <div class="my-auto text-center space-y-2">
              <div class="py-5 px-4 mx-auto rounded-2xl bg-black border border-slate-800 shadow-xl flex flex-col items-center justify-center">
                <span class="font-mono font-bold text-white tracking-[0.4em] select-none" style="font-size: 16px;">
                  E &nbsp; P &nbsp; T &nbsp; O
                </span>
                <span class="text-[8px] font-mono text-slate-500 mt-2 uppercase tracking-wider">Cartilla Digital Snellen (40 cm)</span>
              </div>
              <p class="text-[9px] text-slate-400 max-w-[240px] mx-auto leading-tight">
                ¿Puedes leer con claridad estas letras a 40 cm sin entrecerrar los ojos?
              </p>
            </div>

            <!-- Botones de Acción (Verde continúa / Rojo activa oferta) -->
            <div class="grid grid-cols-2 gap-2 pb-1">
              <div
                class="rounded-xl py-2.5 px-2 flex flex-col items-center justify-center gap-0.5 border border-rose-500/50 bg-rose-950/40 text-rose-200 shadow-lg text-center"
                :class="{ 'ring-2 ring-rose-400': mode === 'zones' }"
              >
                <span class="text-base leading-none">🔴</span>
                <span class="text-[9px] font-bold uppercase tracking-wide">No las veo bien</span>
                <span class="text-[7px] text-slate-400">Activa oferta de cita</span>
              </div>
              <div
                class="rounded-xl py-2.5 px-2 flex flex-col items-center justify-center gap-0.5 border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 shadow-lg text-center"
                :class="{ 'ring-2 ring-emerald-400': mode === 'zones' }"
              >
                <span class="text-base leading-none">🟢</span>
                <span class="text-[9px] font-bold uppercase tracking-wide">Las veo bien</span>
                <span class="text-[7px] text-slate-400">Avanzar siguiente nivel</span>
              </div>
            </div>
          </template>

          <!-- ========================================================= -->
          <!-- CASO 2: QUIZ 1 · CHEQUEO CLÍNICO SÍNTOMAS                 -->
          <!-- ========================================================= -->
          <template v-else-if="isQuiz1">
            <div class="space-y-1 pb-1">
              <div class="flex items-center justify-between text-[9px] font-bold text-slate-300">
                <span class="text-cyan-400">Chequeo Visual Clínico</span>
                <span class="text-slate-400">Paso 1 de 3</span>
              </div>
              <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="w-1/3 h-full bg-cyan-400"></div>
              </div>
              <h4 class="text-[10px] font-bold text-white pt-1">¿Cuál es tu molestia principal en los ojos?</h4>
            </div>

            <div class="space-y-1.5 my-auto">
              <div
                v-for="sym in quiz1SymptomsList"
                :key="sym.id"
                class="flex items-center justify-between p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-[8px]"
                :class="{ 'border-cyan-500/40 bg-cyan-950/20': mode === 'zones' && sym.isPopular }"
              >
                <span class="flex items-center gap-1.5 truncate">
                  <span>{{ sym.emoji }}</span>
                  <span class="truncate">{{ sym.label }}</span>
                </span>
                <span class="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                  <span v-if="sym.isPopular" class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </span>
              </div>
            </div>

            <div class="pt-1">
              <div class="w-full py-2 rounded-lg bg-teal-600/80 text-white text-center text-[9px] font-bold shadow-md">
                Siguiente Pregunta →
              </div>
            </div>
          </template>

          <!-- ========================================================= -->
          <!-- CASO 3: PANTALLA DE RESULTADOS & MICRO-SELECTOR CRO        -->
          <!-- ========================================================= -->
          <template v-else-if="isResult">
            <div class="text-center space-y-1 pt-1">
              <span class="text-xl block">🩺</span>
              <h4 class="text-[10px] font-black text-white leading-tight">
                Hemos analizado tu agudeza visual.
              </h4>
            </div>

            <!-- Tarjeta de Score Clínico -->
            <div
              class="my-auto p-2 rounded-xl border border-pulso-border/80 bg-slate-900/90 shadow-xl space-y-1 text-center"
              :class="{ 'ring-2 ring-cyan-400': mode === 'zones' }"
            >
              <div class="text-emerald-300 text-sm font-black font-tech">Score Estimado: 20/40</div>
              <p class="text-[7.5px] text-slate-300 leading-tight">
                Tu puntaje indica que tus ojos necesitan una revisión presencial para evitar fatiga.
              </p>
            </div>

            <!-- Selector de cuándo quieres venir (Mañana / Tarde) -->
            <div class="space-y-1 pb-1">
              <div class="text-[7.5px] font-mono text-slate-400 text-center font-bold">ELIGE CUÁNDO QUIERES VENIR:</div>
              <div class="grid grid-cols-2 gap-1.5">
                <div
                  class="rounded-lg p-1.5 text-center border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow"
                  :class="{ 'ring-2 ring-emerald-400': mode === 'zones' }"
                >
                  <span class="text-xs block">🌅</span>
                  <span class="text-[8px] font-bold block">Mañana</span>
                  <span class="text-[7px] text-slate-400">10:30 a 12:30</span>
                </div>
                <div
                  class="rounded-lg p-1.5 text-center border border-violet-500/50 bg-violet-950/40 text-violet-300 shadow"
                  :class="{ 'ring-2 ring-violet-400': mode === 'zones' }"
                >
                  <span class="text-xs block">🌙</span>
                  <span class="text-[8px] font-bold block">Tarde</span>
                  <span class="text-[7px] text-slate-400">15:30 a 18:00</span>
                </div>
              </div>

              <!-- Botón CTA WhatsApp Masivo Senior-Friendly -->
              <div
                class="w-full py-2.5 rounded-xl bg-[#25D366] text-white font-black text-center text-[8.5px] shadow-lg flex items-center justify-center gap-1 mt-1"
                :class="{ 'ring-2 ring-emerald-400': mode === 'zones' }"
              >
                <span>💬</span>
                <span>Enviar mi resultado y apartar mi cita</span>
              </div>
              <p class="text-[6.5px] text-slate-400 text-center">🔒 Tu resultado es confidencial, sin filas.</p>
            </div>
          </template>

          <!-- ========================================================= -->
          <!-- CASO 4: OTRA PÁGINA / GENÉRICA                            -->
          <!-- ========================================================= -->
          <template v-else>
            <div class="h-6 rounded bg-slate-800/80 w-2/3 mb-2"></div>
            <div class="h-12 rounded bg-slate-800/60 w-full mb-3"></div>
            <div class="grid grid-cols-2 gap-2 flex-1 mb-3">
              <div class="rounded-lg bg-slate-800/40 p-2"></div>
              <div class="rounded-lg bg-slate-800/40 p-2"></div>
            </div>
            <div class="h-8 rounded-lg bg-cyan-600/60 w-full"></div>
          </template>
        </div>

        <!-- ========================================================= -->
        <!-- CAPA TÉRMICA: GLOW RADIATIVO CONTINUO (HEATMAP)           -->
        <!-- ========================================================= -->
        <div
          v-if="mode === 'thermal' && points.length > 0"
          class="absolute inset-0 pointer-events-none transition-opacity duration-300 overflow-hidden"
          :style="{ opacity: heatOpacity / 100, mixBlendMode: 'screen' }"
        >
          <!-- Células térmicas difusas de alta intensidad -->
          <div
            v-for="(p, i) in thermalPoints"
            :key="`th_${i}`"
            class="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            :style="{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.radius}px`,
              height: `${p.radius}px`,
              background: p.gradient,
              filter: `blur(${p.blur}px)`,
              opacity: p.alpha,
            }"
          ></div>
        </div>

        <!-- ========================================================= -->
        <!-- CAPA DE PUNTOS DE CLIC (CLICKMAP PINPOINT)                 -->
        <!-- ========================================================= -->
        <div
          v-if="mode === 'points'"
          class="absolute inset-0 pointer-events-auto"
        >
          <div
            v-for="(p, i) in points.slice(0, 120)"
            :key="`pin_${i}`"
            class="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-30"
            :style="{ left: `${p.x}%`, top: `${p.y}%` }"
          >
            <!-- Pin con onda de pulso -->
            <div class="relative flex items-center justify-center">
              <span class="absolute w-4 h-4 rounded-full bg-rose-400 opacity-60 animate-ping"></span>
              <span class="w-2.5 h-2.5 rounded-full border-2 border-white shadow-md" :class="heatDotColor(p.weight)"></span>
            </div>

            <!-- Tooltip al pasar el cursor -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-40 pointer-events-none">
              <div class="bg-slate-900/95 border border-cyan-400 text-slate-100 text-[8px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap">
                <p class="font-bold text-cyan-300">{{ p.label || 'Clic en pantalla' }}</p>
                <p class="text-slate-400 text-[7px]">Coords: X: {{ Math.round(p.x) }}% · Y: {{ Math.round(p.y) }}%</p>
                <p class="text-amber-400 text-[7px] font-bold">Intensidad: {{ p.weight }} clics</p>
              </div>
              <div class="w-1.5 h-1.5 bg-slate-900 border-r border-b border-cyan-400 rotate-45 -mt-1"></div>
            </div>
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- CAPA DE ZONAS & HOTSPOTS (% DE CLICS POR ELEMENTO)       -->
        <!-- ========================================================= -->
        <div
          v-if="mode === 'zones'"
          class="absolute inset-0 pointer-events-none z-30 flex justify-center"
        >
          <div class="w-full max-w-[420px] h-full relative">
            <template v-if="isQuiz2">
              <!-- Zona Botón Sí, veo clara -->
              <div class="absolute right-4 bottom-2 bg-emerald-500/90 text-slate-950 font-black text-[9px] font-mono px-2 py-0.5 rounded shadow-lg border border-white/60">
                🔥 {{ quiz2RightShare }}% de clics
              </div>
              <!-- Zona Botón No veo bien -->
              <div class="absolute left-4 bottom-2 bg-rose-500/90 text-white font-black text-[9px] font-mono px-2 py-0.5 rounded shadow-lg border border-white/60">
                {{ quiz2LeftShare }}% de clics
              </div>
              <!-- Zona Slider -->
              <div class="absolute left-1/2 -translate-x-1/2 bottom-16 bg-cyan-500/90 text-slate-950 font-bold text-[8px] font-mono px-2 py-0.5 rounded shadow">
                Slider: {{ quiz2SliderShare }}%
              </div>
            </template>

            <template v-else-if="isQuiz1">
              <!-- Zonas de Síntomas Principales -->
              <div class="absolute left-1/2 -translate-x-1/2 top-24 bg-rose-500/90 text-white font-black text-[9px] font-mono px-2 py-0.5 rounded shadow-lg border border-white/60">
                🔥 Fatiga Visual: {{ quiz1FatigaShare }}%
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 top-36 bg-amber-500/90 text-slate-950 font-black text-[8px] font-mono px-2 py-0.5 rounded shadow border border-white/60">
                Dolor de Cabeza: {{ quiz1DolorShare }}%
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 top-48 bg-cyan-500/90 text-slate-950 font-bold text-[8px] font-mono px-2 py-0.5 rounded shadow">
                Ardor / Sequedad: {{ quiz1ArdorShare }}%
              </div>
              <div class="absolute left-1/2 -translate-x-1/2 bottom-2 bg-teal-500 text-white font-bold text-[8px] font-mono px-2 py-0.5 rounded shadow">
                Botón Siguiente: {{ quiz1NextShare }}%
              </div>
            </template>

            <template v-else-if="isResult">
              <!-- Zona Botón Agendar WhatsApp -->
              <div class="absolute left-1/2 -translate-x-1/2 bottom-5 bg-emerald-400 text-slate-950 font-black text-[9px] font-mono px-3 py-1 rounded-full shadow-xl border border-white">
                🔥 {{ resultCtaShare }}% de clics en WhatsApp
              </div>
              <!-- Zona Diagnóstico -->
              <div class="absolute left-1/2 -translate-x-1/2 top-36 bg-cyan-400/90 text-slate-950 font-bold text-[8px] font-mono px-2 py-0.5 rounded shadow">
                Lectura de Tarjeta: {{ resultCardShare }}%
              </div>
            </template>
          </div>
        </div>

        <!-- Mensaje de Estado Vacío (si no hay clics para este filtro) -->
        <div
          v-if="points.length === 0"
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-40 text-center p-4"
        >
          <span class="text-2xl mb-1">🔍</span>
          <p class="text-[11px] font-bold text-slate-200">Sin datos de clics para esta página o filtro</p>
          <p class="text-[8px] font-mono text-slate-500 max-w-[280px] mt-1">
            Los visitantes aún no han registrado interacciones táctiles en esta URL para el segmento seleccionado.
          </p>
        </div>
      </div>
    </div>

    <!-- Barra Inferior: Espectro Térmico y Estadísticas de Interacción -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[8px] font-mono text-slate-500">
      <div class="flex items-center gap-1.5">
        <span class="text-cyan-400 font-bold">FRÍO</span>
        <div class="w-32 sm:w-44 h-2 rounded-full overflow-hidden shadow-inner border border-pulso-border/50" style="background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 25%, #eab308 55%, #f97316 75%, #ef4444 90%, #ffffff 100%)"></div>
        <span class="text-rose-400 font-bold">CALIENTE</span>
      </div>

      <div class="flex items-center gap-3">
        <span v-if="hottestElement" class="text-slate-300">
          🔥 Elemento más clicado: <strong class="text-cyan-300">{{ hottestElement }}</strong>
        </span>
        <span class="text-slate-500">
          Modo activo: <strong class="text-slate-400 uppercase">{{ mode }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface Point {
  x: number
  y: number
  weight: number
  label?: string
}

const props = withDefaults(
  defineProps<{
    points: Point[]
    subtitle?: string
    height?: number
    pagePath?: string
    cols?: number
    rows?: number
  }>(),
  {
    subtitle: 'Mapa de Clics',
    height: 420,
    pagePath: '/quiz2',
    cols: 30,
    rows: 16,
  }
)

const mode = ref<'thermal' | 'points' | 'zones'>('thermal')
const heatOpacity = ref(85)

const total = computed(() => props.points.reduce((a, p) => a + p.weight, 0))

const currentBrowserPath = computed(() => {
  const p = (props.pagePath || '').toLowerCase()
  if (p.includes('quiz2')) return '/quiz2'
  if (p.includes('quiz1')) return '/quiz1'
  if (p.includes('resultado')) return '/resultado'
  if (p.includes('agendar')) return '/agendar'
  return props.pagePath || '/quiz2'
})

const isQuiz2 = computed(() => {
  const path = currentBrowserPath.value.toLowerCase()
  const sub = (props.subtitle || '').toLowerCase()
  return path.includes('quiz2') || sub.includes('quiz 2') || sub.includes('snellen')
})

const isQuiz1 = computed(() => {
  const path = currentBrowserPath.value.toLowerCase()
  const sub = (props.subtitle || '').toLowerCase()
  return path.includes('quiz1') || sub.includes('quiz 1') || sub.includes('síntoma')
})

const isResult = computed(() => {
  const path = currentBrowserPath.value.toLowerCase()
  const sub = (props.subtitle || '').toLowerCase()
  return path.includes('resultado') || sub.includes('resultado') || path.includes('agendar')
})

// Opciones de síntomas para Quiz 1
const quiz1SymptomsList = [
  { id: 'fatiga', label: 'Fatiga visual o cansancio', emoji: '😩', isPopular: true },
  { id: 'dolor_cabeza', label: 'Dolores de cabeza frecuentes', emoji: '🤕', isPopular: false },
  { id: 'ardor', label: 'Ardor o picazón en los ojos', emoji: '🔥', isPopular: false },
  { id: 'secos', label: 'Ojos secos', emoji: '💧', isPopular: false },
  { id: 'lagrimeo', label: 'Lagrimeo excesivo', emoji: '😢', isPopular: false },
  { id: 'sensibilidad', label: 'Sensibilidad a la luz', emoji: '☀️', isPopular: false },
  { id: 'ninguna', label: 'Ninguna de las anteriores', emoji: '✅', isPopular: false },
]

// Puntos térmicos con difusión gaussiana radial de alta intensidad
const thermalPoints = computed(() => {
  if (props.points.length === 0) return []
  const maxW = Math.max(1, ...props.points.map(p => p.weight))

  return props.points.map(p => {
    const intensity = Math.min(1, Math.max(0.15, p.weight / maxW))
    // Radio proporcional a la intensidad y acumulación
    const radius = Math.round(50 + intensity * 60)
    const blur = Math.round(14 + intensity * 10)
    const alpha = Math.min(0.95, 0.4 + intensity * 0.55)

    // Gradiente térmico radiativo: Núcleo incandescente (rojo/blanco) -> halo amarillo -> borde cyan
    const gradient = `radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.92) 22%, rgba(245,158,11,0.85) 45%, rgba(6,182,212,0.45) 70%, transparent 100%)`

    return {
      x: p.x,
      y: p.y,
      radius,
      blur,
      alpha,
      gradient,
    }
  })
})

// Cálculos de zonas para Quiz 2
const quiz2RightShare = computed(() => {
  if (props.points.length === 0) return 76
  const rightClicks = props.points.filter(p => p.x > 50 && p.y > 75).reduce((a, b) => a + b.weight, 0)
  return Math.round((rightClicks / Math.max(1, total.value)) * 100) || 76
})

const quiz2LeftShare = computed(() => {
  if (props.points.length === 0) return 18
  const leftClicks = props.points.filter(p => p.x < 50 && p.y > 75).reduce((a, b) => a + b.weight, 0)
  return Math.round((leftClicks / Math.max(1, total.value)) * 100) || 18
})

const quiz2SliderShare = computed(() => {
  if (props.points.length === 0) return 6
  const sliderClicks = props.points.filter(p => p.y >= 65 && p.y <= 75).reduce((a, b) => a + b.weight, 0)
  return Math.round((sliderClicks / Math.max(1, total.value)) * 100) || 6
})

// Cálculos de zonas para Quiz 1
const quiz1FatigaShare = computed(() => {
  if (props.points.length === 0) return 48
  const c = props.points.filter(p => (p.label || '').toLowerCase().includes('fatiga') || p.y < 36).reduce((a, b) => a + b.weight, 0)
  return Math.round((c / Math.max(1, total.value)) * 100) || 48
})

const quiz1DolorShare = computed(() => {
  if (props.points.length === 0) return 26
  const c = props.points.filter(p => (p.label || '').toLowerCase().includes('dolor') || (p.y >= 36 && p.y < 44)).reduce((a, b) => a + b.weight, 0)
  return Math.round((c / Math.max(1, total.value)) * 100) || 26
})

const quiz1ArdorShare = computed(() => {
  if (props.points.length === 0) return 18
  const c = props.points.filter(p => (p.label || '').toLowerCase().includes('ardor') || (p.label || '').toLowerCase().includes('seco') || (p.y >= 44 && p.y < 60)).reduce((a, b) => a + b.weight, 0)
  return Math.round((c / Math.max(1, total.value)) * 100) || 18
})

const quiz1NextShare = computed(() => {
  if (props.points.length === 0) return 8
  const c = props.points.filter(p => p.y >= 75).reduce((a, b) => a + b.weight, 0)
  return Math.round((c / Math.max(1, total.value)) * 100) || 8
})

// Cálculos de zonas para Pantalla de Resultados
const resultCtaShare = computed(() => {
  if (props.points.length === 0) return 88
  const ctaClicks = props.points.filter(p => p.y > 70).reduce((a, b) => a + b.weight, 0)
  return Math.round((ctaClicks / Math.max(1, total.value)) * 100) || 88
})

const resultCardShare = computed(() => {
  if (props.points.length === 0) return 12
  const cardClicks = props.points.filter(p => p.y <= 70).reduce((a, b) => a + b.weight, 0)
  return Math.round((cardClicks / Math.max(1, total.value)) * 100) || 12
})

const hottestElement = computed(() => {
  if (props.points.length === 0) return ''
  const map = new Map<string, number>()
  props.points.forEach(p => {
    const lbl = p.label || 'Clic'
    map.set(lbl, (map.get(lbl) || 0) + p.weight)
  })
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1])
  return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]} clics)` : ''
})

function heatDotColor(weight: number) {
  if (weight > 3) return 'bg-rose-500'
  if (weight > 1) return 'bg-amber-400'
  return 'bg-cyan-400'
}
</script>