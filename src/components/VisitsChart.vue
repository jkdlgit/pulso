<template>
  <div class="h-64 flex flex-col justify-between pt-2">
    <!-- Chart area with subtle grid lines -->
    <div v-if="data.length > 0" class="flex-1 flex items-end gap-3 px-2 pb-3 border-b border-pulso-border/70 relative">
      <!-- Background horizontal tech grid lines -->
      <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        <div class="border-b border-cyan-500/30 w-full"></div>
        <div class="border-b border-cyan-500/30 w-full"></div>
        <div class="border-b border-cyan-500/30 w-full"></div>
      </div>

      <div
        v-for="(item, idx) in data"
        :key="idx"
        class="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative cursor-pointer z-10"
      >
        <!-- Floating HUD Tooltip -->
        <div class="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -top-12 bg-pulso-surface/95 border border-cyan-500/50 shadow-glow-cyan px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap pointer-events-none z-20 flex flex-col items-center">
          <span class="font-bold text-cyan-300">{{ item.visitas }} VISITAS</span>
          <span class="text-emerald-400 font-semibold">{{ item.reservas }} RESERVAS</span>
        </div>

        <!-- Bars container -->
        <div class="w-full flex items-end justify-center gap-1 h-44">
          <!-- Visits bar (Cyan Gradient) -->
          <div
            class="w-full max-w-[14px] bg-gradient-to-t from-cyan-900/60 via-cyan-500/70 to-cyan-400 group-hover:to-cyan-200 rounded-t-sm transition-all duration-300 shadow-sm"
            :style="{ height: `${(item.visitas / maxVisits) * 100}%` }"
          ></div>
          <!-- Reservas bar (Emerald Gradient) -->
          <div
            class="w-full max-w-[7px] bg-gradient-to-t from-emerald-900/60 via-emerald-500/80 to-emerald-400 group-hover:to-emerald-200 rounded-t-sm transition-all duration-300 shadow-sm"
            :style="{ height: `${(item.reservas / maxVisits) * 100}%` }"
          ></div>
        </div>

        <!-- Date label -->
        <span class="text-[10px] font-mono text-slate-500 group-hover:text-cyan-300 transition-colors">
          {{ item.date }}
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-center font-mono py-12 border-b border-pulso-border/50">
      <span class="text-xs text-slate-400 font-semibold">// SIN DATOS HISTÓRICOS AÚN</span>
      <span class="text-[10px] text-slate-500 mt-1">El gráfico se dibujará automáticamente con el tráfico real.</span>
    </div>

    <!-- Technical Legend -->
    <div class="flex items-center justify-between text-xs font-mono text-slate-400 pt-3">
      <span class="text-[10px] text-slate-500">// ESCALA TELEMÉTRICA</span>
      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-glow-cyan"></span>
          <span class="text-slate-300 text-[11px]">VISITAS TOTALES</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-glow-green"></span>
          <span class="text-slate-300 text-[11px]">LEADS GENERADOS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DailyVisit } from '@/types'

const props = defineProps<{
  data: DailyVisit[]
}>()

const maxVisits = computed(() => {
  const max = Math.max(...props.data.map(d => d.visitas || 0), 1)
  return Math.ceil(max * 1.15)
})
</script>
