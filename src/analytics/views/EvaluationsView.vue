<template>
  <PageHeader
    code="08 // EVALUATIONS & QUESTIONS"
    title="Evaluaciones, preguntas y abandono"
    description="Comportamiento pregunta por pregunta: vistas, respuestas, tiempo, cambios y abandonos. La información de salud visual se trata como sensible y nunca se envía a plataformas publicitarias."
  >
    <template #actions>
      <span class="badge badge-amber text-[9px]">DATO SENSIBLE · ACCESO RESTRINGIDO</span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Iniciaron test" :value="number(kpis.quizStarted)" icon="📝" note="Personas únicas" />
      <StatCard label="Completaron" :value="number(kpis.quizCompleted)" icon="✅" tone="green" note="Llegaron al resultado" />
      <StatCard label="Tasa de finalización" :value="`${completionRate}%`" icon="🎯" tone="green" note="Completados / iniciados" />
      <StatCard label="Abandono" :value="`${kpis.abandonRate}%`" icon="🚪" tone="rose" note="No completan el test" />
      <StatCard label="Tiempo medio" :value="`${avgQuizSeconds}s`" icon="⏱️" note="Duración del test" />
      <StatCard label="Pregunta más lenta" :value="slowest.question_id.toUpperCase()" icon="🐢" tone="amber" :note="`${slowest.avgSeconds}s · ${slowest.question.slice(0, 30)}…`" />
      <StatCard label="Leads post-test" :value="number(kpis.leads)" icon="🧾" tone="violet" note="Completaron y dejaron datos" />
      <StatCard label="Ventas post-test" :value="number(kpis.sales)" icon="💳" tone="green" note="Resultado comercial" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <ChartCard
        title="Embudo de la evaluación"
        subtitle="Personas que llegan a cada pregunta"
        type="bar"
        :data="questionFunnelChart"
        :height="250"
        :options="horizontalOptions"
        class="xl:col-span-2"
      />
      <ChartCard
        title="Abandono por pregunta"
        subtitle="Porcentaje que no responde"
        type="bar"
        :data="abandonChart"
        :height="250"
        :options="horizontalOptions"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card p-0 overflow-hidden xl:col-span-2">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Análisis por pregunta</h3>
          <span class="text-[9px] font-mono text-slate-500">CLIC PARA VER RESPUESTAS</span>
        </div>
        <DataTable :columns="columns" :rows="questions" row-key="question_id" clickable @row-click="q => selectedQuestion = q.question_id">
          <template #cell-question="{ row }">
            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[8px] text-cyan-300 font-bold flex-shrink-0 mt-0.5">{{ row.step }}</span>
              <span class="text-slate-200 text-[10px] leading-snug">{{ row.question }}</span>
            </div>
          </template>
          <template #cell-answerRate="{ row }">
            <span :class="row.answerRate < 88 ? 'text-rose-300 font-bold' : 'text-emerald-300'">{{ row.answerRate }}%</span>
          </template>
          <template #cell-abandons="{ row }">
            <span :class="row.abandons > 0 ? 'text-rose-300' : 'text-slate-600'">{{ row.abandons }}</span>
          </template>
          <template #cell-changedRate="{ row }">
            <span class="text-amber-300">{{ row.changedRate }}%</span>
          </template>
          <template #cell-avgSeconds="{ row }">
            <span :class="row.avgSeconds > 25 ? 'text-rose-300' : 'text-slate-300'">{{ row.avgSeconds }}s</span>
          </template>
        </DataTable>
      </div>

      <div class="space-y-4">
        <ChartCard
          :title="`Respuestas · ${selectedQuestionData?.question_id?.toUpperCase() || '—'}`"
          subtitle="Distribución de opciones elegidas"
          type="doughnut"
          :data="answersChart"
          :height="230"
          :options="doughnutOptions"
          :empty="answersChart.labels.length === 0"
        />
        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Comparación compradores / no compradores
          </h3>
          <div class="space-y-2 text-[9px] font-mono">
            <div class="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/20">
              <span class="text-slate-400">Tasa de finalización · compradores</span>
              <span class="text-emerald-300 font-bold">{{ buyerCompletion }}%</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-slate-500/5 border border-slate-500/20">
              <span class="text-slate-400">Tasa de finalización · no compradores</span>
              <span class="text-slate-300 font-bold">{{ nonBuyerCompletion }}%</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-cyan-500/5 border border-cyan-500/20">
              <span class="text-slate-400">Combinación más frecuente (compradores)</span>
              <span class="text-cyan-300 font-bold text-right max-w-[120px] truncate">{{ topCombo }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard title="Tiempo medio de respuesta" subtitle="Segundos por pregunta" type="bar" :data="timeChart" :height="220" :options="barOptions" />
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Diagnóstico de la evaluación
        </h3>
        <div class="space-y-2">
          <div class="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/25">
            <p class="text-[10px] font-bold text-rose-300">Pregunta crítica: {{ worstQuestion.question_id.toUpperCase() }}</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5 leading-relaxed">
              “{{ worstQuestion.question }}” registra {{ worstQuestion.abandons }} abandonos ({{ 100 - worstQuestion.answerRate }}% de quienes la ven).
              Tiempo medio: {{ worstQuestion.avgSeconds }}s. Recomendación: simplificar opciones o reformularla.
            </p>
          </div>
          <div class="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/25">
            <p class="text-[10px] font-bold text-amber-300">Pregunta más lenta: {{ slowest.question_id.toUpperCase() }}</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5 leading-relaxed">
              {{ slowest.avgSeconds }}s de media. Una pregunta lenta no siempre es mala, pero combinada con abandono indica fricción.
            </p>
          </div>
          <div class="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/25">
            <p class="text-[10px] font-bold text-cyan-300">Oportunidad de mejora</p>
            <p class="text-[9px] font-mono text-slate-400 mt-0.5 leading-relaxed">
              Completar el test eleva la probabilidad de dejar datos y agendar. Recuperar 10 puntos de finalización podría añadir ~{{ potentialLeads }} leads potenciales en este período.
            </p>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { number, questionStats } from '../engine'

const { filtered, kpis } = useAnalytics()
const questions = computed(() => questionStats(filtered.value))
const selectedQuestion = ref('')

watch(questions, list => {
  if (!selectedQuestion.value && list.length) selectedQuestion.value = list[0].question_id
}, { immediate: true })

const completionRate = computed(() => kpis.value.quizStarted ? Math.round((kpis.value.quizCompleted / kpis.value.quizStarted) * 100) : 0)
const avgQuizSeconds = computed(() => {
  const steps = filtered.value.sessions.flatMap(s => s.quiz_steps)
  const answered = steps.filter(s => s.answered)
  return answered.length ? Math.round(answered.reduce((a, s) => a + s.time_ms, 0) / answered.length / 1000) : 0
})
const slowest = computed(() => [...questions.value].sort((a, b) => b.avgSeconds - a.avgSeconds)[0] || { question_id: '—', question: '', avgSeconds: 0 })
const worstQuestion = computed(() => [...questions.value].sort((a, b) => b.abandons - a.abandons)[0] || { question_id: '—', question: '', abandons: 0, answerRate: 100, avgSeconds: 0 })

const selectedQuestionData = computed(() => questions.value.find(q => q.question_id === selectedQuestion.value))

const answersChart = computed(() => {
  const map = new Map<string, number>()
  filtered.value.sessions.forEach(s => {
    s.quiz_steps.filter(q => q.question_id === selectedQuestion.value && q.answered && q.answer).forEach(q => {
      map.set(q.answer!, (map.get(q.answer!) || 0) + 1)
    })
  })
  const palette = ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
  return {
    labels: [...map.keys()],
    datasets: [{ data: [...map.values()], backgroundColor: [...map.keys()].map((_, i) => `${palette[i % palette.length]}cc`), borderColor: [...map.keys()].map((_, i) => palette[i % palette.length]), borderWidth: 1 }],
  }
})

const questionFunnelChart = computed(() => ({
  labels: questions.value.map(q => `P${q.step}`),
  datasets: [{
    label: 'Personas que llegan',
    data: questions.value.map(q => q.views),
    backgroundColor: '#38bdf8bb',
    borderRadius: 4,
  }],
}))

const abandonChart = computed(() => ({
  labels: questions.value.map(q => `P${q.step}`),
  datasets: [{
    label: 'Abandonos',
    data: questions.value.map(q => q.abandons),
    backgroundColor: questions.value.map(q => q.abandons > 0 ? '#f43f5ecc' : '#1d2a48'),
    borderRadius: 4,
  }],
}))

const timeChart = computed(() => ({
  labels: questions.value.map(q => `P${q.step}`),
  datasets: [{ label: 'Segundos', data: questions.value.map(q => q.avgSeconds), backgroundColor: '#8b5cf6bb', borderRadius: 4 }],
}))

const buyerSessions = computed(() => filtered.value.sessions.filter(s => s.purchased))
const nonBuyerSessions = computed(() => filtered.value.sessions.filter(s => !s.purchased))
const buyerCompletion = computed(() => buyerSessions.value.length ? Math.round((buyerSessions.value.filter(s => s.quiz_completed).length / buyerSessions.value.length) * 100) : 0)
const nonBuyerCompletion = computed(() => nonBuyerSessions.value.length ? Math.round((nonBuyerSessions.value.filter(s => s.quiz_completed).length / nonBuyerSessions.value.length) * 100) : 0)

const topCombo = computed(() => {
  const map = new Map<string, number>()
  buyerSessions.value.forEach(s => {
    if (!s.quiz_completed) return
    const combo = s.quiz_steps.filter(q => q.answered).map(q => q.answer).join(' / ')
    map.set(combo, (map.get(combo) || 0) + 1)
  })
  const top = [...map.entries()].sort((a, b) => b[1] - a[1])[0]
  return top ? top[0] : '—'
})

const potentialLeads = computed(() => {
  const lost = Math.max(0, kpis.value.quizStarted - kpis.value.quizCompleted)
  const recovered = Math.round(lost * 0.25)
  const rate = kpis.value.quizCompleted ? kpis.value.leads / kpis.value.quizCompleted : 0
  return Math.round(recovered * rate)
})

const columns: Column[] = [
  { key: 'question', label: 'Pregunta' },
  { key: 'views', label: 'Vistas', align: 'right' },
  { key: 'answers', label: 'Respuestas', align: 'right' },
  { key: 'answerRate', label: 'Tasa resp.', align: 'right' },
  { key: 'abandons', label: 'Abandonos', align: 'right' },
  { key: 'avgSeconds', label: 'Tiempo', align: 'right' },
  { key: 'changedRate', label: 'Cambios', align: 'right' },
  { key: 'topAnswer', label: 'Respuesta top' },
]

const barOptions = { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b' } }, y: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } } } }
const horizontalOptions = { indexAxis: 'y' as const, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(29,42,72,.35)' }, ticks: { color: '#64748b' } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } } } }
const doughnutOptions = { cutout: '58%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 7, boxHeight: 7, usePointStyle: true, padding: 8, font: { size: 8 } } } } }
</script>
