import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase, hasSupabaseConfig } from '@/supabase'
import { MOCK_CLIENTS, MOCK_SITES } from '@/mock'
import type { Lead, Event, KpiData, FunnelStep, DailyVisit, Client, QuizConfig } from '@/types'

export function usePulsoData(clientOrSiteKey: string, quizSlugParam?: string) {
  const leads = ref<Lead[]>([])
  const events = ref<Event[]>([])
  const loading = ref(false)
  const isRealtime = ref(false)

  // 1. Normalizar Cliente y Quiz a partir de los parámetros
  let resolvedClient = clientOrSiteKey
  let resolvedQuiz = quizSlugParam || ''

  if (!resolvedQuiz) {
    if (clientOrSiteKey.includes('/')) {
      const parts = clientOrSiteKey.split('/')
      resolvedClient = parts[0]
      resolvedQuiz = parts[1]
    } else if (clientOrSiteKey.includes('_')) {
      const parts = clientOrSiteKey.split('_')
      resolvedClient = parts[0]
      resolvedQuiz = parts[1]
    } else if (clientOrSiteKey === 'quiz1' || clientOrSiteKey === 'oculus') {
      resolvedClient = 'opticajohanna'
      resolvedQuiz = 'quiz1'
    } else if (clientOrSiteKey === 'quiz2') {
      resolvedClient = 'opticajohanna'
      resolvedQuiz = 'quiz2'
    } else {
      resolvedClient = clientOrSiteKey
      const foundClient = MOCK_CLIENTS.find(c => c.slug === clientOrSiteKey)
      resolvedQuiz = foundClient?.quizzes[0]?.quiz_key || 'quiz1'
    }
  }

  const clientSlug = ref(resolvedClient)
  const quizSlug = ref(resolvedQuiz)

  // Cliente activo
  const currentClient = computed<Client>(() => {
    return MOCK_CLIENTS.find(c => c.slug === clientSlug.value) || MOCK_CLIENTS[0]
  })

  // Quiz activo del cliente
  const currentQuiz = computed<QuizConfig>(() => {
    return currentClient.value.quizzes.find(q => q.quiz_key === quizSlug.value) || currentClient.value.quizzes[0]
  })

  // Determinar si el cliente cuenta con sistema local (/dashboard Oculus o CRM integrado)
  const hasLocalCrm = computed(() => {
    return !!currentClient.value?.has_local_crm
  })

  // Métricas estandarizadas inicializadas limpias en CERO
  const kpi = ref<KpiData>({
    visitas: 0,
    paso1: 0,
    paso2: 0,
    paso3: 0,
    completados: 0,
    reservas: 0,
    llegaron: 0,
    ventasCount: 0,
    ingresosTotal: 0,
    activeNow: 0,
  })

  const funnelData = ref<FunnelStep[]>([])
  const dailyData = ref<DailyVisit[]>([])
  const sources = ref<{ label: string; value: number; color: string }[]>([])

  async function loadData() {
    let pacientesList: any[] = []
    let pedidosList: any[] = []

    try {
      loading.value = true

      // 1. Consultar eventos del motor local de telemetría (/api/events)
      try {
        const res = await fetch(`http://localhost:5174/api/events?client=${clientSlug.value}&quiz=${quizSlug.value}`)
        if (res.ok) {
          const apiEvents = await res.json()
          if (Array.isArray(apiEvents)) {
            events.value = apiEvents
          }
        }
      } catch (e) {
        // Fallback si no responde la API interna
      }

      // 2. Consultar Supabase dev.events si existe
      if (hasSupabaseConfig) {
        try {
          const siteKey1 = `${clientSlug.value}_${quizSlug.value}`
          const { data: supaEvents } = await supabase
            .from('events')
            .select('*')
            .or(`site_key.eq.${siteKey1},site_key.eq.${quizSlug.value},site_key.eq.${clientSlug.value},site_key.eq.oculus`)
            .order('created_at', { ascending: false })

          if (supaEvents && supaEvents.length > 0) {
            const existingIds = new Set(events.value.map(e => e.id))
            supaEvents.forEach((se: any) => {
              if (!existingIds.has(se.id)) {
                events.value.push(se)
                existingIds.add(se.id)
              }
            })
          }
        } catch (e) {}

        // 3. Consultar Leads en Supabase
        try {
          let queryLeads = supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })

          if (clientSlug.value === 'opticajohanna' || clientSlug.value === 'oculus') {
            if (quizSlug.value === 'quiz1') {
              queryLeads = queryLeads.or('origen.eq.Quiz,origen.eq.quiz1,origen.eq.opticajohanna_quiz1,origen.is.null')
            } else if (quizSlug.value === 'quiz2') {
              queryLeads = queryLeads.or('origen.eq.quiz2,origen.eq.opticajohanna_quiz2')
            } else {
              queryLeads = queryLeads.or('origen.eq.Quiz,origen.eq.quiz1,origen.eq.quiz2,origen.is.null')
            }
          } else {
            const targetSite = `${clientSlug.value}_${quizSlug.value}`
            queryLeads = queryLeads.or(`origen.eq.${targetSite},origen.eq.${clientSlug.value}`)
          }

          const { data: leadsData } = await queryLeads
          let allLeadsRows: any[] = leadsData ? [...leadsData] : []

          // También consultar schema 'pro' en Óptica Johanna para unificar leads de producción
          if (clientSlug.value === 'opticajohanna' || clientSlug.value === 'oculus') {
            try {
              let proQuery = supabase.schema('pro').from('leads').select('*').order('created_at', { ascending: false })
              if (quizSlug.value === 'quiz1') {
                proQuery = proQuery.or('origen.eq.Quiz,origen.eq.quiz1,origen.eq.opticajohanna_quiz1,origen.is.null')
              } else if (quizSlug.value === 'quiz2') {
                proQuery = proQuery.or('origen.eq.quiz2,origen.eq.opticajohanna_quiz2')
              }
              const { data: proLeadsData } = await proQuery
              if (proLeadsData) {
                const knownPhones = new Set(allLeadsRows.map(l => l.telefono))
                proLeadsData.forEach((pl: any) => {
                  if (!knownPhones.has(pl.telefono)) {
                    allLeadsRows.push(pl)
                  }
                })
              }
            } catch (e) {}
          }

          if (allLeadsRows.length > 0) {
            leads.value = allLeadsRows.map((d: any) => ({
              id: d.id,
              site_id: d.origen || quizSlug.value,
              client_id: clientSlug.value,
              quiz_id: quizSlug.value,
              nombre: d.nombre,
              telefono: d.telefono,
              edad: d.edad,
              email: d.email || '',
              respuestas: d.respuestas,
              resultado: d.resultado,
              estado: d.estado || 'Nuevo',
              estado_cita: d.estado_cita,
              utm_source: d.utm_source || 'directo',
              created_at: d.created_at,
            }))
          }
        } catch (e) {}

        // 4. Si el cliente tiene sistema local (/dashboard Oculus), consultar Pacientes y Pedidos
        if (hasLocalCrm.value) {
          try {
            const [pacRes, pedRes, pacProRes, pedProRes] = await Promise.all([
              supabase.from('pacientes').select('id, lead_id'),
              supabase.from('pedidos').select('id, paciente_id, total, estado_pago, estado_pedido, created_at'),
              supabase.schema('pro').from('pacientes').select('id, lead_id'),
              supabase.schema('pro').from('pedidos').select('id, paciente_id, total, estado_pago, estado_pedido, created_at'),
            ])
            const allPac = [...(pacRes.data || []), ...(pacProRes.data || [])]
            const allPed = [...(pedRes.data || []), ...(pedProRes.data || [])]
            pacientesList = allPac
            pedidosList = allPed
          } catch (e) {
            console.warn('[PULSO] Error consultando pacientes/pedidos en Supabase:', e)
          }
        }
      }

      // 5. Calcular métricas estrictas
      calculateStrictMetrics(pacientesList, pedidosList)

    } catch (err) {
      console.error('[PULSO] Error en sincronización telemétrica:', err)
    } finally {
      loading.value = false
    }
  }

  function calculateStrictMetrics(pacientesList: any[] = [], pedidosList: any[] = []) {
    // Función auxiliar para contar personas / sesiones únicas por etapa de conversión
    function countUniqueSessions(eventList: Event[], eventType: string): number {
      const matching = eventList.filter(e => e.event_type === eventType)
      const sessionSet = new Set<string>()
      matching.forEach(e => {
        sessionSet.add(e.session_id || String(e.id))
      })
      return sessionSet.size
    }

    // A) VISITAS: Personas que cargaron la URL (solo con ingresar a la página)
    const visitas = countUniqueSessions(events.value, 'visita')

    // B) PASOS ESTANDARIZADOS (1, 2, 3)
    const paso1 = countUniqueSessions(events.value, 'paso_1')
    const paso2 = countUniqueSessions(events.value, 'paso_2')
    const paso3 = countUniqueSessions(events.value, 'paso_3')

    // C) COMPLETADOS: Terminaron el quiz (llegaron a ver su diagnóstico/resultado)
    const completados = countUniqueSessions(events.value, 'completado')

    // D) RESERVAS: Presionaron "Agendar mi cita" O el botón de WhatsApp (estrictamente 1 por persona/sesión)
    const reservas = countUniqueSessions(events.value, 'reserva')

    // E) ETAPAS VINCULADAS AL SISTEMA LOCAL (/dashboard de Oculus)
    // Sincronizadas directamente con la base de datos compartida PulsoDB (Supabase dev)
    let llegaron = 0
    let ventasCount = 0
    let ingresosTotal = 0

    if (hasLocalCrm.value) {
      // 1. Llegaron al local: prospectos con estado_cita === 'Atendida'
      const leadsAtendidos = leads.value.filter((l: any) => l.estado_cita === 'Atendida')
      llegaron = leadsAtendidos.length

      // 2. Pacientes vinculados a los leads de este sitio
      const leadIds = new Set(leads.value.map(l => l.id))
      const matchingPacientes = pacientesList.filter((p: any) => p.lead_id && leadIds.has(p.lead_id))
      const matchingPacienteIds = new Set(matchingPacientes.map((p: any) => p.id))

      // 3. Pedidos vinculados a esos pacientes
      const matchingPedidos = pedidosList.filter((p: any) => matchingPacienteIds.has(p.paciente_id))

      // 4. Ventas: pedidos con estado_pago === 'Pagado total'
      const pagosCompletados = matchingPedidos.filter((p: any) => p.estado_pago === 'Pagado total')
      ventasCount = pagosCompletados.length

      // 5. Ingresos: suma de montos recaudados
      ingresosTotal = pagosCompletados.reduce((acc: number, p: any) => acc + (Number(p.total) || 0), 0)
    }

    // Asignar al KPI
    kpi.value = {
      visitas,
      paso1,
      paso2,
      paso3,
      completados,
      reservas,
      llegaron,
      ventasCount,
      ingresosTotal,
      activeNow: visitas > 0 ? 1 : 0,
    }

    // F) Embudo (Funnel)
    const calcPct = (count: number) => visitas > 0 ? Number(((count / visitas) * 100).toFixed(1)) : 0

    funnelData.value = [
      { label: 'Entrada / Visitas', count: visitas, pct: visitas > 0 ? 100 : 0 },
      { label: 'Paso 1 (Datos / Inicio)', count: paso1, pct: calcPct(paso1) },
      { label: 'Paso 2 (Evaluación)', count: paso2, pct: calcPct(paso2) },
      { label: 'Paso 3 (Diagnóstico)', count: paso3, pct: calcPct(paso3) },
      { label: 'Completados (Test Finalizado)', count: completados, pct: calcPct(completados) },
      { label: 'Reservas (Cita / WhatsApp)', count: reservas, pct: calcPct(reservas) },
      {
        label: 'Llegaron al Local',
        count: llegaron,
        pct: calcPct(llegaron),
        status: hasLocalCrm.value ? undefined : 'PAUSADO',
      },
      {
        label: 'Ventas Concretadas',
        count: ventasCount,
        pct: calcPct(ventasCount),
        status: hasLocalCrm.value ? undefined : 'PAUSADO',
      },
    ]

    // F) Fuentes UTM
    const sourceMap: Record<string, number> = {}
    events.value.forEach(e => {
      const s = (e.utm_source || 'directo').toLowerCase()
      sourceMap[s] = (sourceMap[s] || 0) + 1
    })

    const totalSources = Object.values(sourceMap).reduce((a, b) => a + b, 0)
    const palette = ['#38bdf8', '#10b981', '#f59e0b', '#6366f1', '#ec4899']
    let pIdx = 0
    sources.value = Object.entries(sourceMap).map(([label, count]) => ({
      label: label.toUpperCase(),
      value: totalSources > 0 ? Math.round((count / totalSources) * 100) : 0,
      color: palette[pIdx++ % palette.length]
    }))

    // G) Evolución Diaria (contabilizando sesiones únicas)
    const days: Record<string, { visitas: Set<string>; completados: Set<string>; reservas: Set<string> }> = {}
    events.value.forEach(e => {
      const d = new Date(e.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })
      if (!days[d]) days[d] = { visitas: new Set(), completados: new Set(), reservas: new Set() }
      const sid = e.session_id || String(e.id)
      if (e.event_type === 'visita') days[d].visitas.add(sid)
      if (e.event_type === 'completado') days[d].completados.add(sid)
      if (e.event_type === 'reserva') days[d].reservas.add(sid)
    })
    dailyData.value = Object.entries(days).map(([date, sets]) => ({
      date,
      visitas: sets.visitas.size,
      completados: sets.completados.size,
      reservas: sets.reservas.size,
    }))
  }

  let pollInterval: ReturnType<typeof setInterval>

  onMounted(() => {
    loadData()
    // Polling telemétrico continuo cada 1.5s
    pollInterval = setInterval(loadData, 1500)
  })

  onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
  })

  return {
    leads,
    events,
    kpi,
    dailyData,
    sources,
    funnelData,
    loading,
    isRealtime,
    hasLocalCrm,
    currentClient,
    currentQuiz,
    clientSlug,
    quizSlug,
    refreshLeads: loadData,
  }
}
