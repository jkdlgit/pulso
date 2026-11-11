<template>
  <div class="hud-card group" :class="paused ? 'opacity-70 border-slate-800' : ''">
    <!-- Top label & icon -->
    <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
      <span class="tracking-wider uppercase text-[11px] font-semibold group-hover:text-cyan-300 transition-colors">
        // {{ label }}
      </span>
      <div class="w-7 h-7 rounded-lg bg-pulso-surface border border-pulso-border/80 flex items-center justify-center text-sm shadow-sm group-hover:border-cyan-500/40 transition-colors">
        {{ icon }}
      </div>
    </div>

    <!-- Main Value or Paused Badge -->
    <div class="flex items-center justify-between my-1">
      <div class="text-3xl font-tech font-bold tracking-wider text-slate-100 group-hover:text-cyan-200 transition-colors">
        {{ paused ? '—' : value }}
      </div>
      <span v-if="paused" class="badge badge-amber text-[9px] py-0 px-2 font-mono">
        PAUSADO
      </span>
    </div>

    <!-- Delta badge or subtitle -->
    <div class="flex items-center gap-2 text-xs font-mono mt-2 pt-2 border-t border-pulso-border/50">
      <span
        v-if="delta !== undefined && !paused"
        class="inline-flex items-center gap-1 font-semibold"
        :class="delta >= 0 ? 'text-emerald-400' : 'text-rose-400'"
      >
        <span>{{ delta >= 0 ? '▲' : '▼' }}</span>
        <span>{{ Math.abs(delta) }}%</span>
      </span>
      <span class="text-[10px] text-slate-500 font-mono truncate">
        {{ paused ? (note || 'Esperando integración de sistema') : (note || (delta !== undefined ? 'vs periodo anterior' : 'Etapa telemétrica')) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  delta?: number
  icon?: string
  color?: 'green' | 'yellow' | 'accent'
  paused?: boolean
  note?: string
}>()
</script>
