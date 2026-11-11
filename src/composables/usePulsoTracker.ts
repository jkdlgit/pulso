// ============================================================================
// 📡 PULSO TRACKER SDK UNIVERSAL — Composable reutilizable para Quizzes y Landings
// Conecta telemetría, CRM Supabase y actualización instantánea vía BroadcastChannel
// ============================================================================

import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { devDb, hasConfig } from '../analytics/supabaseAnalytics'
import type { AnalyticsEvent, QuizStepLog, Session, Visitor } from '../analytics/types'

export interface UsePulsoTrackerOptions {
  clientSlug?: string
  quizKey: string
  quizName?: string
  sessionKeyPrefix?: string
}

export interface BookingPayload {
  nombre: string
  telefono: string
  edad?: number | null
  fecha_cita?: string | null
  hora_cita?: string | null
  sucursal?: string
  metadata?: Record<string, any>
}

export interface CompletedPayload {
  score?: string | number
  diagnosis?: string
  answers?: Record<string, any>
}

/**
 * 📱 Normalizador y Validador flexible de celulares de Ecuador
 */
export function normalizeEcuadorianPhone(raw: string): { isValid: boolean; normalized: string; error?: string } {
  if (!raw || !raw.trim()) {
    return { isValid: false, normalized: '', error: 'El teléfono celular es obligatorio.' }
  }

  const clean = raw.trim()
  const digits = clean.replace(/\D/g, '')

  let phone = ''

  if (digits.startsWith('593')) {
    const after593 = digits.slice(3)
    if (after593.length === 9) {
      phone = '0' + after593
    } else if (after593.length === 10 && after593.startsWith('0')) {
      phone = after593
    }
  } else if (digits.length === 9 && (digits.startsWith('8') || digits.startsWith('9'))) {
    phone = '0' + digits
  } else if (digits.length === 10 && (digits.startsWith('08') || digits.startsWith('09'))) {
    phone = digits
  } else if (digits.length === 10 && digits.startsWith('0')) {
    phone = digits
  }

  if (phone && /^0[89]\d{8}$/.test(phone)) {
    return { isValid: true, normalized: phone }
  }

  if (phone && /^0\d{9}$/.test(phone)) {
    return { isValid: true, normalized: phone }
  }

  return {
    isValid: false,
    normalized: raw,
    error: 'Ingresa un número celular válido de Ecuador de 10 dígitos (Ej. 09... o 08...).',
  }
}

let broadcastChannel: BroadcastChannel | null = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('pulso_analytics_channel')
  } catch (e) { /* noop */ }
}

export function usePulsoTracker(options: UsePulsoTrackerOptions) {
  let route: any = null
  try {
    route = useRoute()
  } catch (e) { /* fuera de router */ }

  const clientSlug = ref(options.clientSlug || (route?.params?.clientSlug as string) || 'optica')
  const quizKey = ref(options.quizKey)
  const quizName = ref(options.quizName || options.quizKey)

  const leadId = ref<number | null>(null)
  const isSubmitting = ref(false)
  const errorMsg = ref('')

  // Identificadores de sesión y visitante persistentes
  const sessionKey = `_pulso_sid_${clientSlug.value}_${quizKey.value}`
  const visitorKey = '_pulso_vid_v1'

  let sid = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(sessionKey) : null
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    try { sessionStorage.setItem(sessionKey, sid) } catch { /* noop */ }
  }
  const sessionId = ref(sid)

  let vid = typeof localStorage !== 'undefined' ? localStorage.getItem(visitorKey) : null
  if (!vid) {
    vid = `optica_v${Math.floor(1000 + Math.random() * 9000)}`
    try { localStorage.setItem(visitorKey, vid) } catch { /* noop */ }
  }
  const visitorId = ref(vid)

  const utmParams = reactive({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  })

  const answersMap = reactive<Record<string, any>>({})
  const stepsLogs: QuizStepLog[] = []
  let stepStartTime = Date.now()

  // Helper para emitir telemetría al canal local
  function broadcast(event: AnalyticsEvent, sessionUpdate?: Partial<Session>, visitorUpdate?: Partial<Visitor>) {
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'PULSO_EVENT',
        payload: { event, session: sessionUpdate, visitor: visitorUpdate },
      })
    }
  }

  onMounted(async () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      utmParams.source = urlParams.get('utm_source') || 'directo'
      utmParams.medium = urlParams.get('utm_medium') || ''
      utmParams.campaign = urlParams.get('utm_campaign') || 'camp_luz_azul'
      utmParams.term = urlParams.get('utm_term') || ''
      utmParams.content = urlParams.get('utm_content') || ''
    }

    const devType = typeof navigator !== 'undefined' && /Mobile|Android|iP(hone|od)/.test(navigator.userAgent) ? 'mobile' : 'desktop'

    // 1. Registrar Visita Anónima en Supabase dev.leads
    const visitOrigin = `${clientSlug.value}_${quizKey.value}`
    const cachedLeadId = sessionStorage.getItem(`_pulso_lead_${visitOrigin}`)
    if (cachedLeadId) {
      leadId.value = Number(cachedLeadId)
    } else if (hasConfig) {
      try {
        const payload = {
          nombre: 'Visita Anónima',
          telefono: 'Sin registrar',
          edad: 0,
          origen: visitOrigin,
          client_id: clientSlug.value,
          utm_source: utmParams.source,
          utm_medium: utmParams.medium || null,
          utm_campaign: utmParams.campaign || null,
          owner: 'publicidad',
          estado: 'Visita',
          respuestas: {
            quiz: quizKey.value,
            client: clientSlug.value,
            visitor_id: visitorId.value,
            session_id: sessionId.value,
            dispositivo: devType === 'mobile' ? 'móvil' : 'escritorio',
            city: 'Quito',
          },
        }
        const { data, error } = await devDb.from('leads').insert(payload).select('id').single()
        if (!error && data) {
          leadId.value = data.id
          sessionStorage.setItem(`_pulso_lead_${visitOrigin}`, String(data.id))
          console.log('📡 [PULSO TRACKER] Visita real registrada en Supabase dev.leads:', data.id)
        }
      } catch (err) {
        console.warn('📡 [PULSO TRACKER] Error registrando visita:', err)
      }
    }

    // 2. Emitir evento atómico de Visita
    const visitaEvent: AnalyticsEvent = {
      id: Date.now(),
      business_id: 'optica',
      session_id: sessionId.value,
      visitor_id: visitorId.value,
      ts: new Date().toISOString(),
      type: 'visita',
      page: `/${quizKey.value}`,
      label: `Ingreso a ${quizName.value}`,
      metadata: { device: devType, source: utmParams.source, campaign: utmParams.campaign },
    }

    const sessionInit: Partial<Session> = {
      id: sessionId.value,
      visitor_id: visitorId.value,
      business_id: 'optica',
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      duration_s: 1,
      source: utmParams.source,
      medium: utmParams.medium,
      campaign_id: utmParams.campaign,
      device: devType,
      os: devType === 'mobile' ? 'Android / iOS' : 'Windows / macOS',
      browser: 'Chrome / Safari',
      landing_page: `/${quizKey.value}`,
      pageviews: [{ path: `/${quizKey.value}`, label: quizName.value, scroll: 30, clicks: 1, seconds: 5, ts: new Date().toISOString() }],
      page_count: 1,
      scroll_avg: 30,
      clicks: 1,
      quiz_started: false,
      quiz_completed: false,
      quiz_steps: [],
      form_started: false,
      form_submitted: false,
      form_fields: [],
      form_seconds: 0,
      booked: false,
      confirmed: false,
      attended: false,
      purchased: false,
      quote: false,
      lead_captured: false,
      revenue: 0,
      had_error: false,
    }

    broadcast(visitaEvent, sessionInit)
  })

  /**
   * 1️⃣ Marcar inicio de test
   */
  async function trackQuizStart() {
    stepStartTime = Date.now()
    const event: AnalyticsEvent = {
      id: Date.now(),
      business_id: 'optica',
      session_id: sessionId.value,
      visitor_id: visitorId.value,
      ts: new Date().toISOString(),
      type: 'quiz_start',
      page: `/${quizKey.value}`,
      label: 'Inicio de evaluación',
      metadata: { quiz: quizKey.value },
    }
    broadcast(event, { quiz_started: true, id: sessionId.value })

    if (leadId.value && hasConfig) {
      try {
        await devDb.from('leads').update({
          respuestas: { ...answersMap, quiz_started: true, session_id: sessionId.value, visitor_id: visitorId.value },
        }).eq('id', leadId.value)
      } catch (e) { /* noop */ }
    }
  }

  /**
   * 2️⃣ Marcar respuesta a una pregunta y coordenadas de clic para Heatmap
   */
  async function trackStep(stepNumber: number, stepData: Record<string, any> = {}, clickEvent?: MouseEvent) {
    const elapsed = Date.now() - stepStartTime
    stepStartTime = Date.now()

    Object.assign(answersMap, stepData)

    const questionKey = Object.keys(stepData)[0] || `q${stepNumber}`
    const answerVal = String(stepData[questionKey] || '')

    const stepLog: QuizStepLog = {
      question_id: questionKey,
      question: formatQuestionTitle(questionKey),
      step: stepNumber,
      viewed: true,
      answered: true,
      answer: answerVal,
      time_ms: elapsed,
      changed: false,
      skipped: false,
    }
    stepsLogs.push(stepLog)

    // Coordenadas relativas para Heatmap
    const coords = clickEvent ? {
      x: Math.round((clickEvent.clientX / window.innerWidth) * 100),
      y: Math.round((clickEvent.clientY / window.innerHeight) * 100),
    } : { x: 50, y: 50 }

    const event: AnalyticsEvent = {
      id: Date.now(),
      business_id: 'optica',
      session_id: sessionId.value,
      visitor_id: visitorId.value,
      ts: new Date().toISOString(),
      type: 'quiz_step',
      page: `/${quizKey.value}`,
      label: `Paso ${stepNumber}: ${answerVal}`,
      metadata: { step: stepNumber, question: questionKey, answer: answerVal, ...coords },
    }

    broadcast(event, {
      id: sessionId.value,
      clicks: stepsLogs.length + 2,
      scroll_avg: Math.min(100, 30 + stepNumber * 20),
      quiz_steps: [...stepsLogs],
    })

    if (leadId.value && hasConfig) {
      try {
        await devDb.from('leads').update({
          respuestas: {
            ...answersMap,
            paso_maximo: stepNumber,
            session_id: sessionId.value,
            visitor_id: visitorId.value,
          },
        }).eq('id', leadId.value)
      } catch (e) { /* noop */ }
    }
  }

  /**
   * 3️⃣ Marcar finalización del quiz
   */
  async function trackCompleted(payload: CompletedPayload) {
    const event: AnalyticsEvent = {
      id: Date.now(),
      business_id: 'optica',
      session_id: sessionId.value,
      visitor_id: visitorId.value,
      ts: new Date().toISOString(),
      type: 'quiz_complete',
      page: '/resultado',
      label: `Diagnóstico: ${payload.diagnosis || 'Fatiga Detectada'}`,
      metadata: { score: payload.score, diagnosis: payload.diagnosis },
    }

    broadcast(event, {
      id: sessionId.value,
      quiz_completed: true,
      form_started: true,
    })

    if (leadId.value && hasConfig) {
      try {
        await devDb.from('leads').update({
          estado: 'Completado',
          resultado: payload.diagnosis || 'Fatiga visual detectada',
          respuestas: { ...answersMap, ...payload.answers, score: payload.score },
        }).eq('id', leadId.value)
      } catch (e) { /* noop */ }
    }
  }

  /**
   * 4️⃣ Marcar llenado de campo de formulario
   */
  function trackField(fieldName: string, action: 'focus' | 'fill' = 'fill') {
    const event: AnalyticsEvent = {
      id: Date.now(),
      business_id: 'optica',
      session_id: sessionId.value,
      visitor_id: visitorId.value,
      ts: new Date().toISOString(),
      type: 'form_field',
      page: '/agendar',
      label: `Campo ${fieldName}: ${action}`,
      metadata: { field: fieldName, action },
    }
    broadcast(event, { id: sessionId.value, form_started: true })
  }

  /**
   * 5️⃣ Guardar Cita & Lead identificado en CRM
   */
  async function submitBooking(booking: BookingPayload): Promise<boolean> {
    isSubmitting.value = true
    errorMsg.value = ''

    const phoneValidation = normalizeEcuadorianPhone(booking.telefono)
    if (!phoneValidation.isValid) {
      isSubmitting.value = false
      errorMsg.value = phoneValidation.error || 'Celular no válido.'
      return false
    }

    const payload = {
      nombre: booking.nombre.trim(),
      telefono: phoneValidation.normalized,
      edad: booking.edad ? Number(booking.edad) : 0,
      fecha_cita: booking.fecha_cita || null,
      hora_cita: booking.hora_cita || null,
      estado_cita: 'Nueva',
      estado: 'Agendado',
      origen: `${clientSlug.value}_${quizKey.value}`,
      client_id: clientSlug.value,
      utm_source: utmParams.source,
      utm_medium: utmParams.medium || null,
      utm_campaign: utmParams.campaign || null,
      owner: 'publicidad',
      respuestas: {
        ...answersMap,
        sucursal: booking.sucursal || 'Matriz Sangolquí',
        session_id: sessionId.value,
        visitor_id: visitorId.value,
        ...booking.metadata,
      },
    }

    try {
      if (leadId.value && hasConfig) {
        await devDb.from('leads').update(payload).eq('id', leadId.value)
      } else if (hasConfig) {
        const { data } = await devDb.from('leads').insert(payload).select('id').single()
        if (data) leadId.value = data.id
      }

      // Emitir telemetría de Agendamiento
      const event: AnalyticsEvent = {
        id: Date.now(),
        business_id: 'optica',
        session_id: sessionId.value,
        visitor_id: visitorId.value,
        ts: new Date().toISOString(),
        type: 'booking',
        page: '/agendar',
        label: `Cita Agendada: ${booking.nombre} (${phoneValidation.normalized})`,
        metadata: { fecha: booking.fecha_cita, hora: booking.hora_cita, sucursal: booking.sucursal },
      }

      broadcast(
        event,
        {
          id: sessionId.value,
          booked: true,
          confirmed: false,
          form_submitted: true,
          lead_captured: true,
        },
        {
          id: visitorId.value,
          is_identified: true,
          is_lead: true,
        }
      )

      isSubmitting.value = false
      return true
    } catch (err: any) {
      isSubmitting.value = false
      errorMsg.value = err?.message || 'Error al guardar cita'
      return false
    }
  }

  return {
    clientSlug,
    quizKey,
    quizName,
    sessionId,
    visitorId,
    leadId,
    isSubmitting,
    errorMsg,
    answersMap,
    trackQuizStart,
    trackStep,
    trackCompleted,
    trackField,
    submitBooking,
    normalizePhone: normalizeEcuadorianPhone,
  }
}

function formatQuestionTitle(key: string): string {
  switch (key) {
    case 'horas_pantalla': return 'Horas al día frente a pantallas'
    case 'dispositivo_frecuente': return 'Dispositivo más usado'
    case 'sintomas': return 'Síntomas de fatiga visual'
    case 'molestia_principal': return 'Molestia principal detectada'
    case 'usa_lentes': return 'Uso actual de lentes'
    default: return key.replace(/_/g, ' ')
  }
}
