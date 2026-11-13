<template>
  <aside class="w-[248px] flex-shrink-0 bg-pulso-surface/95 border-r border-pulso-border/80 flex flex-col h-full">
    <!-- Brand -->
    <RouterLink to="/analytics/overview" class="h-14 px-4 flex items-center gap-2.5 border-b border-pulso-border/70 flex-shrink-0 group">
      <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan group-hover:bg-cyan-500 group-hover:text-pulso-void transition-all">
        📡
      </div>
      <div class="min-w-0">
        <p class="font-tech text-[13px] tracking-widest font-bold text-slate-100 leading-none">PULSO</p>
        <p class="font-mono text-[9px] tracking-[0.22em] text-cyan-400 leading-none mt-1">ANALYTICS</p>
      </div>
    </RouterLink>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
      <div v-for="group in NAV" :key="group.label">
        <p class="px-2 mb-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">{{ group.label }}</p>
        <div class="space-y-0.5">
          <RouterLink
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="group flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[11px] font-mono border transition-all duration-150"
            :class="isActive(item.path)
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-glow-cyan'
              : 'text-slate-400 border-transparent hover:bg-pulso-card/60 hover:text-slate-200'"
          >
            <span class="text-[13px] w-4 text-center flex-shrink-0">{{ item.icon }}</span>
            <span class="truncate flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="text-[8px] px-1 py-0.5 rounded border font-bold"
              :class="item.badge === 'AGENT' ? 'text-cyan-200 border-cyan-400/50 bg-cyan-500/20 shadow-glow-cyan' : item.badge === 'IA' ? 'text-violet-300 border-violet-500/40 bg-violet-500/10' : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'"
            >
              {{ item.badge }}
            </span>
            <span v-else class="text-[8px] text-slate-700 group-hover:text-cyan-500">{{ item.code }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-3 border-t border-pulso-border/60 flex-shrink-0">
      <div class="p-2.5 rounded-lg bg-pulso-void/70 border border-pulso-border/70">
        <div class="flex items-center justify-between text-[9px] font-mono mb-1">
          <span class="text-slate-500 uppercase tracking-wider">Esquema</span>
          <span class="badge badge-green text-[8px] py-0 px-1.5">{{ schema }}</span>
        </div>
        <div class="flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span>Modo</span>
          <span :class="mode === 'live' ? 'text-emerald-400' : 'text-amber-400'">{{ mode === 'live' ? 'LIVE DATA' : 'DEMO DATA' }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAnalytics } from '../store'
import { analyticsSchema } from '../supabaseAnalytics'

const route = useRoute()
const { dataset } = useAnalytics()
const mode = computed(() => dataset.value.mode)
const schema = analyticsSchema

const NAV = [
  {
    label: 'Inteligencia & Decisión',
    items: [
      { path: '/analytics/command-center', label: 'Centro de Mando', icon: '🚀', code: '00', badge: 'AGENT' },
      { path: '/analytics/overview', label: 'Overview', icon: '📊', code: '01' },
      { path: '/analytics/insights', label: 'AI Insights', icon: '🧠', code: '19', badge: 'IA' },
    ],
  },
  {
    label: 'Audiencia',
    items: [
      { path: '/analytics/visitors', label: 'Visitantes', icon: '👤', code: '02' },
      { path: '/analytics/live', label: 'Actividad en vivo', icon: '⚡', code: '03', badge: 'LIVE' },
      { path: '/analytics/segments', label: 'Segmentos', icon: '🎯', code: '15' },
      { path: '/analytics/devices', label: 'Dispositivos', icon: '📱', code: '17' },
    ],
  },
  {
    label: 'Adquisición y experiencia',
    items: [
      { path: '/analytics/acquisition', label: 'Campañas', icon: '📣', code: '04' },
      { path: '/analytics/behavior', label: 'Comportamiento', icon: '🧭', code: '05' },
      { path: '/analytics/heatmaps', label: 'Mapas de calor', icon: '🔥', code: '06' },
      { path: '/analytics/replay', label: 'Session replay', icon: '🎬', code: '07' },
    ],
  },
  {
    label: 'Conversión y comercial',
    items: [
      { path: '/analytics/evaluations', label: 'Evaluaciones', icon: '📝', code: '08' },
      { path: '/analytics/forms', label: 'Formularios y leads', icon: '🧾', code: '09' },
      { path: '/analytics/funnels', label: 'Embudos', icon: '🔻', code: '10' },
      { path: '/analytics/journeys', label: 'Recorridos', icon: '🗺️', code: '11' },
      { path: '/analytics/appointments', label: 'Citas', icon: '📅', code: '12' },
      { path: '/analytics/followup', label: 'Seguimiento', icon: '💬', code: '13' },
      { path: '/analytics/sales', label: 'Ventas', icon: '💳', code: '14' },
    ],
  },
  {
    label: 'Optimización',
    items: [
      { path: '/analytics/temporal', label: 'Análisis temporal', icon: '🕒', code: '16' },
      { path: '/analytics/experiments', label: 'Experimentos', icon: '🧪', code: '18' },
      { path: '/analytics/improvements', label: 'Seguimiento de mejoras', icon: '📈', code: '20' },
    ],
  },
  {
    label: 'Administración',
    items: [
      { path: '/analytics/businesses', label: 'Negocios', icon: '🏢', code: '21' },
      { path: '/analytics/settings', label: 'Privacidad y datos', icon: '🛡️', code: '22' },
    ],
  },
]

function isActive(path: string) {
  return route.path === path
}
</script>
