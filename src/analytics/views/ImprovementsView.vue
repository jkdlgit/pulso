<template>
  <PageHeader
    code="20 // IMPROVEMENT TRACKING"
    title="Seguimiento de mejoras"
    description="Registro de las acciones implementadas: problema, recomendación, responsable, fecha, indicador objetivo y comparación antes/después. Permite comprobar si la mejora funcionó."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ improvements.length }} INICIATIVAS</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Total" :value="number(improvements.length)" icon="📋" />
      <StatCard label="Pendientes" :value="number(count('pendiente'))" icon="⏳" tone="amber" />
      <StatCard label="En curso" :value="number(count('en_curso'))" icon="▶️" tone="cyan" />
      <StatCard label="Implementadas" :value="number(count('implementada'))" icon="🚀" tone="violet" />
      <StatCard label="Evaluadas" :value="number(count('evaluada'))" icon="✅" tone="green" />
      <StatCard label="Mejora media" :value="`${avgDelta}`" icon="📈" tone="green" note="Cambio antes → después" />
      <StatCard label="Confirmadas" :value="number(confirmed)" icon="🎯" tone="green" note="Mejora positiva" />
      <StatCard label="Sin efecto" :value="number(noEffect)" icon="➖" tone="slate" note="Cambio nulo o negativo" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Resultado antes vs después"
        subtitle="Valor del indicador por iniciativa"
        type="bar"
        :data="beforeAfterChart"
        :height="260"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Estado de las iniciativas"
        subtitle="Distribución del ciclo de vida"
        type="doughnut"
        :data="statusChart"
        :height="260"
        :options="doughnutOptions"
      />
    </div>

    <div class="space-y-3">
      <div v-for="imp in improvements" :key="imp.id" class="hud-card">
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="badge badge-cyan text-[8px]">{{ businessName(imp.business_id) }}</span>
              <span class="badge text-[8px]" :class="statusClass(imp.status)">{{ imp.status.replace('_', ' ').toUpperCase() }}</span>
              <span class="text-[8px] font-mono text-slate-600">{{ formatDate(imp.implemented_at) }} · {{ imp.owner }}</span>
            </div>
            <h3 class="font-tech text-[13px] font-bold text-slate-100 leading-snug">{{ imp.problem }}</h3>
            <p class="text-[10px] font-mono text-slate-400 mt-1">
              <span class="text-cyan-400">Recomendación:</span> {{ imp.recommendation }}
            </p>
            <p class="text-[10px] font-mono text-slate-400 mt-0.5">
              <span class="text-emerald-400">Acción:</span> {{ imp.action }}
            </p>
            <p class="text-[9px] font-mono text-slate-500 mt-1 italic">{{ imp.conclusion }}</p>
          </div>

          <div class="flex-shrink-0 flex items-center gap-4">
            <div class="text-center">
              <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">Antes</p>
              <p class="font-tech text-lg font-bold text-slate-400">{{ imp.before_value }}{{ imp.unit === '%' ? '%' : '' }}</p>
            </div>
            <div class="text-center">
              <p class="text-[8px] font-mono text-slate-600">→</p>
            </div>
            <div class="text-center">
              <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">Después</p>
              <p class="font-tech text-lg font-bold" :class="deltaTone(imp)">{{ imp.after_value }}{{ imp.unit === '%' ? '%' : '' }}</p>
            </div>
            <div class="text-center pl-3 border-l border-pulso-border/60">
              <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">Cambio</p>
              <p class="font-tech text-base font-bold" :class="deltaTone(imp)">{{ deltaLabel(imp) }}</p>
              <p class="text-[8px] font-mono text-slate-600">{{ imp.metric }}</p>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-pulso-border/40">
          <div class="flex items-center gap-1">
            <span
              v-for="stage in stages"
              :key="stage"
              class="flex-1 h-1 rounded-full"
              :class="stageIndex(imp.status) >= stageIndex(stage) ? 'bg-emerald-400' : 'bg-slate-800'"
              :title="stage"
            ></span>
          </div>
          <div class="flex items-center justify-between mt-1 text-[8px] font-mono text-slate-600">
            <span v-for="stage in stages" :key="stage" :class="stageIndex(imp.status) >= stageIndex(stage) ? 'text-emerald-400/80' : ''">
              {{ stage }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="improvements.length === 0" class="hud-card py-16 text-center text-[10px] font-mono text-slate-500">
        Sin iniciativas registradas para el negocio seleccionado.
      </div>
    </div>

    <div class="hud-card mt-4">
      <div class="flex items-start gap-2">
        <span class="text-lg">🧪</span>
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Cómo evaluar una mejora</h3>
          <p class="text-[9px] font-mono text-slate-400 mt-1 leading-relaxed">
            Definir un indicador, medir el valor anterior, aplicar el cambio y dejar pasar un período de evaluación suficiente
            (mínimo 14 días o el volumen necesario). Comparar con el período anterior y con el resto del negocio para evitar
            atribuir a la mejora cambios producidos por estacionalidad u otras acciones simultáneas.
          </p>
        </div>
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
import type { Improvement } from '../types'

const { dataset, filters } = useAnalytics()

const improvements = computed(() =>
  dataset.value.improvements.filter(i => filters.business === 'all' || i.business_id === filters.business)
)

const stages = ['pendiente', 'en_curso', 'implementada', 'evaluada']

const count = (status: string) => improvements.value.filter(i => i.status === status).length
const delta = (i: Improvement) => i.after_value - i.before_value
const avgDelta = computed(() => {
  if (!improvements.value.length) return '0'
  const values = improvements.value.map(i => {
    if (i.unit === '%') return delta(i)
    return i.before_value ? (delta(i) / i.before_value) * 100 : 0
  })
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  return `${avg >= 0 ? '+' : ''}${avg.toFixed(1)}${improvements.value[0].unit === '%' ? ' pts' : '%'}`
})
const confirmed = computed(() => improvements.value.filter(i => delta(i) > 0).length)
const noEffect = computed(() => improvements.value.filter(i => delta(i) <= 0).length)

const beforeAfterChart = computed(() => ({
  labels: improvements.value.map(i => i.metric.length > 20 ? `${i.metric.slice(0, 19)}…` : i.metric),
  datasets: [
    { label: 'Antes', data: improvements.value.map(i => i.before_value), backgroundColor: '#64748bbb', borderRadius: 4 },
    { label: 'Después', data: improvements.value.map(i => i.after_value), backgroundColor: '#10b981bb', borderRadius: 4 },
  ],
}))

const statusChart = computed(() => ({
  labels: ['Pendiente', 'En curso', 'Implementada', 'Evaluada'],
  datasets: [{
    data: [count('pendiente'), count('en_curso'), count('implementada'), count('evaluada')],
    backgroundColor: ['#f59e0bcc', '#38bdf8cc', '#8b5cf6cc', '#10b981cc'],
    borderWidth: 1,
  }],
}))

function businessName(id: string) {
  const b = dataset.value.businesses.find(x => x.id === id)
  return b ? `${b.emoji} ${b.name}` : id
}
function statusClass(s: string) {
  return s === 'evaluada' ? 'badge-green' : s === 'implementada' ? 'badge-violet' : s === 'en_curso' ? 'badge-cyan' : 'badge-amber'
}
function deltaTone(i: Improvement) {
  return delta(i) > 0 ? 'text-emerald-300' : delta(i) < 0 ? 'text-rose-300' : 'text-slate-400'
}
function deltaLabel(i: Improvement) {
  const d = delta(i)
  return `${d > 0 ? '+' : ''}${Number(d.toFixed(1))}${i.unit === '%' ? ' pts' : ''}`
}
function stageIndex(s: string) {
  return Math.max(0, stages.indexOf(s))
}

const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
</script>
