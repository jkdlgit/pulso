<template>
  <PageHeader
    code="16 // TEMPORAL ANALYSIS"
    title="Análisis temporal y detección de patrones"
    description="Cómo cambian los resultados por día, semana, hora y día de la semana. Se señalan cambios bruscos y anomalías, sin confundir correlación temporal con causalidad."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">{{ filters.days }} DÍAS ANALIZADOS</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Mejor día" :value="bestWeekday.label" icon="📆" tone="green" :note="`${bestWeekday.leads} leads`" />
      <StatCard label="Peor día" :value="worstWeekday.label" icon="📉" tone="rose" :note="`${worstWeekday.leads} leads`" />
      <StatCard label="Mejor hora" :value="bestHour.label" icon="🕒" tone="cyan" :note="`${bestHour.sales} ventas`" />
      <StatCard label="Hora pico" :value="peakHour.label" icon="📊" tone="violet" :note="`${peakHour.sessions} sesiones`" />
      <StatCard label="Día de más ingresos" :value="bestRevenueDay.label" icon="💵" tone="green" :note="currency(bestRevenueDay.revenue)" />
      <StatCard label="Media diaria" :value="`${avgDailyLeads}`" icon="📈" note="Leads / día" />
      <StatCard label="Variación semanal" :value="`${weeklyChange}%`" icon="↔️" :tone="weeklyChange >= 0 ? 'green' : 'rose'" note="Última vs anterior" />
      <StatCard label="Anomalías" :value="`${anomalies.length}`" icon="⚠️" tone="amber" note="Desvíos detectados" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Evolución diaria"
        subtitle="Visitantes, leads, citas y ventas"
        type="line"
        :data="dailyChart"
        :height="260"
        :options="lineOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Distribución por día de la semana"
        subtitle="Sesiones acumuladas"
        type="bar"
        :data="weekdayChart"
        :height="260"
        :options="barOptions"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Patrón horario"
        subtitle="Sesiones y ventas por hora"
        type="bar"
        :data="hourChart"
        :height="240"
        :options="groupedOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Leads por hora"
        subtitle="Cuándo se captan más leads"
        type="bar"
        :data="leadHourChart"
        :height="240"
        :options="barOptions"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Matriz hora × día</h3>
          <span class="text-[9px] font-mono text-slate-500">INTENSIDAD DE SESIONES</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="text-[8px] font-mono text-slate-600 p-1 text-left">HORA</th>
                <th v-for="d in weekdayLabels" :key="d" class="text-[8px] font-mono text-slate-500 p-1 text-center">{{ d }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in heatHours" :key="h">
                <td class="text-[8px] font-mono text-slate-600 p-1">{{ String(h).padStart(2, '0') }}:00</td>
                <td v-for="d in [0, 1, 2, 3, 4, 5, 6]" :key="d" class="p-0.5">
                  <div
                    class="h-5 rounded-sm transition-colors"
                    :style="{ background: heatColor(heatValue(h, d)) }"
                    :title="`${weekdayLabels[d]} ${h}:00 · ${heatValue(h, d)} sesiones`"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-end gap-2 mt-2 text-[8px] font-mono text-slate-500">
          <span>MENOS</span>
          <span class="w-24 h-1.5 rounded-full" style="background: linear-gradient(90deg, rgba(29,42,72,.8), rgba(56,189,248,.5), rgba(56,189,248,1))"></span>
          <span>MÁS</span>
        </div>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Anomalías y cambios bruscos
        </h3>
        <div v-if="anomalies.length" class="space-y-2">
          <div v-for="a in anomalies" :key="a.date" class="p-2 rounded-lg border" :class="a.type === 'alta' ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-rose-500/5 border-rose-500/25'">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-mono font-bold" :class="a.type === 'alta' ? 'text-emerald-300' : 'text-rose-300'">
                {{ a.type === 'alta' ? '▲ PICO ANÓMALO' : '▼ CAÍDA ANÓMALA' }}
              </span>
              <span class="text-[8px] font-mono text-slate-500">{{ a.label }}</span>
            </div>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">{{ a.text }}</p>
          </div>
        </div>
        <div v-else class="py-8 text-center text-[10px] font-mono text-slate-500">
          Sin desvíos significativos en el período.
        </div>
        <p class="mt-2 p-2 rounded bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
          Una anomalía es una desviación estadística frente a la media; no explica por sí sola la causa. Revisar campañas, cambios de sitio y estacionalidad.
        </p>
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
import { barDataset, lineDataset } from '../chart'
import { currency, hourlyStats, weekdayStats } from '../engine'

const { filtered, timeseries, filters } = useAnalytics()

const hourly = computed(() => hourlyStats(filtered.value))
const weekday = computed(() => weekdayStats(filtered.value))

const weekdayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const bestWeekday = computed(() => [...weekday.value].sort((a, b) => b.leads - a.leads)[0] || { label: '—', leads: 0 })
const worstWeekday = computed(() => [...weekday.value].sort((a, b) => a.leads - b.leads)[0] || { label: '—', leads: 0 })
const bestHour = computed(() => [...hourly.value].sort((a, b) => b.sales - a.sales)[0] || { label: '—', sales: 0 })
const peakHour = computed(() => [...hourly.value].sort((a, b) => b.sessions - a.sessions)[0] || { label: '—', sessions: 0 })
const bestRevenueDay = computed(() => {
  const best = [...timeseries.value].sort((a, b) => b.revenue - a.revenue)[0]
  return best ? { label: best.label, revenue: best.revenue } : { label: '—', revenue: 0 }
})
const avgDailyLeads = computed(() => {
  const total = timeseries.value.reduce((a, p) => a + p.leads, 0)
  return timeseries.value.length ? (total / timeseries.value.length).toFixed(1) : '0.0'
})
const weeklyChange = computed(() => {
  const ts = timeseries.value
  if (ts.length < 14) return 0
  const last7 = ts.slice(-7).reduce((a, p) => a + p.leads, 0)
  const prev7 = ts.slice(-14, -7).reduce((a, p) => a + p.leads, 0)
  return prev7 ? Number((((last7 - prev7) / prev7) * 100).toFixed(1)) : 0
})

const dailyChart = computed(() => ({
  labels: timeseries.value.map(p => p.label),
  datasets: [
    lineDataset('Visitantes', timeseries.value.map(p => p.visitors), '#38bdf8'),
    lineDataset('Leads', timeseries.value.map(p => p.leads), '#10b981'),
    lineDataset('Ventas', timeseries.value.map(p => p.sales), '#f59e0b'),
  ],
}))

const weekdayChart = computed(() => ({
  labels: weekday.value.map(w => w.label),
  datasets: [{ label: 'Sesiones', data: weekday.value.map(w => w.visitors), backgroundColor: '#38bdf8bb', borderRadius: 4 }],
}))

const hourChart = computed(() => ({
  labels: hourly.value.map(h => h.label),
  datasets: [
    { label: 'Sesiones', data: hourly.value.map(h => h.sessions), backgroundColor: '#38bdf855', borderRadius: 4 },
    { label: 'Ventas', data: hourly.value.map(h => h.sales), backgroundColor: '#10b981cc', borderRadius: 4 },
  ],
}))

const leadHourChart = computed(() => ({
  labels: hourly.value.map(h => h.label),
  datasets: [{ label: 'Leads', data: hourly.value.map(h => h.leads), backgroundColor: '#f59e0bbb', borderRadius: 4 }],
}))

// Matriz hora x día
const heatHours = Array.from({ length: 17 }, (_, i) => i + 7)
const heatMap = computed(() => {
  const map = new Map<string, number>()
  filtered.value.sessions.forEach(s => {
    const d = new Date(s.started_at)
    const key = `${d.getHours()}_${d.getDay()}`
    map.set(key, (map.get(key) || 0) + 1)
  })
  return map
})
const maxHeat = computed(() => Math.max(1, ...heatMap.value.values()))
function heatValue(h: number, d: number) {
  return heatMap.value.get(`${h}_${d}`) || 0
}
function heatColor(v: number) {
  if (!v) return 'rgba(13,19,34,.6)'
  const intensity = v / maxHeat.value
  return `rgba(56,189,248,${0.12 + intensity * 0.8})`
}

const anomalies = computed(() => {
  const ts = timeseries.value
  if (ts.length < 5) return []
  const values = ts.map(p => p.sessions)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length) || 1
  const rows: { date: string; label: string; type: 'alta' | 'baja'; text: string }[] = []
  ts.forEach(p => {
    const z = (p.sessions - mean) / sd
    if (z >= 2) rows.push({ date: p.date, label: p.label, type: 'alta', text: `${p.sessions} sesiones, muy por encima de la media (${Math.round(mean)}).` })
    if (z <= -2) rows.push({ date: p.date, label: p.label, type: 'baja', text: `${p.sessions} sesiones, muy por debajo de la media (${Math.round(mean)}).` })
  })
  return rows.slice(0, 5)
})

const lineOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b', maxTicksLimit: 10 } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
void barDataset
</script>
