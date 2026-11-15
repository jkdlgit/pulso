// ============================================================================
// PULSO ANALYTICS COPILOT — Store de Estado, Geometría & Memoria Continua
// ============================================================================

import { reactive, ref, watch } from 'vue'
import type { ChatMessage } from '../aiAdvisor'
import { askDecisionAdvisor } from '../aiAdvisor'
import { COPILOT_ROLES, type SpecialistRole } from './rolesCatalog'
import type { ScreenContextSnapshot } from './useScreenContext'

export type CopilotViewMode = 'dashboard' | 'chat' | 'split'

interface WindowState {
  isOpen: boolean
  viewMode: CopilotViewMode
  isMaximized: boolean
  x: number
  y: number
  width: number
  height: number
}

const STORAGE_KEY_WINDOW = 'pulso_copilot_window_v2'
const STORAGE_KEY_LEDGER = 'pulso_copilot_decisions_v2'

function getDefaultWindowState(): WindowState {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const w = isMobile ? Math.min(window.innerWidth - 20, 420) : 620
  const h = isMobile ? Math.min(window.innerHeight - 80, 560) : 580
  const x = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - w - 24) : 100
  const y = typeof window !== 'undefined' ? Math.max(60, window.innerHeight - h - 30) : 80

  return {
    isOpen: false,
    viewMode: 'dashboard',
    isMaximized: false,
    x,
    y,
    width: w,
    height: h,
  }
}

function loadWindowState(): WindowState {
  if (typeof window === 'undefined') return getDefaultWindowState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WINDOW)
    if (!raw) return getDefaultWindowState()
    const parsed = JSON.parse(raw)
    // Clamp coordinates within current viewport
    parsed.x = Math.max(10, Math.min(window.innerWidth - 100, parsed.x || 100))
    parsed.y = Math.max(50, Math.min(window.innerHeight - 100, parsed.y || 80))
    parsed.width = Math.max(360, Math.min(window.innerWidth - 20, parsed.width || 620))
    parsed.height = Math.max(400, Math.min(window.innerHeight - 50, parsed.height || 580))
    return parsed
  } catch {
    return getDefaultWindowState()
  }
}

function loadDecisionLedger(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEDGER)
    return raw ? JSON.parse(raw) : [
      'Entrada directa activa: eliminada bienvenida en Quiz 1 y Quiz 2.',
      'Pre-conexión DNS y optimización 4G para Guayaquil aplicadas.',
      'Público objetivo prioritario: adultos con presbicia (+50 años, 61.6% del volumen).',
      'Presupuesto recomendado: 75% a Quiz 2 (VisiónCheck) y 25% a Quiz 1.',
      'Protocolo de agendamiento WhatsApp con doble alternativa (< 3 minutos).',
    ]
  } catch {
    return []
  }
}

export const windowState = reactive<WindowState>(loadWindowState())
export const decisionLedger = ref<string[]>(loadDecisionLedger())
export const chatMessages = ref<ChatMessage[]>([])
export const activeRoleId = ref<string>('auto')
export const activeFindingContext = ref<string | null>(null)
export const aiLoading = ref(false)

// Guardar ventana al cambiar
watch(
  () => ({ ...windowState }),
  st => {
    try {
      localStorage.setItem(STORAGE_KEY_WINDOW, JSON.stringify(st))
    } catch { /* noop */ }
  },
  { deep: true }
)

// Guardar acuerdos de decisión
watch(
  decisionLedger,
  ledger => {
    try {
      localStorage.setItem(STORAGE_KEY_LEDGER, JSON.stringify(ledger))
    } catch { /* noop */ }
  },
  { deep: true }
)

export function useCopilotStore() {
  function openWindow(mode?: CopilotViewMode) {
    if (mode) windowState.viewMode = mode
    windowState.isOpen = true
  }

  function closeToPill() {
    windowState.isOpen = false
  }

  function toggleMaximize() {
    windowState.isMaximized = !windowState.isMaximized
  }

  function setViewMode(mode: CopilotViewMode) {
    windowState.viewMode = mode
  }

  function selectRole(roleId: string) {
    activeRoleId.value = roleId
  }

  const activeRole = ref<SpecialistRole>(
    COPILOT_ROLES.find(r => r.id === activeRoleId.value) || COPILOT_ROLES[0]
  )
  watch(activeRoleId, id => {
    activeRole.value = COPILOT_ROLES.find(r => r.id === id) || COPILOT_ROLES[0]
  })

  function clearChatPreservingMemory() {
    chatMessages.value = [
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `### 🧹 Ventana de chat reiniciada (Memoria y Contexto Intactos)
He limpiado el historial visible para que puedas iniciar una nueva consulta sin distracciones.

**🔒 Resumen de Memoria Ejecutiva Activa:**
${decisionLedger.value.map(d => `- ${d}`).join('\n')}

*Los datos de tu pantalla actual, los registros de Supabase y el catálogo del sistema siguen 100% disponibles.* ¿En qué te puedo asesorar ahora?`,
        timestamp: new Date().toISOString(),
      },
    ]
  }

  function injectFindingToChat(prompt: string, contextSummary: string) {
    activeFindingContext.value = contextSummary
    windowState.viewMode = windowState.isMaximized ? 'split' : 'chat'
    windowState.isOpen = true
    return prompt
  }

  async function sendMessage(
    userText: string,
    commandData: any,
    screenSnapshot: ScreenContextSnapshot
  ): Promise<void> {
    const q = userText.trim()
    if (!q || aiLoading.value) return

    // Push mensaje del usuario
    chatMessages.value.push({
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    })

    aiLoading.value = true

    try {
      // Inyectar contexto de pantalla enriquecido en la consulta interna
      const enrichedPrompt = `[CONTEXTO DE PANTALLA EN VIVO]:
- Módulo actual: ${screenSnapshot.pageTitle} (${screenSnapshot.path})
- Área: ${screenSnapshot.pageArea}
- KPIs visibles: ${screenSnapshot.visibleKpis.sessions} sesiones, ${screenSnapshot.visibleKpis.appointments} citas, ${screenSnapshot.visibleKpis.sales} ventas
- Filtro activo: últimos ${screenSnapshot.activeFilters.days} días
${activeFindingContext.value ? `\n[HALLAZGO SELECCIONADO]: ${activeFindingContext.value}` : ''}
${activeRoleId.value !== 'auto' ? `\n[ROL ASIGNADO]: Responde explícitamente desde tu función como "${activeRole.value.name}" (${activeRole.value.title}).` : ''}

CONSULTA DEL USUARIO:
${q}`

      const answer = await askDecisionAdvisor(commandData, enrichedPrompt, chatMessages.value)

      chatMessages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
      })

      // Si la respuesta incluye un acuerdo o decisión relevante, registrarla
      if (/recomiend|decisi[oó]n|acuerdo|prioridad 1|paso 1/i.test(answer) && q.length > 20) {
        const shortDecision = `Consulta: "${q.slice(0, 50)}..." ➔ Analizada por ${activeRole.value.name}`
        if (!decisionLedger.value.includes(shortDecision)) {
          decisionLedger.value.unshift(shortDecision)
          if (decisionLedger.value.length > 10) decisionLedger.value.pop()
        }
      }
    } catch (err: any) {
      console.error('[COPILOT] Error al consultar:', err)
      chatMessages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Disculpa, ocurrió un error temporal al procesar tu consulta: ${err?.message || 'Error de red'}.`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      aiLoading.value = false
    }
  }

  return {
    windowState,
    decisionLedger,
    chatMessages,
    activeRoleId,
    activeRole,
    activeFindingContext,
    aiLoading,
    openWindow,
    closeToPill,
    toggleMaximize,
    setViewMode,
    selectRole,
    clearChatPreservingMemory,
    injectFindingToChat,
    sendMessage,
  }
}
