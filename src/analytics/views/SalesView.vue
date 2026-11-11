<template>
  <PageHeader
    code="14 // SALES ANALYTICS"
    title="Ventas y resultados comerciales"
    description="Marketing conectado con el resultado real del negocio: ingresos, margen, ticket, atribución y tiempo hasta la compra. Se distingue ingreso, utilidad y retorno publicitario."
  >
    <template #actions>
      <span class="badge badge-green text-[9px]">INGRESOS {{ currency(stats.revenue) }}</span>
      <span class="badge" :class="stats.roi >= 0 ? 'badge-green' : 'badge-rose'">ROI {{ stats.roi }}%</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Ingresos" :value="currency(stats.revenue)" icon="💵" tone="green" note="Ventas no devueltas" />
      <StatCard label="Compras" :value="number(kpis.sales)" icon="💳" note="Clientes únicos" />
      <StatCard label="Ticket promedio" :value="currency(stats.avgTicket)" icon="🧾" tone="cyan" />
      <StatCard label="Unidades" :value="number(stats.units)" icon="📦" note="Productos vendidos" />
      <StatCard label="Margen bruto" :value="`${stats.grossMargin}%`" icon="📊" tone="green" note="Ingreso − costo" />
      <StatCard label="Inversión" :value="currency(kpis.adSpend)" icon="💸" tone="rose" />
      <StatCard label="ROAS" :value="`${stats.roas}x`" icon="📈" :tone="stats.roas >= 1 ? 'green' : 'rose'" note="Ingreso / inversión" />
      <StatCard label="Días hasta compra" :value="`${stats.avgDaysToClose}d`" icon="⏳" tone="slate" note="Primer contacto → venta" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Evolución de ingresos e inversión"
        subtitle="Serie diaria del período"
        type="line"
        :data="trendChart"
        :height="250"
        :options="trendOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Ingresos por categoría"
        subtitle="Participación de la facturación"
        type="doughnut"
        :data="categoryChart"
        :height="250"
        :options="doughnutOptions"
        :empty="stats.byProduct.length === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Productos y servicios</h3>
          <span class="text-[9px] font-mono text-slate-500">ORDENADO POR INGRESOS</span>
        </div>
        <DataTable :columns="productColumns" :rows="stats.byProduct" row-key="product">
          <template #cell-product="{ row }">
            <span class="text-slate-200">{{ row.product }}</span>
          </template>
          <template #cell-revenue="{ row }">
            <span class="text-emerald-300 font-bold">{{ currency(row.revenue) }}</span>
          </template>
          <template #cell-share="{ row }">
            <div class="flex items-center justify-end gap-2">
              <div class="w-16 h-1.5 rounded bg-pulso-void overflow-hidden">
                <div class="h-full bg-emerald-400" :style="{ width: `${share(row.revenue)}%` }"></div>
              </div>
              <span class="text-slate-400">{{ share(row.revenue) }}%</span>
            </div>
          </template>
        </DataTable>
      </div>

      <ChartCard
        title="Rendimiento por vendedor"
        subtitle="Ingresos generados"
        type="bar"
        :data="sellerChart"
        :height="260"
        :options="horizontalOptions"
        :empty="stats.bySeller.length === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard title="Estado de pago" subtitle="Cartera y devoluciones" type="bar" :data="paymentChart" :height="220" :options="barOptions" />
      <ChartCard title="Conversión por fuente" subtitle="Compradores / visitantes" type="bar" :data="sourceChart" :height="220" :options="horizontalOptions" />
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Lectura económica
        </h3>
        <div class="space-y-2 text-[9px] font-mono">
          <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-400">Ingreso medio por visitante</span>
            <span class="text-emerald-300 font-bold">{{ currency(incomePerVisitor) }}</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-400">Costo de adquisición</span>
            <span class="text-rose-300 font-bold">{{ currency(stats.cac) }}</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-400">Utilidad bruta estimada</span>
            <span class="text-amber-300 font-bold">{{ currency(stats.revenue - stats.cost) }}</span>
          </div>
        </div>
        <p class="mt-2 p-2 rounded bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
          El ROAS mide ingresos atribuidos por sesión, no causalidad. Un ROAS alto no implica que la campaña haya causado la venta.
        </p>
      </div>
    </div>

    <div class="hud-card p-0 overflow-hidden">
      <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Ventas registradas</h3>
        <span class="text-[9px] font-mono text-slate-500">{{ recentSales.length }} REGISTROS</span>
      </div>
      <DataTable :columns="saleColumns" :rows="recentSales" row-key="id">
        <template #cell-product="{ row }">
          <span class="text-slate-200">{{ row.product }}</span>
          <span class="text-[8px] text-slate-600 block">{{ row.category }} · {{ row.seller }}</span>
        </template>
        <template #cell-total="{ row }">
          <span class="text-emerald-300 font-bold">{{ currency(row.total) }}</span>
        </template>
        <template #cell-payment_status="{ row }">
          <span class="badge text-[8px] py-0 px-1.5" :class="row.payment_status === 'Pagado total' ? 'badge-green' : row.payment_status === 'Devuelto' ? 'badge-rose' : 'badge-amber'">
            {{ row.payment_status }}
          </span>
        </template>
        <template #cell-days_to_close="{ row }">
          <span class="text-slate-400">{{ row.days_to_close }}d</span>
        </template>
      </DataTable>
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
import { barDataset, lineDataset } from '../chart'
import { bySource, currency, formatDate, number, salesStats } from '../engine'

const { filtered, kpis, timeseries } = useAnalytics()

const stats = computed(() => salesStats(filtered.value))

const trendChart = computed(() => ({
  labels: timeseries.value.map(p => p.label),
  datasets: [
    lineDataset('Ingresos', timeseries.value.map(p => p.revenue), '#10b981'),
    lineDataset('Inversión', timeseries.value.map(p => p.adSpend), '#f43f5e', false),
  ],
}))

const categoryChart = computed(() => {
  const map = new Map<string, number>()
  filtered.value.sales.filter(s => s.payment_status !== 'Devuelto').forEach(s => {
    const cat = s.category || 'Sin categoría'
    map.set(cat, (map.get(cat) || 0) + s.total)
  })
  const palette = ['#10b981', '#38bdf8', '#f59e0b', '#8b5cf6', '#ec4899', '#22d3ee']
  return {
    labels: [...map.keys()],
    datasets: [{ data: [...map.values()], backgroundColor: [...map.keys()].map((_, i) => `${palette[i % palette.length]}cc`), borderColor: [...map.keys()].map((_, i) => palette[i % palette.length]), borderWidth: 1 }],
  }
})

const sellerChart = computed(() => ({
  labels: stats.value.bySeller.map(s => s.seller),
  datasets: [{ label: 'Ingresos', data: stats.value.bySeller.map(s => s.revenue), backgroundColor: '#38bdf8bb', borderRadius: 4 }],
}))

const paymentChart = computed(() => ({
  labels: stats.value.byPayment.map(p => p.status),
  datasets: [{ data: stats.value.byPayment.map(p => p.count), backgroundColor: ['#10b981cc', '#f59e0bcc', '#8b5cf6cc', '#f43f5ecc'], borderRadius: 4 }],
}))

const sourceChart = computed(() => {
  const rows = bySource(filtered.value).filter(r => r.visitors > 0).slice(0, 6)
  return {
    labels: rows.map(r => r.label),
    datasets: [{ label: 'Conversión %', data: rows.map(r => r.conversion), backgroundColor: rows.map(r => `${r.color}cc`), borderRadius: 4 }],
  }
})

const share = (rev: number) => stats.value.revenue ? Math.round((rev / stats.value.revenue) * 100) : 0
const incomePerVisitor = computed(() => kpis.value.visitors ? stats.value.revenue / kpis.value.visitors : 0)

const recentSales = computed(() =>
  [...filtered.value.sales].sort((a, b) => b.sold_at.localeCompare(a.sold_at)).slice(0, 15)
)

const productColumns: Column[] = [
  { key: 'product', label: 'Producto' },
  { key: 'sales', label: 'Ventas', align: 'right' },
  { key: 'units', label: 'Unidades', align: 'right' },
  { key: 'revenue', label: 'Ingresos', align: 'right' },
  { key: 'share', label: 'Participación', align: 'right' },
]

const saleColumns: Column[] = [
  { key: 'product', label: 'Producto' },
  { key: 'sold_at', label: 'Fecha', format: r => formatDate(r.sold_at, true) },
  { key: 'qty', label: 'Cant.', align: 'right' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'payment_status', label: 'Pago' },
  { key: 'days_to_close', label: 'Cierre', align: 'right' },
]

const trendOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b', maxTicksLimit: 10 } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const horizontalOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
void barDataset
</script>
