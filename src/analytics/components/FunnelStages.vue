<template>
  <div class="space-y-2.5">
    <div v-for="(stage, i) in stages" :key="stage.key" class="group">
      <div class="flex items-center justify-between gap-2 text-[10px] font-mono mb-1">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-4 h-4 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[8px] text-cyan-300 font-bold flex-shrink-0">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <span class="text-slate-300 truncate group-hover:text-cyan-300 transition-colors">{{ stage.label }}</span>
          <span v-if="stage.avgHours" class="text-[8px] text-slate-600 hidden sm:inline">~{{ stage.avgHours }}h</span>
        </div>
        <div class="flex items-center gap-2.5 flex-shrink-0">
          <span class="text-slate-500 text-[9px]">{{ stage.count.toLocaleString() }}</span>
          <span class="text-cyan-300 font-bold w-11 text-right">{{ stage.pct }}%</span>
        </div>
      </div>
      <div class="relative w-full h-2.5 rounded bg-pulso-void border border-pulso-border/60 overflow-hidden">
        <div
          class="h-full rounded-sm bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 transition-all duration-700"
          :style="{ width: `${Math.max(stage.count > 0 ? 1.5 : 0, stage.pct)}%` }"
        ></div>
      </div>
      <div v-if="i < stages.length - 1 && stage.count > 0" class="mt-0.5 pl-6 text-[8px] font-mono text-rose-400/80">
        <span v-if="stage.dropPct > 0">↳ −{{ stage.dropPct }}% · {{ stage.count - stages[i + 1].count }} personas no avanzan</span>
        <span v-else class="text-emerald-400/70">↳ sin pérdida en esta etapa</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FunnelStage } from '../types'
defineProps<{ stages: FunnelStage[] }>()
</script>
