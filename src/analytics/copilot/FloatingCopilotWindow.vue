<template>
  <!-- ========================================================== -->
  <!-- PÍLDORA FLOTANTE (ventana cerrada)                           -->
  <!-- ========================================================== -->
  <Teleport to="body">
    <Transition name="pill-fade">
      <button
        v-if="!windowState.isOpen"
        @click="openWindow('dashboard')"
        class="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 px-3 py-2.5 rounded-full
               bg-[#0d1225]/95 border border-violet-500/60 shadow-xl shadow-violet-900/40
               text-white text-xs font-tech font-semibold
               hover:border-violet-400 hover:shadow-violet-500/50 hover:scale-105
               active:scale-95 transition-all duration-200 backdrop-blur-sm select-none"
        title="Abrir Consejo Asesor Estratégico"
      >
        <span class="text-base leading-none">🧠</span>
        <span class="hidden sm:block">Consejo Asesor</span>
        <span
          class="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-violet-500 text-[9px] font-bold px-1"
        >4</span>
      </button>
    </Transition>

    <!-- ========================================================= -->
    <!-- VENTANA FLOTANTE                                            -->
    <!-- ========================================================= -->
    <Transition name="window-pop">
      <div
        v-if="windowState.isOpen"
        ref="windowRef"
        :style="windowStyle"
        class="fixed z-[9998] flex flex-col rounded-xl border border-pulso-border
               bg-[#060a14]/92 backdrop-blur-md shadow-2xl shadow-black/60 overflow-hidden"
        style="user-select: none;"
      >
        <!-- ─── CABEZAL ─── -->
        <div
          class="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-pulso-border
                 bg-pulso-void/70 cursor-move"
          @pointerdown="startDrag"
        >
          <span class="text-sm leading-none shrink-0">🧠</span>
          <span class="font-tech text-xs text-white/90 font-semibold flex-1 truncate">
            Consejo Asesor Estratégico
            <span class="text-[9px] text-pulso-muted ml-1">· {{ activeRole?.badge }}</span>
          </span>

          <!-- Botones de modo vista -->
          <div class="flex items-center gap-0.5 shrink-0">
            <button
              v-for="[mode, label, icon] in viewModeOptions"
              :key="mode"
              @click.stop="setViewMode(mode as CopilotViewMode)"
              :title="label"
              class="px-1.5 py-0.5 rounded text-[9px] font-tech transition-colors"
              :class="windowState.viewMode === mode
                ? 'bg-violet-600/50 text-violet-200 border border-violet-500/50'
                : 'text-pulso-muted hover:text-white hover:bg-pulso-surface'"
            >{{ icon }}</button>
          </div>

          <div class="w-px h-4 bg-pulso-border/60 shrink-0" />

          <!-- Controles de ventana -->
          <div class="flex items-center gap-0.5 shrink-0">
            <button
              @click.stop="toggleMaximize"
              class="w-6 h-6 rounded flex items-center justify-center text-[11px] text-pulso-muted hover:text-white hover:bg-pulso-surface transition-colors"
              :title="windowState.isMaximized ? 'Restaurar' : 'Pantalla completa'"
            >{{ windowState.isMaximized ? '⊡' : '⛶' }}</button>
            <button
              @click.stop="closeToPill"
              class="w-6 h-6 rounded flex items-center justify-center text-[11px] text-pulso-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Minimizar a píldora"
            >✕</button>
          </div>
        </div>

        <!-- ─── CONTENIDO DINÁMICO ─── -->
        <div
          class="flex-1 overflow-hidden"
          :class="windowState.viewMode === 'split' ? 'flex flex-row' : 'flex flex-col'"
        >
          <!-- Dashboard View -->
          <div
            v-if="windowState.viewMode === 'dashboard' || windowState.viewMode === 'split'"
            class="overflow-hidden flex flex-col"
            :class="windowState.viewMode === 'split' ? 'w-1/2 border-r border-pulso-border' : 'flex-1'"
          >
            <CopilotDashboardView @select-card-prompt="handleCardPrompt" />
          </div>

          <!-- Chat View -->
          <div
            v-if="windowState.viewMode === 'chat' || windowState.viewMode === 'split'"
            class="overflow-hidden flex flex-col"
            :class="windowState.viewMode === 'split' ? 'flex-1' : 'flex-1'"
          >
            <CopilotChatView
              :command-data="resolvedCommandData"
              :screen-snapshot="snapshot"
            />
          </div>
        </div>

        <!-- ─── RESIZE HANDLE ─── -->
        <div
          v-if="!windowState.isMaximized"
          class="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-10 opacity-30 hover:opacity-80 transition-opacity"
          @pointerdown.stop="startResize"
          title="Redimensionar"
        >
          <svg viewBox="0 0 10 10" fill="currentColor" class="text-pulso-muted w-full h-full">
            <path d="M7 3 L10 3 L10 10 L3 10 L3 7 L7 7 Z" />
          </svg>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopilotStore, windowState, type CopilotViewMode } from './copilotMemoryStore'
import { useScreenContext } from './useScreenContext'
import { useCopilotAudit } from './useCopilotAudit'
import { COPILOT_ROLES } from './rolesCatalog'
import { useAnalytics } from '../store'
import { computeOptimizationCommandCenter } from '../engine'
import CopilotDashboardView from './CopilotDashboardView.vue'
import CopilotChatView from './CopilotChatView.vue'

const { openWindow, closeToPill, toggleMaximize, setViewMode, activeRoleId } = useCopilotStore()
const { snapshot } = useScreenContext()
const { commandData } = useCopilotAudit()

const { filtered, dataset } = useAnalytics()

// fallback: recalcular si useCopilotAudit no tiene datos aún
const resolvedCommandData = computed(() =>
  commandData.value ?? computeOptimizationCommandCenter(dataset.value, filtered.value)
)
// alias para CopilotChatView
const _commandData = resolvedCommandData

const activeRole = computed(() =>
  COPILOT_ROLES.find(r => r.id === activeRoleId.value) ?? COPILOT_ROLES[0]
)

const viewModeOptions: [string, string, string][] = [
  ['dashboard', 'Vista Hallazgos', '📊'],
  ['split', 'Vista Dividida', '⬜'],
  ['chat', 'Vista Chat', '💬'],
]

const windowRef = ref<HTMLElement | null>(null)

const windowStyle = computed(() => {
  if (windowState.isMaximized) {
    return { left: '0px', top: '0px', width: '100vw', height: '100vh', borderRadius: '0' }
  }
  return {
    left: `${windowState.x}px`,
    top: `${windowState.y}px`,
    width: `${windowState.width}px`,
    height: `${windowState.height}px`,
  }
})

// ─── DRAG ───
function startDrag(e: PointerEvent) {
  if (windowState.isMaximized) return
  const target = e.target as HTMLElement
  if (target.closest('button, input, textarea, select')) return
  const el = windowRef.value
  if (!el) return

  const startX = e.clientX - windowState.x
  const startY = e.clientY - windowState.y
  el.setPointerCapture(e.pointerId)

  const onMove = (ev: PointerEvent) => {
    windowState.x = Math.max(0, Math.min(window.innerWidth - windowState.width, ev.clientX - startX))
    windowState.y = Math.max(0, Math.min(window.innerHeight - 60, ev.clientY - startY))
  }
  const onUp = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
}

// ─── RESIZE ───
function startResize(e: PointerEvent) {
  if (windowState.isMaximized) return
  e.preventDefault()
  e.stopPropagation()
  const el = windowRef.value
  if (!el) return

  const startW = windowState.width
  const startH = windowState.height
  const startX = e.clientX
  const startY = e.clientY
  el.setPointerCapture(e.pointerId)

  const onMove = (ev: PointerEvent) => {
    windowState.width = Math.max(360, Math.min(window.innerWidth - windowState.x - 10, startW + ev.clientX - startX))
    windowState.height = Math.max(300, Math.min(window.innerHeight - windowState.y - 10, startH + ev.clientY - startY))
  }
  const onUp = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
}

function handleCardPrompt(_prompt: string) {
  setViewMode('chat')
}
</script>

<style scoped>
.pill-fade-enter-active,
.pill-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.pill-fade-enter-from,
.pill-fade-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(8px);
}

.window-pop-enter-active,
.window-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.window-pop-enter-from,
.window-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}
</style>
