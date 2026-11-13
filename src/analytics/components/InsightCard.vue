<template>
  <!-- ══ ESTADO: RESUELTO → compactado, casi invisible ════════════════════ -->
  <div
    v-if="resStatus === 'resolved'"
    class="hud-card border-l-2 opacity-25 hover:opacity-70 transition-all cursor-pointer group/resolved"
    style="border-left-color: #1e293b"
    @click="handleDismissResolution"
  >
    <div class="flex items-center gap-2 text-[9px] font-mono text-slate-600 group-hover/resolved:text-slate-400 transition-colors">
      <span>✅</span>
      <span class="line-through flex-1 truncate">{{ insight.title }}</span>
      <span class="text-[8px] text-slate-700 group-hover/resolved:text-slate-500">RESUELTO · clic para restaurar</span>
    </div>
  </div>

  <!-- ══ ESTADO: EN OBSERVACIÓN → visible pero compactado ═════════════════ -->
  <div
    v-else-if="resStatus === 'watching'"
    class="hud-card border-l-2 border-l-cyan-600/50 opacity-55 hover:opacity-85 transition-all"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-base flex-shrink-0">⏳</span>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="text-[8px] font-mono text-cyan-500 uppercase tracking-wider">En observación</span>
            <span class="text-[8px] font-mono text-slate-600">·</span>
            <span class="text-[8px] font-mono text-slate-500">{{ leadsRemaining }} leads hasta verificación</span>
          </div>
          <p class="text-[10px] font-mono text-slate-400 truncate">{{ insight.title }}</p>
          <p v-if="resolution?.note" class="text-[8px] font-mono text-slate-600 mt-0.5 italic">
            "{{ resolution.note }}"
          </p>
        </div>
      </div>
      <div class="flex gap-1.5 flex-shrink-0">
        <button
          @click="handleMarkResolved"
          class="text-[8px] font-mono px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors whitespace-nowrap"
        >
          ✓ Mejoró
        </button>
        <button
          @click="handleDismissResolution"
          class="text-[8px] font-mono px-2 py-1 rounded bg-slate-500/10 text-slate-500 border border-slate-600/30 hover:text-slate-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  </div>

  <!-- ══ ESTADO: ACTIVO o REABIERTO → tarjeta completa ═══════════════════ -->
  <div v-else class="hud-card border-l-2 group" :style="{ borderLeftColor: resStatus === 'reopened' ? '#f59e0b' : meta.color }">

    <!-- Badge reabierto -->
    <div v-if="resStatus === 'reopened'" class="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
      <span class="text-[9px]">🔁</span>
      <span class="text-[8px] font-mono text-amber-300 uppercase tracking-wider">Reabierto — la implementación no tuvo efecto</span>
      <span v-if="resolution?.reopened_at" class="text-[8px] font-mono text-amber-500/70 ml-1">· {{ formatDate(resolution.reopened_at!) }}</span>
    </div>

    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5 min-w-0">
        <div
          class="w-8 h-8 rounded-lg border flex items-center justify-center text-sm flex-shrink-0"
          :style="{ borderColor: meta.border, background: meta.bg, color: meta.color }"
        >
          {{ meta.icon }}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-0.5">
            <span class="badge text-[8px] py-0 px-1.5" :style="{ color: meta.color, borderColor: meta.border, background: meta.bg }">
              {{ insight.category.toUpperCase() }}
            </span>
            <span class="badge badge-muted text-[8px] py-0 px-1.5">P{{ insight.priority }}</span>
            <span class="badge text-[8px] py-0 px-1.5" :class="confidenceClass">
              CONFIANZA {{ insight.confidence.toUpperCase() }}
            </span>
          </div>
          <h4 class="font-tech text-[13px] font-bold text-slate-100 leading-snug group-hover:text-cyan-200 transition-colors">
            {{ insight.title }}
          </h4>
          <p class="text-[10px] font-mono text-slate-400 mt-1 leading-relaxed">{{ insight.finding }}</p>
        </div>
      </div>

      <div class="text-right flex-shrink-0 hidden sm:block">
        <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500">{{ insight.metric_label }}</p>
        <p class="font-tech text-lg font-bold" :style="{ color: meta.color }">{{ insight.metric_value }}</p>
        <p v-if="insight.comparison" class="text-[8px] font-mono text-slate-600 max-w-[150px]">{{ insight.comparison }}</p>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div class="p-2 rounded-lg bg-pulso-void/60 border border-pulso-border/50">
        <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">Evidencia</p>
        <p class="text-[10px] font-mono text-slate-400 leading-relaxed">{{ insight.evidence }}</p>
      </div>
      <div class="p-2 rounded-lg bg-pulso-void/60 border border-pulso-border/50">
        <p class="text-[8px] font-mono uppercase tracking-wider text-cyan-500 mb-0.5">Recomendación</p>
        <p class="text-[10px] font-mono text-slate-300 leading-relaxed">{{ insight.recommendation }}</p>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-3 text-[8px] font-mono text-slate-500">
        <span>IMPACTO: <strong :class="impactClass(insight.expected_impact)">{{ insight.expected_impact.toUpperCase() }}</strong></span>
        <span>ESFUERZO: <strong class="text-slate-300">{{ insight.effort.toUpperCase() }}</strong></span>
        <span>MUESTRA: <strong class="text-slate-300">{{ insight.data_points.toLocaleString() }}</strong></span>
      </div>
      <button @click="open = !open" class="text-[9px] font-mono text-cyan-400 hover:text-cyan-200">
        {{ open ? 'OCULTAR ACCIONES ▲' : 'VER ACCIONES ▼' }}
      </button>
    </div>

    <div v-if="open" class="mt-2 pt-2 border-t border-pulso-border/50 flex flex-wrap gap-1.5">
      <span v-for="a in insight.actions" :key="a" class="badge badge-cyan text-[9px]">→ {{ a }}</span>
    </div>

    <!-- ── Barra de resolución ───────────────────────────────────────────── -->
    <div v-if="insight.severity === 'bad' || insight.severity === 'warn'" class="mt-3 pt-3 border-t border-pulso-border/50">
      <!-- Panel "Marcar como implementado" -->
      <div v-if="!showResolutionForm" class="flex items-center gap-2 flex-wrap">
        <button @click="chatOpen = !chatOpen" class="text-[9px] font-mono text-violet-400 hover:text-violet-200 flex items-center gap-1.5 transition-colors">
          🤖 {{ chatOpen ? 'CERRAR ASESOR IA ▲' : 'CONSULTAR A LA IA ▼' }}
        </button>
        <div class="flex-1"></div>
        <button
          @click="showResolutionForm = true"
          class="text-[9px] font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/20 hover:text-cyan-200 transition-all flex items-center gap-1.5"
        >
          ✓ Ya lo implementé
        </button>
      </div>

      <!-- Formulario de resolución -->
      <div v-else class="space-y-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
        <p class="text-[9px] font-mono text-cyan-300 font-bold">Registrar implementación</p>
        <input
          v-model="resolutionNote"
          placeholder="¿Qué implementaste? (opcional)"
          class="w-full bg-pulso-void border border-pulso-border rounded-lg px-2 py-1.5 text-[9px] font-mono text-slate-200 focus:outline-none focus:border-cyan-400 placeholder-slate-600"
        />
        <div class="flex items-center gap-2">
          <span class="text-[8px] font-mono text-slate-500">Verificar después de</span>
          <select v-model="reopenThreshold" class="bg-pulso-void border border-pulso-border rounded px-2 py-1 text-[9px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400">
            <option :value="10">10 leads</option>
            <option :value="20">20 leads</option>
            <option :value="30">30 leads</option>
            <option :value="50">50 leads</option>
          </select>
          <span class="text-[8px] font-mono text-slate-500">sin mejoría → reabre</span>
        </div>
        <div class="flex gap-2">
          <button @click="handleMarkImplemented" class="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
            ✓ Confirmar
          </button>
          <button @click="showResolutionForm = false" class="text-[9px] font-mono px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
            Cancelar
          </button>
        </div>
      </div>

      <!-- AI Chat Panel -->
      <div v-if="chatOpen && !showResolutionForm" class="mt-2 space-y-2">
        <div ref="chatScrollRef" class="max-h-64 overflow-y-auto space-y-2 pr-1">
          <div v-if="chatMessages.length === 0" class="text-[9px] font-mono text-slate-500 italic py-2 text-center">
            Haz una pregunta sobre este punto crítico...
          </div>
          <div v-for="msg in chatMessages" :key="msg.id" class="text-[9px] font-mono leading-relaxed">
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <span class="inline-block bg-violet-500/20 border border-violet-500/30 rounded-lg px-2 py-1 text-violet-200 max-w-[85%]">{{ msg.content }}</span>
            </div>
            <div v-else class="flex justify-start">
              <div class="bg-pulso-void/80 border border-pulso-border/60 rounded-lg px-2.5 py-2 text-slate-300 max-w-[95%] whitespace-pre-wrap leading-relaxed">{{ msg.content }}</div>
            </div>
          </div>
          <div v-if="aiLoading" class="text-[9px] font-mono text-violet-400 animate-pulse flex items-center gap-1.5">
            <span>🤖</span><span>Analizando datos del hallazgo...</span>
          </div>
        </div>
        <div class="flex gap-1.5">
          <input
            v-model="chatInput"
            @keyup.enter="sendChat"
            :disabled="aiLoading"
            placeholder="Pregunta sobre este problema..."
            class="flex-1 bg-pulso-void border border-pulso-border rounded-lg px-2 py-1.5 text-[9px] font-mono text-slate-200 focus:outline-none focus:border-violet-400 placeholder-slate-600 disabled:opacity-50"
          />
          <button
            @click="sendChat"
            :disabled="aiLoading || !chatInput.trim()"
            class="btn-hud text-[9px] py-1.5 px-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >→</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import type { Insight } from '../types'
import { askInsightAdvisor, type ChatMessage } from '../aiAdvisor'
import { useInsightResolutions } from '../composables/useInsightResolutions'

const props = defineProps<{ insight: Insight; currentLeadCount?: number }>()
const open = ref(false)

// ─── Resoluciones ───────────────────────────────────────────────────────────
const {
  getStatus,
  getResolution,
  markAsImplemented,
  markAsResolved,
  dismissResolution,
} = useInsightResolutions(props.currentLeadCount ?? 0)

const resStatus = computed(() => getStatus(props.insight.id))
const resolution = computed(() => getResolution(props.insight.id))

const showResolutionForm = ref(false)
const resolutionNote = ref('')
const reopenThreshold = ref(20)

const leadsRemaining = computed(() => {
  if (!resolution.value) return 0
  const passed = (props.currentLeadCount ?? 0) - resolution.value.leads_at_resolution
  return Math.max(0, resolution.value.reopen_threshold - passed)
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })
}

async function handleMarkImplemented() {
  await markAsImplemented(props.insight.id, {
    note: resolutionNote.value || undefined,
    metricSnapshot: props.insight.metric_value,
    reopenAfterLeads: reopenThreshold.value,
  })
  showResolutionForm.value = false
  resolutionNote.value = ''
}

async function handleMarkResolved() {
  await markAsResolved(props.insight.id)
}

async function handleDismissResolution() {
  await dismissResolution(props.insight.id)
}

// ─── AI Chat ────────────────────────────────────────────────────────────────
const chatOpen = ref(false)
const chatInput = ref('')
const aiLoading = ref(false)
const chatMessages = ref<ChatMessage[]>([])
const chatScrollRef = ref<HTMLElement | null>(null)

async function sendChat() {
  const q = chatInput.value.trim()
  if (!q || aiLoading.value) return
  chatInput.value = ''
  chatMessages.value.push({ id: Date.now().toString(), role: 'user', content: q, timestamp: new Date().toISOString() })
  aiLoading.value = true
  await nextTick()
  scrollChatToBottom()
  try {
    const answer = await askInsightAdvisor(props.insight, q, chatMessages.value)
    chatMessages.value.push({ id: (Date.now() + 1).toString(), role: 'assistant', content: answer, timestamp: new Date().toISOString() })
  } finally {
    aiLoading.value = false
    await nextTick()
    scrollChatToBottom()
  }
}

function scrollChatToBottom() {
  if (chatScrollRef.value) chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const MAP: Record<string, { color: string; border: string; bg: string; icon: string }> = {
  good: { color: '#34d399', border: 'rgba(16,185,129,.4)', bg: 'rgba(16,185,129,.1)', icon: '✅' },
  bad:  { color: '#fb7185', border: 'rgba(244,63,94,.4)',  bg: 'rgba(244,63,94,.1)',  icon: '🚨' },
  warn: { color: '#fbbf24', border: 'rgba(245,158,11,.4)', bg: 'rgba(245,158,11,.1)', icon: '⚠️' },
  info: { color: '#38bdf8', border: 'rgba(56,189,248,.4)', bg: 'rgba(56,189,248,.1)', icon: '💡' },
}
const meta = computed(() => MAP[props.insight.severity] || MAP.info)
const confidenceClass = computed(() => props.insight.confidence === 'alta' ? 'badge-green' : props.insight.confidence === 'media' ? 'badge-amber' : 'badge-muted')
const impactClass = (v: string) => v === 'alto' ? 'text-rose-300' : v === 'medio' ? 'text-amber-300' : 'text-slate-300'
</script>
