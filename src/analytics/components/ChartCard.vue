<template>
  <div class="hud-card flex flex-col">
    <div class="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-pulso-border/50">
      <div class="min-w-0">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full" :style="{ background: accent }"></span>
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-[10px] font-mono text-slate-500 mt-0.5">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <slot name="badge">
          <span v-if="badge" class="badge badge-muted text-[9px] py-0 px-2">{{ badge }}</span>
        </slot>
      </div>
    </div>
    <div class="relative flex-1" :style="{ height: `${height}px` }">
      <div v-if="empty" class="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
        <span class="text-[11px] text-slate-400">// SIN DATOS PARA ESTE FILTRO</span>
        <span class="text-[10px] text-slate-600 mt-1">Ajusta el período o los filtros globales.</span>
      </div>
      <Chart v-else :type="type" :data="data" :options="mergedOptions" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Chart } from 'vue-chartjs'
import { baseOptions } from '../chart'

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar' | 'scatter' | 'bubble'
  data: any
  options?: any
  height?: number
  badge?: string
  accent?: string
  empty?: boolean
}>(), { height: 240, accent: '#38bdf8', empty: false })

const mergedOptions = computed(() => {
  const merged = baseOptions(props.options || {})
  // Los gráficos circulares no usan ejes: si se heredan, Chart.js dibuja
  // una cuadrícula y escalas alrededor de la dona.
  if (props.type === 'doughnut' || props.type === 'pie') {
    delete merged.scales
  }
  return merged
})
</script>
