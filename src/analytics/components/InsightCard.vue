<template>
  <div class="hud-card border-l-2 group" :style="{ borderLeftColor: meta.color }">
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

    <!-- AI Chat Panel — solo para hallazgos tipo "bad" o "warn" -->
    <div v-if="insight.severity === 'bad' || insight.severity === 'warn'" class="mt-3 pt-3 border-t border-pulso-border/50">
      <button @click="chatOpen = !chatOpen" class="text-[9px] font-mono text-violet-400 hover:text-violet-200 flex items-center gap-1.5 transition-colors">
        🤖 {{ chatOpen ? 'CERRAR ASESOR IA ▲' : 'CONSULTAR A LA IA SOBRE ESTE PUNTO ▼' }}
      </button>

      <div v-if="chatOpen" class="mt-2 space-y-2">
        <!-- Historial de mensajes -->
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

        <!-- Input -->
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

const props = defineProps<{ insight: Insight }>()
const open = ref(false)

// --- AI Chat state ---
const chatOpen = ref(false)
const chatInput = ref('')
const aiLoading = ref(false)
const chatMessages = ref<ChatMessage[]>([])
const chatScrollRef = ref<HTMLElement | null>(null)

async function sendChat() {
  const q = chatInput.value.trim()
  if (!q || aiLoading.value) return
  chatInput.value = ''
  chatMessages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: q,
    timestamp: new Date().toISOString()
  })
  aiLoading.value = true
  await nextTick()
  scrollChatToBottom()
  try {
    const answer = await askInsightAdvisor(props.insight, q, chatMessages.value)
    chatMessages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date().toISOString()
    })
  } finally {
    aiLoading.value = false
    await nextTick()
    scrollChatToBottom()
  }
}

function scrollChatToBottom() {
  if (chatScrollRef.value) {
    chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
  }
}

const MAP: Record<string, { color: string; border: string; bg: string; icon: string }> = {
  good: { color: '#34d399', border: 'rgba(16,185,129,.4)', bg: 'rgba(16,185,129,.1)', icon: '✅' },
  bad: { color: '#fb7185', border: 'rgba(244,63,94,.4)', bg: 'rgba(244,63,94,.1)', icon: '🚨' },
  warn: { color: '#fbbf24', border: 'rgba(245,158,11,.4)', bg: 'rgba(245,158,11,.1)', icon: '⚠️' },
  info: { color: '#38bdf8', border: 'rgba(56,189,248,.4)', bg: 'rgba(56,189,248,.1)', icon: '💡' },
}
const meta = computed(() => MAP[props.insight.severity] || MAP.info)
const confidenceClass = computed(() => props.insight.confidence === 'alta' ? 'badge-green' : props.insight.confidence === 'media' ? 'badge-amber' : 'badge-muted')
const impactClass = (v: string) => v === 'alto' ? 'text-rose-300' : v === 'medio' ? 'text-amber-300' : 'text-slate-300'
</script>
