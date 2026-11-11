<template>
  <div class="hud-card border-l-2 group" :style="{ borderLeftColor: meta.color }">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5 min-w-0">
        <div
          class="w-8 h-8 rounded-lg border flex items-center justify-center text-sm flex-shrink-0"
          :style="{ borderColor: meta.border, background: meta.bg, color: meta.color }"
        >
          {{ meta.icon }}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-0.5">
            <span class="badge text-[8px] py-0 px-1.5" :style="{ color: meta.color, borderColor: meta.border, background: meta.bg }">
              {{ insight.category.toUpperCase() }}
            </span>
            <span class="badge badge-muted text-[8px] py-0 px-1.5">P{{ insight.priority }}</span>
            <span class="badge text-[8px] py-0 px-1.5" :class="confidenceClass">
              CONFIANZA {{ insight.confidence.toUpperCase() }}
            </span>
          </div>
          <h4 class="font-tech text-[13px] font-bold text-slate-100 leading-snug group-hover:text-cyan-200 transition-colors">
            {{ insight.title }}
          </h4>
          <p class="text-[10px] font-mono text-slate-400 mt-1 leading-relaxed">{{ insight.finding }}</p>
        </div>
      </div>

      <div class="text-right flex-shrink-0 hidden sm:block">
        <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">{{ insight.metric_label }}</p>
        <p class="font-tech text-lg font-bold" :style="{ color: meta.color }">{{ insight.metric_value }}</p>
        <p v-if="insight.comparison" class="text-[8px] font-mono text-slate-600 max-w-[150px]">{{ insight.comparison }}</p>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div class="p-2 rounded-lg bg-pulso-void/60 border border-pulso-border/50">
        <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">Evidencia</p>
        <p class="text-[10px] font-mono text-slate-400 leading-relaxed">{{ insight.evidence }}</p>
      </div>
      <div class="p-2 rounded-lg bg-pulso-void/60 border border-pulso-border/50">
        <p class="text-[8px] font-mono uppercase tracking-wider text-cyan-500 mb-0.5">Recomendación</p>
        <p class="text-[10px] font-mono text-slate-300 leading-relaxed">{{ insight.recommendation }}</p>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-3 text-[8px] font-mono text-slate-500">
        <span>IMPACTO: <strong :class="impactClass(insight.expected_impact)">{{ insight.expected_impact.toUpperCase() }}</strong></span>
        <span>ESFUERZO: <strong class="text-slate-300">{{ insight.effort.toUpperCase() }}</strong></span>
        <span>MUESTRA: <strong class="text-slate-300">{{ insight.data_points.toLocaleString() }}</strong></span>
      </div>
      <button @click="open = !open" class="text-[9px] font-mono text-cyan-400 hover:text-cyan-200">
        {{ open ? 'OCULTAR ACCIONES ▲' : 'VER ACCIONES ▼' }}
      </button>
    </div>

    <div v-if="open" class="mt-2 pt-2 border-t border-pulso-border/50 flex flex-wrap gap-1.5">
      <span v-for="a in insight.actions" :key="a" class="badge badge-cyan text-[9px]">→ {{ a }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Insight } from '../types'

const props = defineProps<{ insight: Insight }>()
const open = ref(false)

const MAP: Record<string, { color: string; border: string; bg: string; icon: string }> = {
  good: { color: '#34d399', border: 'rgba(16,185,129,.4)', bg: 'rgba(16,185,129,.1)', icon: '✅' },
  bad: { color: '#fb7185', border: 'rgba(244,63,94,.4)', bg: 'rgba(244,63,94,.1)', icon: '🚨' },
  warn: { color: '#fbbf24', border: 'rgba(245,158,11,.4)', bg: 'rgba(245,158,11,.1)', icon: '⚠️' },
  info: { color: '#38bdf8', border: 'rgba(56,189,248,.4)', bg: 'rgba(56,189,248,.1)', icon: '💡' },
}
const meta = computed(() => MAP[props.insight.severity] || MAP.info)
const confidenceClass = computed(() => props.insight.confidence === 'alta' ? 'badge-green' : props.insight.confidence === 'media' ? 'badge-amber' : 'badge-muted')
const impactClass = (v: string) => v === 'alto' ? 'text-rose-300' : v === 'medio' ? 'text-amber-300' : 'text-slate-300'
</script>
