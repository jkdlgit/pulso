<template>
  <PageHeader
    code="10 // CONVERSION FUNNELS"
    title="Embudos de conversión"
    description="Dónde se pierden las oportunidades, cuánto tarda cada transición y qué fuentes avanzan mejor. Puedes comparar el período actual con el anterior."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ selectedStages.length }} ETAPAS</span>
      <span class="badge badge-muted text-[9px]">CONVERSIÓN {{ kpis.conversionRate }}%</span>
    </template>

    <!-- Plantillas -->
    <div class="hud-card mb-4 py-3">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500 mr-1">Embudo:</span>
          <button
            v-for="t in templates"
            :key="t.id"
            @click="applyTemplate(t.id)"
            class="px-2.5 py-1.5 rounded text-[9px] font-mono border transition-all"
            :class="activeTemplate === t.id ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-slate-400 border-pulso-border/60 hover:text-slate-200'"
          >
            {{ t.label }}
          </button>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[9px] font-mono uppercase tracking-wider text-slate-500 mr-1">Etapas:</span>
          <button
            v-for="s in allStages"
            :key="s.key"
            @click="toggleStage(s.key)"
            class="px-1.5 py-0.5 rounded text-[8px] font-mono border transition-all"
            :class="included.has(s.key) ? 'bg-pulso-card text-slate-200 border-cyan-500/30' : 'text-slate-600 border-pulso-border/40 line-through'"
          >
            {{ s.short }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 mb-4">
      <StatCard label="Entrada" :value="number(selectedStages[0]?.count || 0)" icon="🚪" note="Primera etapa" />
      <StatCard label="Etapa final" :value="number(lastStage.count)" icon="🏁" tone="green" :note="lastStage.label" />
      <StatCard label="Conversión del embudo" :value="`${funnelConversion}%`" icon="🎯" tone="green" note="Final / entrada" />
      <StatCard label="Mayor pérdida" :value="biggestDrop.label" icon="📉" tone="rose" :note="`−${biggestDrop.dropPct}% (${biggestDrop.lost} personas)`" />
      <StatCard label="Tiempo total" :value="`${totalHours}h`" icon="⏱️" note="Entrada a compra" />
      <StatCard label="Vs período anterior" :value="`${prevConversion}%`" icon="↔️" tone="violet" :note="`Actual ${funnelConversion}%`" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Embudo seleccionado</h3>
          <span class="text-[9px] font-mono text-slate-500">PERSONAS ÚNICAS · {{ filters.days }} DÍAS</span>
        </div>
        <FunnelStages :stages="selectedStages" />
      </div>

      <ChartCard
        title="Comparación de etapas"
        subtitle="Período actual vs anterior"
        type="bar"
        :data="comparisonChart"
        :height="340"
        :options="comparisonOptions"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Pérdida por transición"
        subtitle="Personas que no avanzan"
        type="bar"
        :data="dropChart"
        :height="230"
        :options="horizontalOptions"
        class="xl:col-span-2"
      />
      <ChartCard title="Conversión por fuente" subtitle="Compradores / visitantes" type="bar" :data="sourceChart" :height="230" :options="horizontalOptions" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Detalle por etapa</h3>
          <span class="text-[9px] font-mono text-slate-500">TIEMPO MEDIO HASTA LA ETAPA</span>
        </div>
        <DataTable :columns="columns" :rows="selectedStages" row-key="key">
          <template #cell-label="{ row }">
            <span class="text-slate-200">{{ row.label }}</span>
          </template>
          <template #cell-pct="{ row }">
            <div class="flex items-center justify-end gap-2">
              <div class="w-16 h-1.5 rounded bg-pulso-void overflow-hidden">
                <div class="h-full bg-cyan-400" :style="{ width: `${row.pct}%` }"></div>
              </div>
              <span class="text-cyan-300">{{ row.pct }}%</span>
            </div>
          </template>
          <template #cell-dropPct="{ row }">
            <span :class="row.dropPct > 40 ? 'text-rose-300 font-bold' : row.dropPct > 20 ? 'text-amber-300' : 'text-slate-400'">
              {{ row.dropPct > 0 ? `−${row.dropPct}%` : '—' }}
            </span>
          </template>
        </DataTable>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Punto crítico
        </h3>
        <div class="p-3 rounded-lg bg-rose-500/5 border border-rose-500/25 mb-3">
          <p class="text-[11px] font-bold text-rose-300">{{ biggestDrop.from }} → {{ biggestDrop.label }}</p>
          <p class="text-[10px] font-mono text-slate-400 mt-1 leading-relaxed">
            Se pierden <strong class="text-rose-300">{{ biggestDrop.lost }} personas</strong> ({{ biggestDrop.dropPct }}% de la etapa anterior).
            Es la mayor fuga del embudo y la prioridad de optimización.
          </p>
        </div>
        <div class="space-y-2 text-[9px] font-mono text-slate-400">
          <p class="flex items-center gap-2"><span class="text-cyan-400">→</span> Recuperar 10% de esta etapa añadiría ~{{ recoverValue }} personas al final del embudo.</p>
          <p class="flex items-center gap-2"><span class="text-violet-400">→</span> Revisar el mensaje, la fricción y el dispositivo en esa transición.</p>
          <p class="flex items-center gap-2"><span class="text-emerald-400">→</span> Validar la mejora con una prueba y comparar períodos.</p>
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import FunnelStages from '../components/FunnelStages.vue'
import { useAnalytics } from '../store'
import { bySource, buildFunnel, number } from '../engine'

const { filtered, previous, funnel, kpis, filters } = useAnalytics()

const templates = [
  { id: 'full', label: 'Completo', stages: ['visitors', 'engaged', 'quiz_start', 'quiz_complete', 'form_start', 'lead', 'booked', 'confirmed', 'attended', 'quote', 'sale'] },
  { id: 'marketing', label: 'Marketing', stages: ['visitors', 'engaged', 'quiz_start', 'quiz_complete', 'lead'] },
  { id: 'commercial', label: 'Comercial', stages: ['lead', 'booked', 'confirmed', 'attended', 'quote', 'sale'] },
  { id: 'appointments', label: 'Citas', stages: ['booked', 'confirmed', 'attended', 'quote', 'sale'] },
]
const activeTemplate = ref('full')
const included = ref(new Set(templates[0].stages))

const allStages = computed(() => funnel.value.map(f => ({ key: f.key, short: f.label.split(' ')[0].slice(0, 8) })))
const selectedStages = computed(() => funnel.value.filter(f => included.value.has(f.key)))
const prevFunnel = computed(() => buildFunnel(previous.value))

const lastStage = computed(() => selectedStages.value[selectedStages.value.length - 1] || { count: 0, label: '—', key: '' })
const funnelConversion = computed(() => selectedStages.value.length && selectedStages.value[0].count
  ? Number(((lastStage.value.count / selectedStages.value[0].count) * 100).toFixed(1))
  : 0)
const prevConversion = computed(() => {
  const f = prevFunnel.value.filter(x => included.value.has(x.key))
  return f.length && f[0].count ? Number(((f[f.length - 1].count / f[0].count) * 100).toFixed(1)) : 0
})

const biggestDrop = computed(() => {
  let worst = { label: '—', from: '—', dropPct: 0, lost: 0 }
  for (let i = 1; i < selectedStages.value.length; i++) {
    const cur = selectedStages.value[i]
    const prev = selectedStages.value[i - 1]
    const lost = prev.count - cur.count
    if (cur.dropPct > worst.dropPct) worst = { label: cur.label, from: prev.label, dropPct: cur.dropPct, lost }
  }
  return worst
})

const totalHours = computed(() => Math.round(selectedStages.value.reduce((a, s) => a + (s.avgHours || 0), 0)))

const comparisonChart = computed(() => {
  const prevMap = new Map(prevFunnel.value.map(f => [f.key, f.count]))
  return {
    labels: selectedStages.value.map(s => s.label.length > 18 ? `${s.label.slice(0, 17)}…` : s.label),
    datasets: [
      { label: 'Actual', data: selectedStages.value.map(s => s.count), backgroundColor: '#38bdf8bb', borderRadius: 4 },
      { label: 'Anterior', data: selectedStages.value.map(s => prevMap.get(s.key) || 0), backgroundColor: '#64748b66', borderRadius: 4 },
    ],
  }
})

const dropChart = computed(() => ({
  labels: selectedStages.value.slice(1).map(s => s.label),
  datasets: [{
    label: 'Personas perdidas',
    data: selectedStages.value.slice(1).map((s, i) => selectedStages.value[i].count - s.count),
    backgroundColor: selectedStages.value.slice(1).map((s, i) => (selectedStages.value[i].count - s.count) >= biggestDrop.value.lost ? '#f43f5ecc' : '#f59e0bbb'),
    borderRadius: 4,
  }],
}))

const sourceChart = computed(() => {
  const rows = bySource(filtered.value).slice(0, 6)
  return {
    labels: rows.map(r => r.label),
    datasets: [{ label: 'Conversión %', data: rows.map(r => r.conversion), backgroundColor: rows.map(r => `${r.color}cc`), borderRadius: 4 }],
  }
})

const recoverValue = computed(() => Math.round(biggestDrop.value.lost * 0.1))

const columns: Column[] = [
  { key: 'label', label: 'Etapa' },
  { key: 'count', label: 'Personas', align: 'right', format: r => number(r.count) },
  { key: 'pct', label: '% del total', align: 'right' },
  { key: 'dropPct', label: 'Pérdida', align: 'right' },
  { key: 'avgHours', label: 'Tiempo', align: 'right', format: r => r.avgHours ? `${r.avgHours}h` : '—' },
]

function applyTemplate(id: string) {
  activeTemplate.value = id
  const t = templates.find(x => x.id === id)
  if (t) included.value = new Set(t.stages)
}
function toggleStage(key: string) {
  const next = new Set(included.value)
  if (next.has(key)) { if (next.size > 2) next.delete(key) } else next.add(key)
  included.value = next
  activeTemplate.value = 'custom'
}

const comparisonOptions = {
  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 10, font: { size: 9 } } } },
  scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } },
}
const horizontalOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 8 } } } } }
void filters
</script>
