<template>
  <div>
    <div class="flex items-center justify-between mb-2 text-[9px] font-mono text-slate-500">
      <span class="uppercase tracking-widest">{{ subtitle }}</span>
      <span>{{ total }} CLICS · {{ points.length }} PUNTOS</span>
    </div>
    <div class="relative rounded-lg overflow-hidden border border-pulso-border/70 bg-[#060a14]" :style="{ height: `${height}px` }">
      <!-- Zonas de contenido simuladas -->
      <div class="absolute inset-0 p-3 flex flex-col gap-2 opacity-30 pointer-events-none">
        <div class="h-6 rounded bg-slate-700/40 w-2/3"></div>
        <div class="h-10 rounded bg-slate-700/30 w-full"></div>
        <div class="grid grid-cols-3 gap-2 flex-1">
          <div class="rounded bg-slate-700/25"></div>
          <div class="rounded bg-slate-700/20"></div>
          <div class="rounded bg-slate-700/25"></div>
        </div>
        <div class="h-7 rounded bg-cyan-500/20 w-24"></div>
      </div>

      <!-- Grid de calor -->
      <div class="absolute inset-0 grid" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0,1fr))` }">
        <div
          v-for="(cell, i) in grid"
          :key="i"
          class="transition-colors duration-300"
          :style="{ background: cell.color }"
          :title="cell.count ? `${cell.count} clics en esta zona` : ''"
        ></div>
      </div>

      <!-- Puntos de clic -->
      <div
        v-for="(p, i) in points.slice(0, 80)"
        :key="`p${i}`"
        class="absolute rounded-full border border-white/50 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
        :style="{ left: `${p.x}%`, top: `${p.y}%`, width: `${Math.max(4, Math.min(14, 4 + p.weight))}px`, height: `${Math.max(4, Math.min(14, 4 + p.weight))}px`, background: heatColor(p.weight / maxWeight), transform: 'translate(-50%,-50%)' }"
        :title="`${p.label || 'clic'} · intensidad ${p.weight}`"
      ></div>

      <div class="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500">
        MAPA DE CALOR · {{ subtitle.toUpperCase() }}
      </div>
    </div>
    <div class="flex items-center justify-end gap-2 mt-1.5 text-[8px] font-mono text-slate-500">
      <span>FRÍO</span>
      <span class="w-16 h-1.5 rounded-full" style="background: linear-gradient(90deg, rgba(56,189,248,.25), rgba(245,158,11,.7), rgba(244,63,94,.95))"></span>
      <span>CALIENTE</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Point { x: number; y: number; weight: number; label?: string }

const props = withDefaults(defineProps<{
  points: Point[]
  subtitle?: string
  height?: number
  cols?: number
  rows?: number
}>(), { subtitle: 'Mapa de clics', height: 260, cols: 30, rows: 16 })

const maxWeight = computed(() => Math.max(1, ...props.points.map(p => p.weight)))
const total = computed(() => props.points.reduce((a, p) => a + p.weight, 0))

const grid = computed(() => {
  const cells = Array.from({ length: props.cols * props.rows }, () => 0)
  for (const p of props.points) {
    const c = Math.min(props.cols - 1, Math.max(0, Math.floor((p.x / 100) * props.cols)))
    const r = Math.min(props.rows - 1, Math.max(0, Math.floor((p.y / 100) * props.rows)))
    cells[r * props.cols + c] += p.weight
  }
  const max = Math.max(1, ...cells)
  return cells.map(count => {
    const intensity = count / max
    return {
      count,
      color: count === 0
        ? 'transparent'
        : `rgba(56,189,248,${0.06 + intensity * 0.18})`,
      glow: intensity,
    }
  })
})

function heatColor(i: number) {
  if (i > 0.66) return 'rgba(244,63,94,0.9)'
  if (i > 0.33) return 'rgba(245,158,11,0.9)'
  return 'rgba(56,189,248,0.85)'
}
</script>
