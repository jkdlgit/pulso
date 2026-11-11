<template>
  <PageHeader
    code="18 // EXPERIMENTS & OPTIMIZATION"
    title="Experimentos y optimización"
    description="Pruebas A/B con hipótesis, variantes, período, métrica principal y nivel de confianza. No se declara un ganador cuando el volumen es insuficiente."
  >
    <template #actions>
      <span class="badge badge-violet text-[9px]">{{ experiments.length }} EXPERIMENTOS</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Total" :value="number(experiments.length)" icon="🧪" />
      <StatCard label="En curso" :value="number(countBy('en_curso'))" icon="▶️" tone="cyan" />
      <StatCard label="Finalizados" :value="number(countBy('finalizado'))" icon="✅" tone="green" />
      <StatCard label="Implementados" :value="number(countBy('implementar'))" icon="🚀" tone="green" />
      <StatCard label="Descartados" :value="number(countBy('descartar'))" icon="✕" tone="rose" />
      <StatCard label="A repetir" :value="number(countBy('repetir'))" icon="🔁" tone="amber" />
      <StatCard label="Confianza media" :value="`${avgConfidence}%`" icon="📊" tone="violet" />
      <StatCard label="Ganancia estimada" :value="`${estimatedLift}`" icon="📈" tone="green" note="Puntos de conversión" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Resultados de experimentos"
        subtitle="Conversión por variante"
        type="bar"
        :data="allVariantsChart"
        :height="260"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Nivel de confianza"
        subtitle="Confianza declarada por prueba"
        type="bar"
        :data="confidenceChart"
        :height="260"
        :options="barOptions"
      />
    </div>

    <div class="space-y-4">
      <div v-for="exp in experiments" :key="exp.id" class="hud-card">
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-3 pb-3 border-b border-pulso-border/50">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="badge badge-cyan text-[8px]">{{ businessName(exp.business_id) }}</span>
              <span class="badge text-[8px]" :class="statusClass(exp.status)">{{ exp.status.replace('_', ' ').toUpperCase() }}</span>
              <span class="badge text-[8px]" :class="exp.confidence >= 90 ? 'badge-green' : exp.confidence >= 75 ? 'badge-amber' : 'badge-rose'">
                CONFIANZA {{ exp.confidence }}%
              </span>
            </div>
            <h3 class="font-tech text-sm font-bold text-slate-100">{{ exp.name }}</h3>
            <p class="text-[10px] font-mono text-slate-400 mt-1 leading-relaxed">{{ exp.hypothesis }}</p>
          </div>
          <div class="flex-shrink-0 text-right">
            <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">DECISIÓN</p>
            <p class="font-tech text-sm font-bold" :class="decisionColor(exp.decision)">{{ decisionLabel(exp.decision) }}</p>
            <p class="text-[8px] font-mono text-slate-600">{{ formatDate(exp.started_on) }} → {{ exp.ended_on ? formatDate(exp.ended_on) : 'En curso' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="(v, i) in exp.variants" :key="i" class="p-2.5 rounded-lg bg-pulso-void/50 border" :class="isWinner(exp, v) ? 'border-emerald-500/40' : 'border-pulso-border/50'">
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-mono text-slate-300 truncate">{{ v.name }}</span>
                <span v-if="isWinner(exp, v)" class="badge badge-green text-[7px] py-0 px-1">MEJOR</span>
              </div>
              <p class="font-tech text-lg font-bold mt-0.5" :class="conversionColor(v)">{{ rate(v) }}%</p>
              <div class="h-1.5 rounded bg-pulso-void overflow-hidden mt-1">
                <div class="h-full" :class="isWinner(exp, v) ? 'bg-emerald-400' : 'bg-cyan-400/70'" :style="{ width: `${rate(v)}%` }"></div>
              </div>
              <p class="text-[8px] font-mono text-slate-600 mt-0.5">{{ v.conversions }} / {{ v.visitors }} visitantes</p>
            </div>
          </div>

          <div class="p-2.5 rounded-lg bg-pulso-void/60 border border-pulso-border/50">
            <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500 mb-1">Conclusión</p>
            <p class="text-[10px] font-mono text-slate-300 leading-relaxed">{{ exp.result }}</p>
            <p class="text-[8px] font-mono text-slate-600 mt-2">MÉTRICA: {{ exp.metric }} · ELEMENTO: {{ exp.element }}</p>
            <div v-if="exp.confidence < 80" class="mt-2 p-1.5 rounded bg-amber-500/5 border border-amber-500/25 text-[8px] font-mono text-amber-200/80">
              Muestra insuficiente: no se declara ganador definitivo.
            </div>
          </div>
        </div>
      </div>

      <div v-if="experiments.length === 0" class="hud-card py-16 text-center text-[10px] font-mono text-slate-500">
        Sin experimentos registrados para el negocio seleccionado.
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import { useAnalytics } from '../store'
import { formatDate, number } from '../engine'
import type { Experiment } from '../types'

const { dataset, filters } = useAnalytics()

const experiments = computed(() =>
  dataset.value.experiments.filter(e => filters.business === 'all' || e.business_id === filters.business)
)

const countBy = (value: string) =>
  experiments.value.filter(e => e.status === value || e.decision === value).length

const avgConfidence = computed(() =>
  experiments.value.length
    ? Math.round(experiments.value.reduce((a, e) => a + e.confidence, 0) / experiments.value.length)
    : 0
)

const estimatedLift = computed(() => {
  let total = 0
  experiments.value.forEach(e => {
    if (e.variants.length < 2) return
    const rates = e.variants.map(v => (v.visitors ? (v.conversions / v.visitors) * 100 : 0))
    total += Math.max(...rates) - Math.min(...rates)
  })
  return `${total.toFixed(1)} pts`
})

const rate = (v: { visitors: number; conversions: number }) => (v.visitors ? Number(((v.conversions / v.visitors) * 100).toFixed(1)) : 0)
const conversionColor = (v: { visitors: number; conversions: number }) => (rate(v) >= 50 ? 'text-emerald-300' : 'text-cyan-300')
const isWinner = (exp: Experiment, v: { visitors: number; conversions: number }) => {
  if (exp.confidence < 80) return false
  const best = [...exp.variants].sort((a, b) => rate(b) - rate(a))[0]
  return best === v
}

const allVariantsChart = computed(() => {
  const exp = experiments.value[0]
  if (!exp) return { labels: [], datasets: [] }
  return {
    labels: exp.variants.map(v => v.name.length > 24 ? `${v.name.slice(0, 23)}…` : v.name),
    datasets: [{
      label: 'Conversión %',
      data: exp.variants.map(v => rate(v)),
      backgroundColor: exp.variants.map((v, i) => (i === 0 ? '#64748bbb' : '#38bdf8bb')),
      borderRadius: 4,
    }],
  }
})

const confidenceChart = computed(() => ({
  labels: experiments.value.map(e => e.name.length > 18 ? `${e.name.slice(0, 17)}…` : e.name),
  datasets: [{
    label: 'Confianza %',
    data: experiments.value.map(e => e.confidence),
    backgroundColor: experiments.value.map(e => (e.confidence >= 90 ? '#10b981bb' : e.confidence >= 75 ? '#f59e0bbb' : '#f43f5eaa')),
    borderRadius: 4,
  }],
}))

function businessName(id: string) {
  return dataset.value.businesses.find(b => b.id === id)?.emoji + ' ' + (dataset.value.businesses.find(b => b.id === id)?.name || id)
}
function statusClass(s: string) {
  return s === 'finalizado' ? 'badge-green' : s === 'en_curso' ? 'badge-cyan' : 'badge-muted'
}
function decisionColor(d: string) {
  return d === 'implementar' ? 'text-emerald-300' : d === 'descartar' ? 'text-rose-300' : d === 'repetir' ? 'text-amber-300' : 'text-slate-400'
}
function decisionLabel(d: string) {
  return d === 'sin_decision' ? 'SIN DECISIÓN' : d.replace('_', ' ').toUpperCase()
}

const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, max: 100, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const groupedOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, max: 100, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
</script>
