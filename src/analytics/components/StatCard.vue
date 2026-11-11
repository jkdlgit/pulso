<template>
  <div class="hud-card flex flex-col" :class="`hud-tone-${tone}`">
    <div class="flex items-start justify-between gap-2 mb-1">
      <span class="text-[10px] font-mono uppercase tracking-widest text-slate-500">{{ label }}</span>
      <span v-if="icon" class="text-sm opacity-80">{{ icon }}</span>
    </div>
    <div class="flex items-end justify-between gap-2">
      <div class="text-[26px] leading-none font-tech font-bold tracking-wide text-slate-100">
        {{ value }}
      </div>
      <span
        v-if="delta !== null && delta !== undefined"
        class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
        :class="delta >= 0
          ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
          : 'text-rose-300 bg-rose-500/10 border-rose-500/30'"
      >
        {{ delta >= 0 ? '▲' : '▼' }} {{ Math.abs(delta) }}%
      </span>
    </div>
    <p v-if="note" class="mt-2 pt-2 border-t border-pulso-border/50 text-[10px] font-mono text-slate-500 truncate">
      {{ note }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  value: string | number
  delta?: number | null
  note?: string
  icon?: string
  tone?: 'cyan' | 'green' | 'amber' | 'rose' | 'violet' | 'slate'
}>(), { tone: 'cyan', delta: null })
</script>

<style scoped>
.hud-tone-green { border-color: rgba(16, 185, 129, 0.28); }
.hud-tone-amber { border-color: rgba(245, 158, 11, 0.28); }
.hud-tone-rose { border-color: rgba(244, 63, 94, 0.28); }
.hud-tone-violet { border-color: rgba(139, 92, 246, 0.28); }
</style>
