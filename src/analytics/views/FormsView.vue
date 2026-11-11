<template>
  <PageHeader
    code="09 // FORMS & LEADS"
    title="Formularios y captación de leads"
    description="Qué campos generan fricción, cuánto tarda una persona en completar el formulario y qué calidad tienen los leads que produce."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">SOLO DATOS NECESARIOS</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Formularios vistos" :value="number(formViewed)" icon="👁️" note="Llegaron al resultado" />
      <StatCard label="Formularios iniciados" :value="number(formStarted)" icon="✍️" note="Primer campo enfocado" />
      <StatCard label="Formularios enviados" :value="number(formSubmitted)" icon="✅" tone="green" note="Leads capturados" />
      <StatCard label="Conversión del form" :value="`${formConversion}%`" icon="🎯" tone="green" note="Enviados / iniciados" />
      <StatCard label="Abandono del form" :value="`${formAbandon}%`" icon="🚪" tone="rose" note="Iniciados sin enviar" />
      <StatCard label="Tiempo medio" :value="`${avgFormSeconds}s`" icon="⏱️" note="Hasta enviar" />
      <StatCard label="Errores de campo" :value="number(totalErrors)" icon="⚠️" tone="amber" note="Validaciones fallidas" />
      <StatCard label="Lead → venta" :value="`${leadToSale}%`" icon="💳" tone="violet" note="Leads que compran" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Embudo del formulario"
        subtitle="Vistos → iniciados → enviados → ventas"
        type="bar"
        :data="formFunnelChart"
        :height="240"
        :options="barOptions"
        class="xl:col-span-2"
      />
      <ChartCard title="Tiempo de completado" subtitle="Distribución de duración" type="bar" :data="timeChart" :height="240" :options="barOptions" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Fricción por campo</h3>
          <span class="text-[9px] font-mono text-slate-500">ORDENADO POR ABANDONO</span>
        </div>
        <DataTable :columns="columns" :rows="fields" row-key="field">
          <template #cell-field="{ row }">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded bg-pulso-surface border border-pulso-border flex items-center justify-center text-[8px] text-cyan-300">▤</span>
              <span class="text-slate-200">{{ row.field }}</span>
              <span v-if="row.field === worstField.field" class="badge badge-rose text-[7px] py-0 px-1">CRÍTICO</span>
            </div>
          </template>
          <template #cell-abandonRate="{ row }">
            <div class="flex items-center justify-end gap-2">
              <div class="w-16 h-1.5 rounded bg-pulso-void overflow-hidden">
                <div class="h-full" :class="row.abandonRate > 10 ? 'bg-rose-400' : 'bg-cyan-400'" :style="{ width: `${Math.min(100, row.abandonRate * 4)}%` }"></div>
              </div>
              <span :class="row.abandonRate > 10 ? 'text-rose-300 font-bold' : 'text-slate-300'">{{ row.abandonRate }}%</span>
            </div>
          </template>
          <template #cell-errors="{ row }">
            <span :class="row.errors > 0 ? 'text-amber-300' : 'text-slate-600'">{{ row.errors }}</span>
          </template>
        </DataTable>
      </div>

      <div class="space-y-4">
        <ChartCard title="Abandono por campo" subtitle="% que abandona al llegar" type="bar" :data="fieldAbandonChart" :height="190" :options="horizontalOptions" />
        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Recomendación de optimización
          </h3>
          <p class="text-[10px] font-semibold text-rose-300">{{ worstField.field }} es el campo más costoso</p>
          <p class="text-[9px] font-mono text-slate-400 mt-1 leading-relaxed">
            {{ worstField.abandonRate }}% de quienes llegan lo abandonan ({{ worstField.abandons }} personas).
            Reducir o hacer opcional este campo podría recuperar aproximadamente
            <strong class="text-cyan-300">{{ recoverableLeads }} leads</strong> en el período.
          </p>
          <div class="mt-2 flex flex-wrap gap-1">
            <span class="badge badge-cyan text-[8px]">Hacer opcional</span>
            <span class="badge badge-cyan text-[8px]">Autocompletar</span>
            <span class="badge badge-cyan text-[8px]">Medir 14 días</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Conversión del formulario por dispositivo" subtitle="Iniciados vs enviados" type="bar" :data="deviceChart" :height="220" :options="groupedOptions" />
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Calidad posterior del lead
        </h3>
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <p class="text-[8px] text-slate-500">LEADS</p>
            <p class="text-slate-200 font-bold">{{ number(kpis.leads) }}</p>
          </div>
          <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <p class="text-[8px] text-slate-500">AGENDARON</p>
            <p class="text-violet-300 font-bold">{{ number(kpis.appointments) }}</p>
          </div>
          <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <p class="text-[8px] text-slate-500">ASISTIERON</p>
            <p class="text-emerald-300 font-bold">{{ number(kpis.attended) }}</p>
          </div>
          <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <p class="text-[8px] text-slate-500">COMPRARON</p>
            <p class="text-emerald-300 font-bold">{{ number(kpis.sales) }}</p>
          </div>
        </div>
        <div class="mt-2 p-2.5 rounded bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
          Cada campo adicional incrementa la fricción. La plataforma no solicita datos que no tengan una finalidad declarada y autorizada.
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
import { formFieldStats, number } from '../engine'

const { filtered, kpis } = useAnalytics()

const formViewed = computed(() => filtered.value.sessions.filter(s => s.quiz_completed).length)
const formStarted = computed(() => filtered.value.sessions.filter(s => s.form_started).length)
const formSubmitted = computed(() => filtered.value.sessions.filter(s => s.form_submitted).length)
const formConversion = computed(() => formStarted.value ? Math.round((formSubmitted.value / formStarted.value) * 100) : 0)
const formAbandon = computed(() => formStarted.value ? Math.round(((formStarted.value - formSubmitted.value) / formStarted.value) * 100) : 0)
const avgFormSeconds = computed(() => {
  const vals = filtered.value.sessions.filter(s => s.form_submitted).map(s => s.form_seconds)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
})
const totalErrors = computed(() => filtered.value.sessions.reduce((a, s) => a + s.form_fields.filter(f => f.action === 'error').length, 0))
const leadToSale = computed(() => kpis.value.leads ? Math.round((kpis.value.sales / kpis.value.leads) * 100) : 0)

const fields = computed(() => formFieldStats(filtered.value))
const worstField = computed(() => fields.value[0] || { field: '—', abandons: 0, abandonRate: 0 })
const recoverableLeads = computed(() => Math.round((worstField.value.abandons || 0) * 0.35))

const formFunnelChart = computed(() => ({
  labels: ['Vieron resultado', 'Iniciaron form', 'Enviaron datos', 'Agendaron', 'Compraron'],
  datasets: [{
    label: 'Personas',
    data: [formViewed.value, formStarted.value, formSubmitted.value, kpis.value.appointments, kpis.value.sales],
    backgroundColor: ['#38bdf8bb', '#22d3eebb', '#10b981bb', '#8b5cf6bb', '#f59e0bbb'],
    borderRadius: 4,
  }],
}))

const timeChart = computed(() => {
  const buckets = [[0, 45], [46, 90], [91, 150], [151, 240], [241, 999]]
  const vals = filtered.value.sessions.filter(s => s.form_submitted).map(s => s.form_seconds)
  return {
    labels: buckets.map(b => b[1] === 999 ? '240s+' : `${b[0]}–${b[1]}s`),
    datasets: [{ label: 'Envíos', data: buckets.map(b => vals.filter(v => v >= b[0] && v <= b[1]).length), backgroundColor: '#8b5cf6bb', borderRadius: 4 }],
  }
})

const fieldAbandonChart = computed(() => ({
  labels: fields.value.slice(0, 6).map(f => f.field),
  datasets: [{ label: 'Abandono %', data: fields.value.slice(0, 6).map(f => f.abandonRate), backgroundColor: fields.value.slice(0, 6).map(f => f.abandonRate > 10 ? '#f43f5ecc' : '#f59e0bcc'), borderRadius: 4 }],
}))

const deviceChart = computed(() => {
  const devs = ['mobile', 'desktop', 'tablet']
  const labels: Record<string, string> = { mobile: 'Móvil', desktop: 'Escritorio', tablet: 'Tablet' }
  return {
    labels: devs.map(d => labels[d]),
    datasets: [
      { label: 'Iniciados', data: devs.map(d => filtered.value.sessions.filter(s => s.device === d && s.form_started).length), backgroundColor: '#38bdf8bb', borderRadius: 4 },
      { label: 'Enviados', data: devs.map(d => filtered.value.sessions.filter(s => s.device === d && s.form_submitted).length), backgroundColor: '#10b981bb', borderRadius: 4 },
    ],
  }
})

const columns: Column[] = [
  { key: 'field', label: 'Campo' },
  { key: 'focus', label: 'Enfocado', align: 'right' },
  { key: 'filled', label: 'Completado', align: 'right' },
  { key: 'abandons', label: 'Abandonos', align: 'right' },
  { key: 'abandonRate', label: 'Tasa abandono', align: 'right' },
  { key: 'errors', label: 'Errores', align: 'right' },
  { key: 'avgSeconds', label: 'Tiempo', align: 'right', format: r => `${r.avgSeconds}s` },
]

const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const horizontalOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } } } }
const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
</script>
