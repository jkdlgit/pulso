<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- SELECTOR DE ROL -->
    <div class="shrink-0 flex gap-1.5 flex-wrap px-3 py-2 border-b border-pulso-border bg-pulso-void/60">
      <button
        v-for="role in COPILOT_ROLES"
        :key="role.id"
        @click="selectRole(role.id)"
        :title="role.description"
        class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-tech font-semibold transition-all duration-150 border"
        :class="[
          activeRoleId === role.id
            ? [role.color, role.borderColor, role.bgSoft, 'ring-1 ring-current/50']
            : 'text-pulso-muted border-pulso-border/50 bg-transparent hover:bg-pulso-surface hover:text-white'
        ]"
      >
        <span class="text-[11px]">{{ role.icon }}</span>
        <span>{{ role.badge }}</span>
      </button>
    </div>

    <!-- LISTA DE MENSAJES -->
    <div
      ref="chatScrollRef"
      class="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth"
    >
      <!-- Estado vacío -->
      <div v-if="chatMessages.length === 0" class="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
        <div class="text-4xl">{{ activeRole?.icon ?? '⚖️' }}</div>
        <p class="font-tech text-sm text-pulso-muted">
          Hola, soy el <span :class="activeRole?.color ?? 'text-violet-300'">{{ activeRole?.name ?? 'Consejo Asesor' }}</span>.<br>
          Pregúntame lo que quieras sobre el dashboard o la campaña.
        </p>
        <!-- Sugerencias rápidas -->
        <div class="flex flex-col gap-1.5 w-full mt-2">
          <button
            v-for="sug in quickSuggestions"
            :key="sug"
            @click="injectPrompt(sug)"
            class="text-left text-[11px] px-3 py-2 rounded-lg border border-pulso-border/60 bg-pulso-surface/40 hover:bg-pulso-surface text-pulso-muted hover:text-white transition-colors font-mono"
          >
            {{ sug }}
          </button>
        </div>
      </div>

      <!-- Mensajes -->
      <div
        v-for="msg in chatMessages"
        :key="msg.id"
        class="flex gap-2"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- Burbuja Asistente -->
        <div v-if="msg.role === 'assistant'" class="flex gap-2 max-w-[92%]">
          <div class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
            :class="activeRole?.bgSoft ?? 'bg-violet-500/20'">
            {{ activeRole?.icon ?? '⚖️' }}
          </div>
          <div class="rounded-xl rounded-tl-none bg-pulso-surface border border-pulso-border/70 px-3 py-2.5 text-xs text-white/90 leading-relaxed prose-dark max-w-full"
            v-html="renderMarkdown(msg.content)" />
        </div>

        <!-- Burbuja Usuario -->
        <div v-else class="max-w-[85%]">
          <div class="rounded-xl rounded-tr-none bg-violet-600/25 border border-violet-500/30 px-3 py-2 text-xs text-white/90 whitespace-pre-wrap leading-relaxed">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- Indicador de escritura -->
      <div v-if="aiLoading" class="flex gap-2 items-start">
        <div class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
          :class="activeRole?.bgSoft ?? 'bg-violet-500/20'">
          {{ activeRole?.icon ?? '⚖️' }}
        </div>
        <div class="rounded-xl rounded-tl-none bg-pulso-surface border border-pulso-border/70 px-3 py-2.5 text-xs text-pulso-muted flex items-center gap-2">
          <span class="animate-pulse">Consultando al Consejo Asesor</span>
          <span class="flex gap-0.5">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    </div>

    <!-- ZONA DE INPUT -->
    <div class="shrink-0 border-t border-pulso-border bg-pulso-void/80 px-3 py-2.5 flex flex-col gap-2">
      <!-- Contexto de hallazgo activo -->
      <div v-if="activeFindingContext" class="flex items-start gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-[10px] text-cyan-300 font-mono">
        <span class="shrink-0">📌</span>
        <span class="truncate">Hallazgo: {{ activeFindingContext.slice(0, 80) }}...</span>
        <button @click="activeFindingContext = null" class="shrink-0 text-cyan-400/60 hover:text-white ml-auto">✕</button>
      </div>

      <div class="flex gap-2 items-end">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          @keydown="handleKeydown"
          :disabled="aiLoading"
          placeholder="Pregunta lo que necesites… (Enter para enviar, Shift+Enter para saltar línea)"
          rows="2"
          class="flex-1 resize-none bg-pulso-surface border border-pulso-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-pulso-muted focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors font-mono leading-relaxed disabled:opacity-50"
        />
        <button
          @click="submitMessage"
          :disabled="aiLoading || !inputText.trim()"
          class="shrink-0 w-9 h-9 rounded-lg bg-violet-600/80 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-white"
          title="Enviar (Enter)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Footer acciones -->
      <div class="flex items-center justify-between">
        <span class="text-[9px] text-pulso-muted font-mono">
          {{ activeRole?.title ?? 'Orquestador 360°' }} · Contexto: {{ props.screenSnapshot.pageTitle }}
        </span>
        <button
          @click="clearChatPreservingMemory"
          class="text-[9px] text-pulso-muted hover:text-amber-300 font-mono transition-colors flex items-center gap-1"
          title="Limpiar mensajes visibles (la memoria ejecutiva se conserva)"
        >
          🗑 Limpiar chat (memoria preservada)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { COPILOT_ROLES } from './rolesCatalog'
import {
  useCopilotStore,
  chatMessages,
  activeRoleId,
  activeFindingContext,
  aiLoading,
} from './copilotMemoryStore'
import type { ScreenContextSnapshot } from './useScreenContext'

interface Props {
  commandData: any
  screenSnapshot: ScreenContextSnapshot
}

const props = defineProps<Props>()

const { selectRole, clearChatPreservingMemory, sendMessage } = useCopilotStore()

const inputText = ref('')
const chatScrollRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const activeRole = computed(() => COPILOT_ROLES.find(r => r.id === activeRoleId.value) ?? COPILOT_ROLES[0])

const quickSuggestions = computed(() => [
  `¿Cuál es la mayor fuga en el embudo de ${props.screenSnapshot.pageTitle}?`,
  '¿Cómo mejoraría el ROAS si cambio el público objetivo?',
  '¿Qué ajuste inmediato aumentaría los agendamientos de hoy?',
  '¿Cuánto dinero se está perdiendo por abandono del quiz?',
])

// Auto-scroll al fondo en cada nuevo mensaje
watch(
  () => chatMessages.value.length,
  async () => {
    await nextTick()
    if (chatScrollRef.value) {
      chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
    }
  }
)

function handleKeydown(e: KeyboardEvent) {
  // Ignorar mientras IME está componiendo (acentos, teclados asiáticos)
  if (e.isComposing) return
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitMessage()
  }
  // Shift+Enter → saltar línea (comportamiento nativo del textarea, no prevenir)
}

async function submitMessage() {
  const text = inputText.value.trim()
  if (!text || aiLoading.value) return
  inputText.value = ''
  await sendMessage(text, props.commandData, props.screenSnapshot)
  await nextTick()
  textareaRef.value?.focus()
}

function injectPrompt(prompt: string) {
  inputText.value = prompt
  nextTick(() => textareaRef.value?.focus())
}

/** Renderiza markdown básico en HTML seguro */
function renderMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-white/80">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-pulso-surface border border-pulso-border/50 px-1 rounded text-cyan-300 text-[10px]">$1</code>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3 class="text-sm font-tech font-bold text-violet-300 mt-3 mb-1">$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2 class="text-sm font-tech font-bold text-cyan-300 mt-3 mb-1">$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1 class="text-base font-tech font-bold text-white mt-3 mb-1">$1</h1>')
    .replace(/^[-*]\s+(.+)$/gm, '<li class="ml-3 list-disc text-white/80">$1</li>')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ml-3 list-decimal text-white/80">$2</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br>')
}
</script>
