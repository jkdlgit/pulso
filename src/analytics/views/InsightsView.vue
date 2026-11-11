<template>
  <PageHeader
    code="19 // AI INSIGHTS"
    title="Centro de inteligencia y optimización"
    description="Qué está funcionando, qué no y qué conviene mejorar. Cada hallazgo muestra su evidencia, el indicador que lo respalda, el volumen de datos y su nivel de confianza. Ningún hallazgo se presenta como certeza causal."
  >
    <template #tag>
      <span class="badge badge-violet">MOTOR DE HALLAZGOS</span>
    </template>
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ filteredInsights.length }} HALLAZGOS</span>
      <button class="btn-hud-secondary text-[10px] py-1.5" @click="exportFindings">📥 EXPORTAR</button>
    </template>

    <!-- Resumen ejecutivo -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-4">
      <div class="hud-card border-l-2 border-l-emerald-500 py-3">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500">Funcionando</span>
          <span class="text-emerald-400">✅</span>
        </div>
        <p class="font-tech text-2xl font-bold text-emerald-300 mt-0.5">{{ counts.good }}</p>
        <p class="text-[8px] font-mono text-slate-600">Elementos con mejores resultados</p>
      </div>
      <div class="hud-card border-l-2 border-l-rose-500 py-3">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500">No funciona</span>
          <span class="text-rose-400">🚨</span>
        </div>
        <p class="font-tech text-2xl font-bold text-rose-300 mt-0.5">{{ counts.bad }}</p>
        <p class="text-[8px] font-mono text-slate-600">Problemas confirmados por datos</p>
      </div>
      <div class="hud-card border-l-2 border-l-amber-500 py-3">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500">A vigilar</span>
          <span class="text-amber-400">⚠️</span>
        </div>
        <p class="font-tech text-2xl font-bold text-amber-300 mt-0.5">{{ counts.warn }}</p>
        <p class="text-[8px] font-mono text-slate-600">Señales que requieren revisión</p>
      </div>
      <div class="hud-card border-l-2 border-l-cyan-500 py-3">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500">Prioridad alta</span>
          <span class="text-cyan-400">🎯</span>
        </div>
        <p class="font-tech text-2xl font-bold text-cyan-300 mt-0.5">{{ counts.highImpact }}</p>
        <p class="text-[8px] font-mono text-slate-600">Impacto alto y esfuerzo bajo/medio</p>
      </div>
    </div>

    <!-- Filtros del centro de inteligencia -->
    <div class="hud-card mb-4 py-3">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500 mr-1">Severidad:</span>
          <button
            v-for="s in severities"
            :key="s.id"
            @click="severity = s.id"
            class="px-2.5 py-1 rounded text-[9px] font-mono border transition-all"
            :class="severity === s.id ? s.activeClass : 'text-slate-400 border-pulso-border/60 hover:text-slate-200'"
          >
            {{ s.label }} <span class="text-[8px] opacity-70">{{ s.count }}</span>
          </button>
          <div class="flex-1"></div>
          <select v-model="sortBy" class="bg-pulso-void border border-pulso-border rounded-lg px-2 py-1.5 text-[9px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400">
            <option value="priority">Ordenar: prioridad</option>
            <option value="impact">Ordenar: impacto</option>
            <option value="confidence">Ordenar: confianza</option>
          </select>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500 mr-1">Área:</span>
          <button
            v-for="c in categories"
            :key="c"
            @click="category = c"
            class="px-2 py-1 rounded text-[8px] font-mono border transition-all"
            :class="category === c ? 'bg-violet-500/15 text-violet-300 border-violet-500/40' : 'text-slate-500 border-pulso-border/50 hover:text-slate-300'"
          >
            {{ c }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <!-- Lista de hallazgos -->
      <div class="xl:col-span-3 space-y-3">
        <InsightCard v-for="i in filteredInsights" :key="i.id" :insight="i" />

        <div v-if="filteredInsights.length === 0" class="hud-card py-16 text-center">
          <p class="text-[11px] font-mono text-slate-400">// SIN HALLAZGOS PARA ESTOS FILTROS</p>
          <p class="text-[9px] font-mono text-slate-600 mt-1">Amplía el período o cambia el negocio seleccionado.</p>
        </div>
      </div>

      <!-- Panel lateral -->
      <div class="space-y-4">
        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Distribución por área
          </h3>
          <div class="space-y-1.5">
            <div v-for="a in byCategory" :key="a.label" class="flex items-center justify-between text-[9px] font-mono">
              <span class="text-slate-400">{{ a.label }}</span>
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 rounded bg-pulso-void overflow-hidden">
                  <div class="h-full bg-violet-400" :style="{ width: `${a.pct}%` }"></div>
                </div>
                <span class="text-slate-300 w-4 text-right">{{ a.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Cómo leer un hallazgo
          </h3>
          <div class="space-y-2 text-[9px] font-mono text-slate-400 leading-relaxed">
            <p><span class="text-cyan-300 font-bold">Evidencia</span> — datos que respaldan el hallazgo.</p>
            <p><span class="text-emerald-300 font-bold">Confianza</span> — depende del volumen. Baja significa muestra insuficiente.</p>
            <p><span class="text-amber-300 font-bold">Impacto / esfuerzo</span> — ayuda a priorizar, no garantiza resultado.</p>
            <p><span class="text-rose-300 font-bold">Sin causalidad</span> — una correlación no prueba que A cause B.</p>
          </div>
        </div>

        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Enlazar con mejoras
          </h3>
          <p class="text-[9px] font-mono text-slate-400 leading-relaxed mb-2">
            Convierte un hallazgo en una acción registrada para medir su resultado antes y después.
          </p>
          <RouterLink to="/analytics/improvements" class="btn-hud text-[9px] py-1.5 w-full justify-center inline-flex">
            📈 IR A SEGUIMIENTO DE MEJORAS
          </RouterLink>
        </div>

        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Cobertura de datos
          </h3>
          <div class="space-y-2">
            <div v-for="c in coverage" :key="c.label" class="flex items-center justify-between text-[9px] font-mono">
              <span class="text-slate-500">{{ c.label }}</span>
              <span :class="c.ok ? 'text-emerald-300' : 'text-amber-300'">{{ c.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import InsightCard from '../components/InsightCard.vue'
import { useAnalytics } from '../store'
import type { Insight } from '../types'

const { insights, filtered, dataset } = useAnalytics()

const severity = ref<'all' | 'good' | 'bad' | 'warn' | 'info'>('all')
const category = ref('Todas')
const sortBy = ref<'priority' | 'impact' | 'confidence'>('priority')

const counts = computed(() => ({
  good: insights.value.filter(i => i.severity === 'good').length,
  bad: insights.value.filter(i => i.severity === 'bad').length,
  warn: insights.value.filter(i => i.severity === 'warn').length,
  highImpact: insights.value.filter(i => i.expected_impact === 'alto').length,
}))

const severities = computed(() => [
  { id: 'all' as const, label: 'Todos', count: insights.value.length, activeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' },
  { id: 'good' as const, label: '✅ Funciona', count: counts.value.good, activeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
  { id: 'bad' as const, label: '🚨 No funciona', count: counts.value.bad, activeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
  { id: 'warn' as const, label: '⚠️ A vigilar', count: counts.value.warn, activeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
])

const categories = computed(() => ['Todas', ...new Set(insights.value.map(i => i.category))])

const filteredInsights = computed(() => {
  let list = insights.value.filter(i =>
    (severity.value === 'all' || i.severity === severity.value) &&
    (category.value === 'Todas' || i.category === category.value)
  )
  const impactRank: Record<string, number> = { alto: 0, medio: 1, bajo: 2 }
  const confRank: Record<string, number> = { alta: 0, media: 1, baja: 2 }
  if (sortBy.value === 'impact') list = [...list].sort((a, b) => impactRank[a.expected_impact] - impactRank[b.expected_impact])
  else if (sortBy.value === 'confidence') list = [...list].sort((a, b) => confRank[a.confidence] - confRank[b.confidence])
  else list = [...list].sort((a, b) => a.priority - b.priority)
  return list
})

const byCategory = computed(() => {
  const map = new Map<string, number>()
  insights.value.forEach(i => map.set(i.category, (map.get(i.category) || 0) + 1))
  const max = Math.max(1, ...map.values())
  return [...map.entries()].map(([label, count]) => ({ label, count, pct: Math.round((count / max) * 100) }))
})

const coverage = computed(() => {
  const sessions = filtered.value.sessions.length
  const withUtm = filtered.value.sessions.filter(s => s.source !== 'directo').length
  const withQuiz = filtered.value.sessions.filter(s => s.quiz_started).length
  const withSale = filtered.value.sessions.filter(s => s.purchased).length
  return [
    { label: 'Sesiones analizadas', value: `${sessions}`, ok: sessions >= 50 },
    { label: 'Origen identificado', value: `${sessions ? Math.round((withUtm / sessions) * 100) : 0}%`, ok: sessions ? withUtm / sessions > 0.5 : false },
    { label: 'Evaluaciones registradas', value: `${withQuiz}`, ok: withQuiz > 0 },
    { label: 'Ventas vinculadas', value: `${withSale}`, ok: withSale > 0 },
    { label: 'Negocios', value: `${dataset.value.businesses.length}`, ok: true },
  ]
})

function exportFindings() {
  const rows = filteredInsights.value.map(i => [
    i.severity, i.category, `"${i.title.replace(/"/g, "'")}"`, `"${i.finding.replace(/"/g, "'")}"`,
    i.metric_label, i.metric_value, i.expected_impact, i.effort, i.confidence, i.priority,
  ])
  const csv = ['Severidad,Área,Hallazgo,Descripción,Indicador,Valor,Impacto,Esfuerzo,Confianza,Prioridad', ...rows.map(r => r.join(','))].join('\n')
  const link = document.createElement('a')
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  link.download = 'pulso_analytics_hallazgos.csv'
  link.click()
}

// Tipado explícito para el template
export type { Insight }
</script>
