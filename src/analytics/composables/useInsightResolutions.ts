// ============================================================================
// PULSO ANALYTICS — Sistema de Resoluciones de Insights con Re-apertura
// Fase 1: localStorage (instantáneo, sin backend)
// Fase 2: Supabase (historial permanente + verificación automática por cron)
// ============================================================================

import { ref, computed } from 'vue'
import { supabase } from '@/supabase'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type ResolutionStatus = 'active' | 'watching' | 'resolved' | 'reopened'

export interface InsightResolution {
  insight_key: string            // Corresponde al Insight.id
  status: ResolutionStatus
  resolved_at: string            // ISO date
  resolved_by?: string           // 'user' siempre por ahora
  note?: string                  // Nota opcional del usuario al marcar
  leads_at_resolution: number    // Total de leads cuando se marcó
  reopen_threshold: number       // Cuántos leads nuevos esperar para verificar
  metric_snapshot: string        // Valor de la métrica al momento de resolver (ej. "24%")
  reopened_at?: string           // Si fue reabierto
  reopen_reason?: string         // Por qué se reabrió
}

// ─── Storage key ────────────────────────────────────────────────────────────

const LS_KEY = 'pulso_insight_resolutions_v2'

// ─── Singleton reactivo ─────────────────────────────────────────────────────

const resolutions = ref<Record<string, InsightResolution>>({})
let initialized = false

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) resolutions.value = JSON.parse(raw)
  } catch {
    resolutions.value = {}
  }
}

function saveToStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(resolutions.value))
}

// ─── Composable principal ────────────────────────────────────────────────────

export function useInsightResolutions(currentLeadCount: number = 0) {
  if (!initialized) {
    loadFromStorage()
    initialized = true
  }

  /**
   * Obtiene el estado de resolución de un insight (o 'active' si no tiene)
   */
  function getStatus(insightKey: string): ResolutionStatus {
    return resolutions.value[insightKey]?.status ?? 'active'
  }

  function getResolution(insightKey: string): InsightResolution | undefined {
    return resolutions.value[insightKey]
  }

  /**
   * Marca un insight como "Ya lo implementé → En observación"
   */
  async function markAsImplemented(
    insightKey: string,
    opts: { note?: string; metricSnapshot: string; reopenAfterLeads?: number }
  ) {
    const resolution: InsightResolution = {
      insight_key: insightKey,
      status: 'watching',
      resolved_at: new Date().toISOString(),
      resolved_by: 'user',
      note: opts.note,
      leads_at_resolution: currentLeadCount,
      reopen_threshold: opts.reopenAfterLeads ?? 20,
      metric_snapshot: opts.metricSnapshot,
    }
    resolutions.value[insightKey] = resolution
    saveToStorage()

    // Fase 2: sincronizar con Supabase
    try {
      await supabase.from('insight_resolutions').upsert({
        insight_key: insightKey,
        status: 'watching',
        resolved_at: resolution.resolved_at,
        note: resolution.note ?? null,
        leads_at_resolution: currentLeadCount,
        reopen_threshold: resolution.reopen_threshold,
        metric_snapshot: resolution.metric_snapshot,
      }, { onConflict: 'insight_key' })
    } catch { /* Fase 1 sigue funcionando aunque falle Supabase */ }
  }

  /**
   * Confirma resolución definitiva (mejora comprobada)
   */
  async function markAsResolved(insightKey: string) {
    if (!resolutions.value[insightKey]) return
    resolutions.value[insightKey].status = 'resolved'
    saveToStorage()

    try {
      await supabase.from('insight_resolutions')
        .update({ status: 'resolved' })
        .eq('insight_key', insightKey)
    } catch {}
  }

  /**
   * Reabre un insight (problema persistió tras N leads)
   */
  async function reopenInsight(insightKey: string, reason: string) {
    if (!resolutions.value[insightKey]) return
    resolutions.value[insightKey].status = 'reopened'
    resolutions.value[insightKey].reopened_at = new Date().toISOString()
    resolutions.value[insightKey].reopen_reason = reason
    saveToStorage()

    try {
      await supabase.from('insight_resolutions')
        .update({
          status: 'reopened',
          reopened_at: new Date().toISOString(),
          reopen_reason: reason,
        })
        .eq('insight_key', insightKey)
    } catch {}
  }

  /**
   * Descarta / restaura a activo (el usuario cancela la resolución)
   */
  async function dismissResolution(insightKey: string) {
    delete resolutions.value[insightKey]
    saveToStorage()

    try {
      await supabase.from('insight_resolutions')
        .delete()
        .eq('insight_key', insightKey)
    } catch {}
  }

  /**
   * Verifica automáticamente todos los insights "en observación"
   * Se llama al cargar el dashboard cuando hay nuevos leads.
   * Regla: si han pasado >= reopen_threshold leads desde la resolución,
   * verifica si la métrica mejoró comparando el snapshot con el valor actual.
   */
  function runAutoVerification(
    currentMetrics: Record<string, { currentValue: string; improved: boolean }>
  ) {
    let changed = false
    for (const [key, res] of Object.entries(resolutions.value)) {
      if (res.status !== 'watching') continue

      const leadsSince = currentLeadCount - res.leads_at_resolution
      if (leadsSince < res.reopen_threshold) continue

      // Tiempo suficiente — verificar si mejoró
      const metricData = currentMetrics[key]
      if (!metricData) continue

      if (metricData.improved) {
        resolutions.value[key].status = 'resolved'
      } else {
        const reason = `Métrica no mejoró tras ${leadsSince} leads nuevos (snapshot: ${res.metric_snapshot} → actual: ${metricData.currentValue})`
        resolutions.value[key].status = 'reopened'
        resolutions.value[key].reopened_at = new Date().toISOString()
        resolutions.value[key].reopen_reason = reason
      }
      changed = true
    }
    if (changed) saveToStorage()
  }

  // ─── Contadores para el panel ──────────────────────────────────────────

  const watchingCount = computed(() =>
    Object.values(resolutions.value).filter(r => r.status === 'watching').length
  )
  const resolvedCount = computed(() =>
    Object.values(resolutions.value).filter(r => r.status === 'resolved').length
  )
  const reopenedCount = computed(() =>
    Object.values(resolutions.value).filter(r => r.status === 'reopened').length
  )

  return {
    resolutions,
    getStatus,
    getResolution,
    markAsImplemented,
    markAsResolved,
    reopenInsight,
    dismissResolution,
    runAutoVerification,
    watchingCount,
    resolvedCount,
    reopenedCount,
  }
}
