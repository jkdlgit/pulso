<template>
  <div class="space-y-3.5">
    <div v-if="steps.length > 0" class="space-y-3.5">
      <div
        v-for="(step, index) in steps"
        :key="step.label"
        class="space-y-1.5 group"
        :class="step.status === 'PAUSADO' ? 'opacity-50' : ''"
      >
        <div class="flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-2.5">
            <span class="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
              0{{ index + 1 }}
            </span>
            <span class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
              {{ step.label.toUpperCase() }}
            </span>
            <span v-if="step.status === 'PAUSADO'" class="badge badge-amber text-[9px] py-0 px-1.5">
              PAUSADO
            </span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-slate-500 text-[11px]">{{ step.status === 'PAUSADO' ? '—' : `${step.count.toLocaleString()} EVENTOS` }}</span>
            <span class="font-bold text-cyan-300 text-xs w-12 text-right">
              {{ step.status === 'PAUSADO' ? '—' : `${step.pct}%` }}
            </span>
          </div>
        </div>

        <!-- Funnel Bar with Cyber Neon Gradient -->
        <div class="w-full bg-pulso-void h-3 rounded overflow-hidden p-0.5 border border-pulso-border/70">
          <div
            v-if="step.status !== 'PAUSADO'"
            class="h-full rounded-sm bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 group-hover:from-cyan-400 group-hover:to-emerald-300 transition-all duration-500 ease-out shadow-sm"
            :style="{
              width: `${step.pct}%`,
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)'
            }"
          ></div>
          <div v-else class="h-full rounded-sm bg-slate-800 w-full opacity-40"></div>
        </div>

        <!-- Drop-off indicator between active steps -->
        <div
          v-if="index < steps.length - 1 && step.status !== 'PAUSADO' && steps[index + 1].status !== 'PAUSADO'"
          class="text-[10px] font-mono text-rose-400/80 flex items-center gap-2 pl-7"
        >
          <span>↳ DROP-OFF:</span>
          <span class="font-semibold text-rose-300">-{{ dropOff(index) }}%</span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="py-8 text-center font-mono">
      <span class="text-xs text-slate-400 font-semibold">// EMBUDO EN ESPERA</span>
      <p class="text-[10px] text-slate-500 mt-1">El embudo se compilará con los pasos completados.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FunnelStep } from '@/types'

const props = defineProps<{
  steps: FunnelStep[]
}>()

function dropOff(idx: number): string {
  const current = props.steps[idx].pct
  const next = props.steps[idx + 1].pct
  return (current - next).toFixed(1)
}
</script>
