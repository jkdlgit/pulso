<template>
  <PageHeader
    code="21 // BUSINESS MANAGEMENT"
    title="Administración de negocios"
    description="Cada negocio mantiene datos, campañas, embudos y resultados separados. La vista consolidada permite comparar sin mezclar visitantes, clientes ni ventas."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ businesses.length }} NEGOCIOS</span>
      <span class="badge badge-muted text-[9px]">ESQUEMA {{ schema }}</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Negocios" :value="number(businesses.length)" icon="🏢" />
      <StatCard label="Visitantes" :value="number(total.visitors)" icon="👥" tone="cyan" />
      <StatCard label="Leads" :value="number(total.leads)" icon="🧾" tone="amber" />
      <StatCard label="Citas" :value="number(total.appointments)" icon="📅" tone="violet" />
      <StatCard label="Ventas" :value="number(total.sales)" icon="💳" tone="green" />
      <StatCard label="Ingresos" :value="currency(total.revenue)" icon="💵" tone="green" />
      <StatCard label="Inversión" :value="currency(total.spend)" icon="💸" tone="rose" />
      <StatCard label="ROAS global" :value="`${total.roas}x`" icon="📈" :tone="total.roas >= 1 ? 'green' : 'rose'" />
    </div>

    <!-- Tarjetas por negocio -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div
        v-for="b in businessStats"
        :key="b.id"
        class="hud-card cursor-pointer transition-all"
        :class="filters.business === b.id ? 'ring-1 ring-cyan-500/50' : ''"
        :style="{ borderLeftWidth: '3px', borderLeftColor: b.accent }"
        @click="select(b.id)"
      >
        <div class="flex items-start justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-10 h-10 rounded-lg border flex items-center justify-center text-xl flex-shrink-0" :style="{ borderColor: `${b.accent}66`, background: `${b.accent}11` }">
              {{ b.emoji }}
            </div>
            <div class="min-w-0">
              <h3 class="font-tech text-sm font-bold text-slate-100">{{ b.name }}</h3>
              <p class="text-[9px] font-mono text-slate-500">{{ b.industry }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span class="badge badge-muted text-[8px]">{{ b.website }}</span>
            <span class="badge text-[8px]" :class="filters.business === b.id ? 'badge-cyan' : 'badge-muted'">
              {{ filters.business === b.id ? 'VIENDO' : 'VER' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2 text-[9px] font-mono mb-3">
          <div>
            <p class="text-slate-500 text-[8px] uppercase">Visitantes</p>
            <p class="text-slate-200 font-bold">{{ number(b.visitors) }}</p>
          </div>
          <div>
            <p class="text-slate-500 text-[8px] uppercase">Leads</p>
            <p class="text-amber-300 font-bold">{{ number(b.leads) }}</p>
          </div>
          <div>
            <p class="text-slate-500 text-[8px] uppercase">Ventas</p>
            <p class="text-emerald-300 font-bold">{{ number(b.sales) }}</p>
          </div>
          <div>
            <p class="text-slate-500 text-[8px] uppercase">Ingresos</p>
            <p class="text-emerald-300 font-bold">{{ currency(b.revenue, true) }}</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <div v-for="m in b.metrics" :key="m.label" class="flex items-center justify-between text-[9px] font-mono">
            <span class="text-slate-400">{{ m.label }}</span>
            <div class="flex items-center gap-2">
              <div class="w-20 h-1.5 rounded bg-pulso-void overflow-hidden">
                <div class="h-full rounded" :style="{ width: `${m.pct}%`, background: b.accent }"></div>
              </div>
              <span class="text-slate-300 w-14 text-right">{{ m.value }}</span>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-pulso-border/40 flex items-center justify-between text-[8px] font-mono text-slate-500">
          <span>{{ b.campaigns }} campañas · {{ b.landingPages }} páginas de entrada</span>
          <span :class="b.roas >= 1 ? 'text-emerald-300' : 'text-rose-300'">ROAS {{ b.roas }}x</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Comparación de negocios"
        subtitle="Ingresos, inversión y leads"
        type="bar"
        :data="compareChart"
        :height="260"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Participación de ingresos"
        subtitle="Peso de cada negocio"
        type="doughnut"
        :data="shareChart"
        :height="260"
        :options="doughnutOptions"
      />
    </div>

    <div class="hud-card p-0 overflow-hidden">
      <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Tabla consolidada</h3>
        <span class="text-[9px] font-mono text-slate-500">{{ filters.days }} DÍAS · TODOS LOS NEGOCIOS</span>
      </div>
      <DataTable :columns="columns" :rows="businessStats" row-key="id">
        <template #cell-name="{ row }">
          <div class="flex items-center gap-2">
            <span>{{ row.emoji }}</span>
            <span class="text-slate-200">{{ row.name }}</span>
          </div>
        </template>
        <template #cell-revenue="{ row }">
          <span class="text-emerald-300 font-bold">{{ currency(row.revenue) }}</span>
        </template>
        <template #cell-roas="{ row }">
          <span class="font-bold" :class="row.roas >= 1 ? 'text-emerald-300' : 'text-rose-300'">{{ row.roas }}x</span>
        </template>
        <template #cell-conversion="{ row }">
          <span class="text-cyan-300">{{ row.conversion }}%</span>
        </template>
        <template #cell-status="{ row }">
          <span class="badge badge-green text-[8px] py-0 px-1.5">ACTIVO</span>
        </template>
      </DataTable>
      <div class="p-3 border-t border-pulso-border/50 text-[8px] font-mono text-slate-500">
        🔒 Los datos de cada negocio se mantienen separados. La vista consolidada solo agrega métricas, nunca mezcla identidades entre negocios.
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
import { applyFilters, bySource, computeKpis, currency, number } from '../engine'
import { analyticsSchema } from '../supabaseAnalytics'

const { dataset, filters } = useAnalytics()
const schema = analyticsSchema

const businesses = computed(() => dataset.value.businesses)

const businessStats = computed(() =>
  dataset.value.businesses.map(b => {
    const fd = applyFilters(dataset.value, { ...filters, business: b.id })
    const kpi = computeKpis(fd)
    const revenue = kpi.revenue
    const roas = kpi.adSpend ? Number((revenue / kpi.adSpend).toFixed(2)) : 0
    return {
      ...b,
      visitors: kpi.visitors,
      leads: kpi.leads,
      sales: kpi.sales,
      appointments: kpi.appointments,
      revenue,
      spend: kpi.adSpend,
      roas,
      conversion: kpi.conversionRate,
      campaigns: dataset.value.campaigns.filter(c => c.business_id === b.id).length,
      landingPages: new Set(fd.sessions.map(s => s.landing_page)).size,
      metrics: [
        { label: 'Conversión', value: `${kpi.conversionRate}%`, pct: Math.min(100, kpi.conversionRate * 4) },
        { label: 'Asistencia citas', value: `${kpi.appointments ? Math.round((kpi.attended / kpi.appointments) * 100) : 0}%`, pct: kpi.appointments ? Math.round((kpi.attended / kpi.appointments) * 100) : 0 },
        { label: 'Abandono test', value: `${kpi.abandonRate}%`, pct: Math.min(100, kpi.abandonRate) },
        { label: 'Ticket medio', value: currency(kpi.avgTicket, true), pct: Math.min(100, (kpi.avgTicket / 400) * 100) },
      ],
    }
  })
)

const total = computed(() => {
  const visitors = businessStats.value.reduce((a, b) => a + b.visitors, 0)
  const leads = businessStats.value.reduce((a, b) => a + b.leads, 0)
  const sales = businessStats.value.reduce((a, b) => a + b.sales, 0)
  const revenue = businessStats.value.reduce((a, b) => a + b.revenue, 0)
  const spend = businessStats.value.reduce((a, b) => a + b.spend, 0)
  return {
    visitors, leads, sales, revenue, spend,
    appointments: businessStats.value.reduce((a, b) => a + b.appointments, 0),
    roas: spend ? Number((revenue / spend).toFixed(2)) : 0,
  }
})

const compareChart = computed(() => ({
  labels: businessStats.value.map(b => b.name),
  datasets: [
    { label: 'Ingresos', data: businessStats.value.map(b => b.revenue), backgroundColor: '#10b981bb', borderRadius: 4 },
    { label: 'Inversión', data: businessStats.value.map(b => b.spend), backgroundColor: '#f43f5eaa', borderRadius: 4 },
    { label: 'Leads ×10', data: businessStats.value.map(b => b.leads * 10), backgroundColor: '#38bdf8aa', borderRadius: 4 },
  ],
}))

const shareChart = computed(() => ({
  labels: businessStats.value.map(b => b.name),
  datasets: [{
    data: businessStats.value.map(b => b.revenue),
    backgroundColor: businessStats.value.map(b => `${b.accent}cc`),
    borderColor: businessStats.value.map(b => b.accent),
    borderWidth: 1,
  }],
}))

function select(id: string) {
  filters.business = filters.business === id ? 'all' : id
}

const columns: Column[] = [
  { key: 'name', label: 'Negocio' },
  { key: 'visitors', label: 'Visitantes', align: 'right' },
  { key: 'leads', label: 'Leads', align: 'right' },
  { key: 'appointments', label: 'Citas', align: 'right' },
  { key: 'sales', label: 'Ventas', align: 'right' },
  { key: 'conversion', label: 'Conversión', align: 'right' },
  { key: 'revenue', label: 'Ingresos', align: 'right' },
  { key: 'spend', label: 'Inversión', align: 'right', format: r => currency(r.spend) },
  { key: 'roas', label: 'ROAS', align: 'right' },
  { key: 'status', label: 'Estado' },
]

const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
void bySource
</script>
