// ============================================================================
// PULSO ANALYTICS — Estado global en vivo, filtros compartidos y vistas guardadas
// Sincronización en tiempo real vía BroadcastChannel y Supabase Realtime
// ============================================================================

import { computed, reactive, ref } from 'vue'
import {
  applyFilters, buildFunnel, buildInsights, buildTimeseries, computeKpis,
  type FilteredData,
} from './engine'
import {
  createEmptyLiveDataset, getLocalEvents, getLocalSessions,
  loadLiveDataset, saveLocalEvents, saveLocalSessions,
} from './repo'
import { devDb } from './supabaseAnalytics'
import type { AnalyticsDataset, AnalyticsEvent, AnalyticsFilters, SavedView, Session, Visitor } from './types'

const STORAGE_KEY = 'pulso_analytics_saved_views_v1'

// Inicializa directamente con un dataset REAL (mode: 'live'), nunca con data quemada
const dataset = ref<AnalyticsDataset>(createEmptyLiveDataset())
const loading = ref(false)
const initialized = ref(false)
const error = ref('')

const defaultFilters: AnalyticsFilters = {
  business: 'all',
  days: 30,
  source: 'all',
  campaign: 'all',
  device: 'all',
  visitor: 'all',
  buyer: 'all',
  compare: true,
  quiz: 'all',
}

const filters = reactive<AnalyticsFilters>({ ...defaultFilters })

function loadSaved(): SavedView[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
const savedViews = ref<SavedView[]>(loadSaved())

// Canal inter-pestañas para actualización instantánea en 1ms
let broadcastChannel: BroadcastChannel | null = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('pulso_analytics_channel')
    broadcastChannel.onmessage = (msg) => {
      if (msg.data?.type === 'PULSO_EVENT') {
        handleIncomingEvent(msg.data.payload)
      } else if (msg.data?.type === 'PULSO_REFRESH') {
        init(true)
      }
    }
  } catch (e) {
    console.warn('[PULSO STORE] BroadcastChannel no disponible:', e)
  }
}

// Suscripción Realtime a Supabase dev.leads
let realtimeSubscribed = false
function setupRealtime() {
  if (realtimeSubscribed) return
  realtimeSubscribed = true
  try {
    devDb
      .channel('public:leads_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'dev', table: 'leads' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          console.log('📡 [PULSO REALTIME] Cambio detectado en Supabase dev.leads:', payload.eventType)
          init(true)
        }
      )
      .subscribe()
  } catch (e) {
    console.warn('[PULSO STORE] No se pudo conectar a Supabase Realtime:', e)
  }
}

/**
 * Procesa un evento emitido en vivo desde cualquier Quiz
 */
function handleIncomingEvent(eventPayload: {
  event: AnalyticsEvent
  session?: Partial<Session>
  visitor?: Partial<Visitor>
}) {
  const { event, session, visitor } = eventPayload
  if (!event) return

  // 1. Agregar evento a dataset
  const exists = dataset.value.events.some(e => e.id === event.id)
  if (!exists) {
    dataset.value.events.unshift(event)
    saveLocalEvents(dataset.value.events)
  }

  // 2. Actualizar o agregar sesión
  if (session && session.id) {
    const sIdx = dataset.value.sessions.findIndex(s => s.id === session.id)
    if (sIdx >= 0) {
      Object.assign(dataset.value.sessions[sIdx], session)
    } else {
      dataset.value.sessions.unshift(session as Session)
    }
    saveLocalSessions(dataset.value.sessions)
  }

  // 3. Actualizar o agregar visitante
  if (visitor && visitor.id) {
    const vIdx = dataset.value.visitors.findIndex(v => v.id === visitor.id)
    if (vIdx >= 0) {
      Object.assign(dataset.value.visitors[vIdx], visitor)
    } else {
      dataset.value.visitors.unshift(visitor as Visitor)
    }
  }

  // Si fue una cita, registrar en appointments
  if (event.type === 'booking' && session) {
    const aptId = `apt_live_${Date.now()}`
    if (!dataset.value.appointments.some(a => a.session_id === session.id)) {
      dataset.value.appointments.unshift({
        id: aptId,
        business_id: session.business_id || 'optica',
        visitor_id: session.visitor_id || 'v_anon',
        session_id: session.id ?? '',
        created_at: new Date().toISOString(),
        scheduled_for: event.metadata?.fecha || new Date().toISOString(),
        status: 'confirmada',
        reminder: '24h',
        lead_time_hours: 24,
        source: session.source || 'directo',
      })
    }
  }

  dataset.value.generated_at = new Date().toISOString()
}

async function init(force = false) {
  if (initialized.value && !force) return
  initialized.value = true
  loading.value = true
  try {
    setupRealtime()
    const live = await loadLiveDataset()
    if (live) {
      dataset.value = live
    }
  } catch (e: any) {
    error.value = e?.message || 'Error sincronizando dataset analítico'
  } finally {
    loading.value = false
  }
}

// Polling suave en segundo plano cada 8s para sincronizar nuevos leads
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (initialized.value && !loading.value) {
      loadLiveDataset().then(live => {
        if (live && live.sessions.length >= dataset.value.sessions.length) {
          dataset.value = live
        }
      }).catch(() => {})
    }
  }, 8000)
}

const filtered = computed<FilteredData>(() => applyFilters(dataset.value, filters))
const previous = computed<FilteredData>(() => applyFilters(dataset.value, filters, Date.now() - filters.days * 86_400_000))
const kpis = computed(() => computeKpis(filtered.value))
const prevKpis = computed(() => computeKpis(previous.value))
const funnel = computed(() => buildFunnel(filtered.value))
const timeseries = computed(() => buildTimeseries(filtered.value))
const insights = computed(() => buildInsights(filtered.value))

const delta = (current: number, prev: number) => {
  if (!prev) return 0
  return Number((((current - prev) / prev) * 100).toFixed(1))
}

const business = computed(() => {
  const all = dataset.value.businesses
  if (filters.business === 'all') return null
  return all.find(b => b.id === filters.business) || null
})

const campaignsForFilter = computed(() =>
  dataset.value.campaigns.filter(c => filters.business === 'all' || c.business_id === filters.business)
)

function setBusiness(id: string) {
  filters.business = id
  if (filters.campaign !== 'all') {
    const c = dataset.value.campaigns.find(x => x.id === filters.campaign)
    if (c && id !== 'all' && c.business_id !== id) filters.campaign = 'all'
  }
}

function resetFilters() {
  Object.assign(filters, defaultFilters)
}

function saveView(name: string) {
  const view: SavedView = {
    id: `view_${Date.now()}`,
    name: name.trim() || 'Vista sin nombre',
    filters: { ...filters },
    created_at: new Date().toISOString(),
  }
  savedViews.value = [view, ...savedViews.value].slice(0, 30)
  persist()
  return view
}

function applyView(view: SavedView) {
  Object.assign(filters, { ...defaultFilters, ...view.filters })
}

function deleteView(id: string) {
  savedViews.value = savedViews.value.filter(v => v.id !== id)
  persist()
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedViews.value)) } catch { /* noop */ }
}

export function useAnalytics() {
  return {
    dataset,
    loading,
    initialized,
    error,
    filters,
    filtered,
    previous,
    kpis,
    prevKpis,
    funnel,
    timeseries,
    insights,
    business,
    campaignsForFilter,
    savedViews,
    init,
    resetFilters,
    setBusiness,
    saveView,
    applyView,
    deleteView,
    delta,
    handleIncomingEvent,
  }
}
