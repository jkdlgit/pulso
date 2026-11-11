<template>
  <PageHeader
    code="17 // DEVICE ANALYTICS"
    title="Comparación de dispositivos y experiencia"
    description="Diferencias de navegación, formularios, evaluaciones y conversión entre móvil, escritorio y tablet. El objetivo es detectar problemas de experiencia que afecten a un dispositivo concreto."
  >
    <template #actions>
      <span class="badge" :class="mobileGap > 0 ? 'badge-amber' : 'badge-green'">
        BRECHA MÓVIL {{ mobileGap > 0 ? `${mobileGap} pts` : 'sin brecha' }}
      </span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Móvil" :value="`${share('mobile')}%`" icon="📱" tone="cyan" note="Del tráfico" />
      <StatCard label="Escritorio" :value="`${share('desktop')}%`" icon="💻" tone="green" note="Del tráfico" />
      <StatCard label="Tablet" :value="`${share('tablet')}%`" icon="📟" tone="violet" note="Del tráfico" />
      <StatCard label="Conv. móvil" :value="`${conv('mobile')}%`" icon="🎯" tone="cyan" />
      <StatCard label="Conv. escritorio" :value="`${conv('desktop')}%`" icon="🎯" tone="green" />
      <StatCard label="Scroll móvil" :value="`${scroll('mobile')}%`" icon="📜" tone="amber" />
      <StatCard label="Errores móvil" :value="number(errors('mobile'))" icon="⚠️" tone="rose" />
      <StatCard label="Brecha de conversión" :value="`${mobileGap} pts`" icon="↔️" :tone="mobileGap > 0 ? 'rose' : 'green'" note="Escritorio − móvil" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Conversión por dispositivo"
        subtitle="Compradores / visitantes"
        type="bar"
        :data="conversionChart"
        :height="240"
        :options="barOptions"
      />
      <ChartCard
        title="Embudo por dispositivo"
        subtitle="Evaluación y formulario"
        type="bar"
        :data="funnelChart"
        :height="240"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Tiempo y scroll"
        subtitle="Duración media y profundidad"
        type="bar"
        :data="engagementChart"
        :height="230"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Sesiones con error"
        subtitle="Posible problema de experiencia"
        type="doughnut"
        :data="errorChart"
        :height="230"
        :options="doughnutOptions"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Matriz comparativa</h3>
          <span class="text-[9px] font-mono text-slate-500">TODAS LAS MÉTRICAS</span>
        </div>
        <DataTable :columns="columns" :rows="rows" row-key="key">
          <template #cell-label="{ row }">
            <span class="text-slate-200">{{ row.label }}</span>
          </template>
          <template #cell-conversion="{ row }">
            <span class="font-bold" :class="row.conversion >= avgConversion ? 'text-emerald-300' : 'text-rose-300'">{{ row.conversion }}%</span>
          </template>
          <template #cell-cpl="{ row }">
            <span class="text-amber-300">{{ currency(row.cpl) }}</span>
          </template>
        </DataTable>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Diagnóstico de experiencia
        </h3>
        <div class="space-y-2">
          <div class="p-2.5 rounded-lg" :class="mobileGap > 0 ? 'bg-rose-500/5 border border-rose-500/25' : 'bg-emerald-500/5 border border-emerald-500/25'">
            <p class="text-[10px] font-bold" :class="mobileGap > 0 ? 'text-rose-300' : 'text-emerald-300'">
              {{ mobileGap > 0 ? 'La experiencia móvil convierte peor' : 'Sin brecha relevante en móvil' }}
            </p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">
              Móvil {{ conv('mobile') }}% vs escritorio {{ conv('desktop') }}%.
              {{ mobileGap > 0 ? 'Auditar velocidad, botones y formulario en pantallas pequeñas.' : 'Mantener el monitoreo.' }}
            </p>
          </div>
          <div class="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/25">
            <p class="text-[10px] font-bold text-amber-300">Profundidad de lectura</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">
              Móvil: {{ scroll('mobile') }}% · Escritorio: {{ scroll('desktop') }}%.
              {{ scroll('mobile') < scroll('desktop') ? 'El contenido inferior podría no estar viéndose en móvil.' : 'Lectura similar entre dispositivos.' }}
            </p>
          </div>
          <div class="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/25">
            <p class="text-[10px] font-bold text-cyan-300">Errores técnicos</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">
              {{ errors('mobile') }} sesiones móviles y {{ errors('desktop') }} de escritorio con error registrado.
            </p>
          </div>
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
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { currency, deviceComparison, number } from '../engine'

const { filtered } = useAnalytics()

const rows = computed(() => deviceComparison(filtered.value))

const ratio = (key: string, total: number) => total ? Math.round(((rows.value.find(r => r.key === key)?.visitors || 0) / total) * 100) : 0
const totalVisitors = computed(() => filtered.value.visitors.length)
const share = (key: string) => ratio(key, totalVisitors.value)
const conv = (key: string) => rows.value.find(r => r.key === key)?.conversion || 0
const scroll = (key: string) => rows.value.find(r => r.key === key)?.scroll || 0
const errors = (key: string) => rows.value.find(r => r.key === key)?.errors || 0
const avgConversion = computed(() => {
  const total = filtered.value.sessions.length
  return total ? Math.round((filtered.value.sessions.filter(s => s.purchased).length / total) * 100) : 0
})
const mobileGap = computed(() => Number((conv('desktop') - conv('mobile')).toFixed(1)))

const conversionChart = computed(() => ({
  labels: rows.value.map(r => r.label),
  datasets: [{
    label: 'Conversión %',
    data: rows.value.map(r => r.conversion),
    backgroundColor: rows.value.map(r => `${r.color}cc`),
    borderColor: rows.value.map(r => r.color),
    borderWidth: 1,
    borderRadius: 4,
  }],
}))

const funnelChart = computed(() => ({
  labels: rows.value.map(r => r.label),
  datasets: [
    { label: 'Inició test', data: rows.value.map(r => r.quizRate), backgroundColor: '#8b5cf6bb', borderRadius: 4 },
    { label: 'Envió form', data: rows.value.map(r => r.formRate), backgroundColor: '#10b981bb', borderRadius: 4 },
    { label: 'Compró', data: rows.value.map(r => r.conversion), backgroundColor: '#f59e0bbb', borderRadius: 4 },
  ],
}))

const engagementChart = computed(() => ({
  labels: rows.value.map(r => r.label),
  datasets: [
    { label: 'Duración media (s)', data: rows.value.map(r => r.avgSeconds), backgroundColor: '#38bdf8bb', borderRadius: 4, yAxisID: 'y' },
    { label: 'Scroll medio (%)', data: rows.value.map(r => r.scroll), backgroundColor: '#10b981bb', borderRadius: 4, yAxisID: 'y1' },
  ],
}))

const errorChart = computed(() => ({
  labels: rows.value.map(r => `${r.label} · ${r.errors}`),
  datasets: [{ data: rows.value.map(r => r.errors), backgroundColor: ['#38bdf8cc', '#10b981cc', '#8b5cf6cc'], borderWidth: 1 }],
}))

const columns: Column[] = [
  { key: 'label', label: 'Dispositivo' },
  { key: 'visitors', label: 'Visitantes', align: 'right' },
  { key: 'sessions', label: 'Sesiones', align: 'right' },
  { key: 'conversion', label: 'Conversión', align: 'right' },
  { key: 'avgSeconds', label: 'Duración', align: 'right', format: r => `${r.avgSeconds}s` },
  { key: 'scroll', label: 'Scroll', align: 'right', format: r => `${r.scroll}%` },
  { key: 'quizRate', label: 'Test', align: 'right', format: r => `${r.quizRate}%` },
  { key: 'formRate', label: 'Form', align: 'right', format: r => `${r.formRate}%` },
  { key: 'errors', label: 'Errores', align: 'right' },
  { key: 'cpl', label: 'CPL', align: 'right' },
]

const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y1: { beginAtZero: true, position: 'right', grid: { display: false }, ticks: { color: '#64748b' }, max: 100 } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
void number
</script>
