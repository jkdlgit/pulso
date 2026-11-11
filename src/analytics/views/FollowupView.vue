<template>
  <PageHeader
    code="13 // COMMUNICATIONS & FOLLOW-UP"
    title="Seguimiento comercial y comunicaciones"
    description="Quién fue contactado, por qué canal, cuánto tardó la respuesta y qué seguimientos acompañan una venta. Enviado no significa leído."
  >
    <template #actions>
      <span class="badge badge-rose text-[9px]">{{ comm.noFollowUp }} SIN SEGUIMIENTO</span>
      <span class="badge badge-cyan text-[9px]">RESPUESTA {{ comm.responseRate }}%</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Leads" :value="number(comm.leads)" icon="🧾" tone="amber" />
      <StatCard label="Contactados" :value="number(comm.contacted)" icon="📨" tone="cyan" />
      <StatCard label="Sin seguimiento" :value="number(comm.noFollowUp)" icon="🚨" tone="rose" note="Nunca se les contactó" />
      <StatCard label="Tasa de respuesta" :value="`${comm.responseRate}%`" icon="💬" tone="green" />
      <StatCard label="Contacto < 24h" :value="`${comm.firstContactUnder24h}%`" icon="⚡" tone="green" note="Primer contacto rápido" />
      <StatCard label="Respuesta media" :value="`${comm.avgReplyMinutes} min`" icon="⏱️" tone="violet" />
      <StatCard label="Conversaciones" :value="number(totalComms)" icon="📞" note="Mensajes y llamadas" />
      <StatCard label="Lead → cita" :value="`${leadToAppointment}%`" icon="📅" tone="violet" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Contacto por canal"
        subtitle="Enviados vs respondidos"
        type="bar"
        :data="channelChart"
        :height="240"
        :options="groupedOptions"
        :empty="totalComms === 0"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Estado de la conversación"
        subtitle="Distribución de los seguimientos"
        type="doughnut"
        :data="statusChart"
        :height="240"
        :options="doughnutOptions"
        :empty="totalComms === 0"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Efectividad por canal</h3>
          <span class="text-[9px] font-mono text-slate-500">RESPUESTA Y VENTA</span>
        </div>
        <DataTable :columns="channelColumns" :rows="comm.channels" row-key="channel">
          <template #cell-channel="{ row }">
            <span class="text-slate-200">{{ row.channel }}</span>
          </template>
          <template #cell-replyRate="{ row }">
            <div class="flex items-center justify-end gap-2">
              <div class="w-16 h-1.5 rounded bg-pulso-void overflow-hidden">
                <div class="h-full bg-cyan-400" :style="{ width: `${row.replyRate}%` }"></div>
              </div>
              <span class="text-cyan-300">{{ row.replyRate }}%</span>
            </div>
          </template>
          <template #cell-sales="{ row }">
            <span class="text-emerald-300 font-bold">{{ row.sales }}</span>
          </template>
        </DataTable>

        <div class="mt-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/25 flex items-start gap-2">
          <span class="text-lg">🚨</span>
          <p class="text-[10px] font-mono text-slate-300">
            <strong class="text-rose-300">{{ comm.noFollowUp }} leads no fueron contactados.</strong>
            Cada lead sin seguimiento reduce la probabilidad de conversión. Se recomienda alerta inmediata y plantilla de primer contacto.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <ChartCard title="Tiempo de respuesta" subtitle="Minutos hasta la contestación" type="bar" :data="replyChart" :height="180" :options="barOptions" />
        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Resultado de los seguimientos
          </h3>
          <div class="space-y-1.5">
            <div v-for="r in outcomes" :key="r.label" class="flex items-center justify-between text-[9px] font-mono p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
              <span class="text-slate-400">{{ r.label }}</span>
              <span :class="r.tone">{{ r.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hud-card p-0 overflow-hidden">
      <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Registro de comunicaciones</h3>
        <span class="text-[9px] font-mono text-slate-500">{{ records.length }} REGISTROS</span>
      </div>
      <DataTable :columns="columns" :rows="records" row-key="id">
        <template #cell-visitor_id="{ row }">
          <span class="text-slate-300">{{ row.visitor_id }}</span>
          <span class="text-[8px] text-slate-600 block">{{ row.channel }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="badge text-[8px] py-0 px-1.5" :class="row.responded ? 'badge-green' : row.status === 'enviado' ? 'badge-amber' : 'badge-muted'">
            {{ row.status.replace('_', ' ') }}
          </span>
        </template>
        <template #cell-outcome="{ row }">
          <span class="text-[9px]" :class="row.outcome === 'compro' ? 'text-emerald-300' : row.outcome === 'sin_respuesta' ? 'text-slate-500' : 'text-cyan-300'">
            {{ row.outcome.replace('_', ' ') }}
          </span>
        </template>
        <template #cell-minutes_to_reply="{ row }">
          <span class="text-slate-400">{{ row.minutes_to_reply != null ? `${row.minutes_to_reply} min` : '—' }}</span>
        </template>
      </DataTable>
      <div class="p-3 border-t border-pulso-border/50 text-[8px] font-mono text-slate-500">
        🔒 Un mensaje registrado como enviado o entregado no se considera leído. La respuesta solo se marca cuando existe evidencia de contestación.
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
import { communicationStats, formatDate, number } from '../engine'

const { filtered } = useAnalytics()

const comm = computed(() => communicationStats(filtered.value))
const totalComms = computed(() => filtered.value.communications.length)
const leadToAppointment = computed(() => comm.value.leads ? Math.round((filtered.value.appointments.length / comm.value.leads) * 100) : 0)

const channelChart = computed(() => ({
  labels: comm.value.channels.map(c => c.channel),
  datasets: [
    { label: 'Enviados', data: comm.value.channels.map(c => c.sent), backgroundColor: '#38bdf8bb', borderRadius: 4 },
    { label: 'Respondidos', data: comm.value.channels.map(c => c.replied), backgroundColor: '#10b981bb', borderRadius: 4 },
  ],
}))

const statusChart = computed(() => {
  const map = new Map<string, number>()
  filtered.value.communications.forEach(c => map.set(c.status, (map.get(c.status) || 0) + 1))
  const palette = ['#10b981', '#38bdf8', '#f59e0b', '#8b5cf6', '#64748b']
  return {
    labels: [...map.keys()].map(s => s.replace('_', ' ')),
    datasets: [{ data: [...map.values()], backgroundColor: [...map.keys()].map((_, i) => `${palette[i % palette.length]}cc`), borderColor: [...map.keys()].map((_, i) => palette[i % palette.length]), borderWidth: 1 }],
  }
})

const replyChart = computed(() => {
  const buckets = [[0, 15], [16, 60], [61, 240], [241, 1440], [1441, 99999]]
  const vals = filtered.value.communications.filter(c => c.minutes_to_reply != null)
  return {
    labels: buckets.map(b => b[1] === 99999 ? '24h+' : b[1] === 15 ? '0–15m' : b[1] === 60 ? '16–60m' : b[1] === 240 ? '1–4h' : '4–24h'),
    datasets: [{ label: 'Respuestas', data: buckets.map(b => vals.filter(v => (v.minutes_to_reply || 0) >= b[0] && (v.minutes_to_reply || 0) <= b[1]).length), backgroundColor: '#8b5cf6bb', borderRadius: 4 }],
  }
})

const outcomes = computed(() => {
  const map = new Map<string, number>()
  filtered.value.communications.forEach(c => map.set(c.outcome, (map.get(c.outcome) || 0) + 1))
  const tone: Record<string, string> = { compro: 'text-emerald-300 font-bold', agendado: 'text-violet-300 font-bold', interesado: 'text-cyan-300', sin_respuesta: 'text-slate-500', no_interesado: 'text-rose-300', pendiente: 'text-amber-300' }
  return [...map.entries()].map(([label, count]) => ({ label: label.replace('_', ' '), count, tone: tone[label] || 'text-slate-300' }))
})

const records = computed(() =>
  [...filtered.value.communications].sort((a, b) => b.sent_at.localeCompare(a.sent_at)).slice(0, 15)
)

const channelColumns: Column[] = [
  { key: 'channel', label: 'Canal' },
  { key: 'sent', label: 'Enviados', align: 'right' },
  { key: 'replied', label: 'Respondidos', align: 'right' },
  { key: 'replyRate', label: 'Tasa respuesta', align: 'right' },
  { key: 'sales', label: 'Ventas', align: 'right' },
]

const columns: Column[] = [
  { key: 'visitor_id', label: 'Visitante' },
  { key: 'sent_at', label: 'Enviado', format: r => formatDate(r.sent_at, true) },
  { key: 'status', label: 'Estado' },
  { key: 'outcome', label: 'Resultado' },
  { key: 'minutes_to_reply', label: 'Respuesta', align: 'right' },
]

const groupedOptions = { plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const doughnutOptions = { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
</script>
