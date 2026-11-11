<template>
  <PageHeader
    code="12 // APPOINTMENTS"
    title="Agendamientos, confirmaciones y asistencias"
    description="Del interés a la visita al local: qué horarios tienen más demanda, qué recordatorios reducen ausencias y qué fuentes producen citas que terminan en venta."
  >
    <template #actions>
      <span class="badge badge-violet text-[9px]">{{ number(appt.total) }} CITAS</span>
      <span class="badge" :class="appt.attendanceRate >= 70 ? 'badge-green' : 'badge-amber'">ASISTENCIA {{ appt.attendanceRate }}%</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Citas agendadas" :value="number(appt.total)" icon="📅" />
      <StatCard label="Confirmadas" :value="number(appt.total - appt.cancelled - appt.pending)" icon="✅" tone="cyan" note="Confirmación explícita" />
      <StatCard label="Asistencias" :value="number(appt.attended)" icon="📍" tone="green" note="Llegaron al local" />
      <StatCard label="Ausencias" :value="number(appt.noShow)" icon="🚫" tone="rose" note="No asistieron" />
      <StatCard label="Tasa de asistencia" :value="`${appt.attendanceRate}%`" icon="🎯" tone="green" note="Asistencias / citas" />
      <StatCard label="Canceladas" :value="number(appt.cancelled)" icon="✕" tone="amber" />
      <StatCard label="Reagendadas" :value="number(appt.rescheduled)" icon="🔁" tone="violet" />
      <StatCard label="Anticipación media" :value="`${appt.avgLeadTime}h`" icon="⏳" tone="slate" note="Agenda → cita" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Resultado de las citas"
        subtitle="Distribución por estado"
        type="doughnut"
        :data="statusChart"
        :height="240"
        :options="doughnutOptions"
        :empty="appt.total === 0"
      />
      <ChartCard
        title="Demanda por horario"
        subtitle="Citas agendadas por hora"
        type="bar"
        :data="hourChart"
        :height="240"
        :options="barOptions"
        :empty="appt.byHour.length === 0"
      />
      <ChartCard
        title="Efectividad de recordatorios"
        subtitle="Asistencia según esquema"
        type="bar"
        :data="reminderChart"
        :height="240"
        :options="horizontalOptions"
        :empty="appt.total === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Anticipación vs asistencia"
        subtitle="Días entre agendamiento y cita"
        type="bar"
        :data="leadTimeChart"
        :height="230"
        :options="barOptions"
        class="xl:col-span-2"
      />
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Diagnóstico de citas
        </h3>
        <div class="space-y-2">
          <div class="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/25">
            <p class="text-[10px] font-bold text-cyan-300">Mejor horario: {{ bestHour.label }}</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">Concentra {{ bestHour.count }} citas. Útil para reforzar la atención en esa franja.</p>
          </div>
          <div class="p-2.5 rounded-lg" :class="appt.noShowRate > 15 ? 'bg-rose-500/5 border border-rose-500/25' : 'bg-emerald-500/5 border border-emerald-500/25'">
            <p class="text-[10px] font-bold" :class="appt.noShowRate > 15 ? 'text-rose-300' : 'text-emerald-300'">
              Ausencia {{ appt.noShowRate }}%
            </p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">
              {{ appt.noShowRate > 15 ? 'Por encima del umbral recomendado. Activar doble recordatorio.' : 'Dentro de un rango aceptable.' }}
            </p>
          </div>
          <div class="p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/25">
            <p class="text-[10px] font-bold text-violet-300">Mejor esquema: {{ bestReminder.reminder }}</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5">{{ bestReminder.rate }}% de asistencia con {{ bestReminder.total }} citas.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Citas recientes</h3>
          <span class="text-[9px] font-mono text-slate-500">{{ upcoming.length }} REGISTROS</span>
        </div>
        <DataTable :columns="columns" :rows="upcoming" row-key="id">
          <template #cell-visitor_id="{ row }">
            <span class="text-slate-300">{{ row.visitor_id }}</span>
            <span class="text-[8px] text-slate-600 block">{{ row.campaignName }}</span>
          </template>
          <template #cell-status="{ row }">
            <span class="badge text-[8px] py-0 px-1.5" :class="statusClass(row.status)">{{ statusLabel(row.status) }}</span>
          </template>
          <template #cell-reminder="{ row }">
            <span class="text-slate-400 text-[9px]">{{ row.reminderLabel }}</span>
          </template>
        </DataTable>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Citas que terminan en venta
        </h3>
        <div class="space-y-2 text-[10px] font-mono">
          <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-400">Citas → ventas</span>
            <span class="text-emerald-300 font-bold">{{ appointmentToSale }}%</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-400">Asistencias → ventas</span>
            <span class="text-emerald-300 font-bold">{{ attendToSale }}%</span>
          </div>
          <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <span class="text-slate-400">Ingreso por cita</span>
            <span class="text-amber-300 font-bold">{{ currency(incomePerAppointment) }}</span>
          </div>
        </div>
        <p class="mt-2 p-2 rounded bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
          La relación cita → venta es una asociación por sesión, no una prueba de causalidad. Puede existir una compra posterior no registrada.
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
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { appointmentStats, currency, formatDate, number } from '../engine'

const { filtered, dataset } = useAnalytics()

const appt = computed(() => appointmentStats(filtered.value))

const bestHour = computed(() => [...appt.value.byHour].sort((a, b) => b.count - a.count)[0] || { label: '—', count: 0 })
const bestReminder = computed(() => [...appt.value.byReminder].sort((a, b) => b.rate - a.rate)[0] || { reminder: '—', rate: 0, total: 0 })

const statusChart = computed(() => ({
  labels: ['Atendidas', 'No asistió', 'Canceladas', 'Reagendadas', 'Pendientes'],
  datasets: [{
    data: [appt.value.attended, appt.value.noShow, appt.value.cancelled, appt.value.rescheduled, appt.value.pending],
    backgroundColor: ['#10b981cc', '#f43f5ecc', '#f59e0bcc', '#8b5cf6cc', '#64748bcc'],
    borderColor: ['#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#64748b'],
    borderWidth: 1,
  }],
}))

const hourChart = computed(() => ({
  labels: appt.value.byHour.map(h => h.label),
  datasets: [{ label: 'Citas', data: appt.value.byHour.map(h => h.count), backgroundColor: '#8b5cf6bb', borderRadius: 4 }],
}))

const reminderChart = computed(() => ({
  labels: appt.value.byReminder.map(r => r.reminder),
  datasets: [{ label: 'Asistencia %', data: appt.value.byReminder.map(r => r.rate), backgroundColor: appt.value.byReminder.map(r => r.rate >= 70 ? '#10b981bb' : '#f59e0bbb'), borderRadius: 4 }],
}))

const leadTimeChart = computed(() => {
  const buckets = [[0, 24], [25, 48], [49, 72], [73, 168], [169, 999]]
  return {
    labels: buckets.map(b => (b[1] === 999 ? '7+ días' : b[1] === 24 ? '0–24 h' : `${b[0]}–${b[1]} h`)),
    datasets: [{
      label: 'Citas',
      data: buckets.map(b => filtered.value.appointments.filter(a => a.lead_time_hours >= b[0] && a.lead_time_hours <= b[1]).length),
      backgroundColor: '#38bdf8bb',
      borderRadius: 4,
    }],
  }
})

const appointmentToSale = computed(() => appt.value.total ? Math.round((filtered.value.sales.length / appt.value.total) * 100) : 0)
const attendToSale = computed(() => appt.value.attended ? Math.round((filtered.value.sales.length / appt.value.attended) * 100) : 0)
const incomePerAppointment = computed(() => appt.value.total ? filtered.value.sales.reduce((a, s) => a + s.total, 0) / appt.value.total : 0)

const upcoming = computed(() =>
  [...filtered.value.appointments]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 15)
    .map(a => {
      const camp = dataset.value.campaigns.find(c => c.id === a.campaign_id)
      return {
        ...a,
        campaignName: camp?.name || 'Sin campaña',
        reminderLabel: a.reminder === 'ninguno' ? 'Sin recordatorio' : a.reminder === '24h+2h' ? '24h + 2h' : a.reminder,
      }
    })
)

function statusClass(s: string) {
  return s === 'atendida' ? 'badge-green' : s === 'no_asistio' ? 'badge-rose' : s === 'cancelada' ? 'badge-amber' : s === 'reagendada' ? 'badge-violet' : 'badge-muted'
}
function statusLabel(s: string) {
  return s.replace('_', ' ').toUpperCase()
}

const columns: Column[] = [
  { key: 'visitor_id', label: 'Visitante' },
  { key: 'created_at', label: 'Agendada', format: r => formatDate(r.created_at, true) },
  { key: 'scheduled_for', label: 'Cita', format: r => formatDate(r.scheduled_for, true) },
  { key: 'reminder', label: 'Recordatorio' },
  { key: 'source', label: 'Fuente' },
  { key: 'status', label: 'Estado' },
]

const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const horizontalOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
</script>
