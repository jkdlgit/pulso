// ============================================================================
// PULSO ANALYTICS — Generador de dataset de demostración determinista
// Se usa cuando el esquema analytic_pulso aún no tiene datos cargados.
// ============================================================================

import type {
  AnalyticsDataset, AnalyticsEvent, Appointment, Business, Campaign,
  Communication, Device, Experiment, FormFieldLog, Improvement, PageView,
  QuizStepLog, Sale, Session, Visitor,
} from './types'

const DAY = 86_400_000
const NOW = Date.now()

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(20261108)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const between = (min: number, max: number) => min + rand() * (max - min)
const int = (min: number, max: number) => Math.floor(between(min, max + 1))
const chance = (p: number) => rand() < p
const weighted = <T,>(items: { value: T; weight: number }[]): T => {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = rand() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item.value
  }
  return items[items.length - 1].value
}
const iso = (ms: number) => new Date(ms).toISOString()
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')

// ---------------------------------------------------------------------------
// Catálogo de negocios
// ---------------------------------------------------------------------------
const BUSINESSES: Business[] = [
  {
    id: 'optica', name: 'Óptica Johanna', emoji: '👁️',
    industry: 'Salud Visual / Optometría', hasLocalCrm: true,
    currency: 'USD', accent: '#38bdf8', website: 'optica-johanna.ec',
  },
  {
    id: 'taller', name: 'Mecánica Luis', emoji: '🔧',
    industry: 'Taller Automotriz & Frenos', hasLocalCrm: false,
    currency: 'USD', accent: '#f59e0b', website: 'mecanicaluis.ec',
  },
]

const SOURCE_META: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram Ads', color: '#ec4899' },
  facebook: { label: 'Facebook Ads', color: '#3b82f6' },
  google: { label: 'Google Ads', color: '#f59e0b' },
  tiktok: { label: 'TikTok Ads', color: '#22d3ee' },
  directo: { label: 'Tráfico directo', color: '#94a3b8' },
  organico: { label: 'Orgánico / SEO', color: '#10b981' },
  referido: { label: 'Referidos / Compartidos', color: '#8b5cf6' },
}
export const sourceLabel = (s: string) => SOURCE_META[s]?.label || s
export const sourceColor = (s: string) => SOURCE_META[s]?.color || '#64748b'

const PAGES: Record<string, { path: string; label: string }[]> = {
  optica: [
    { path: '/', label: 'Landing principal' },
    { path: '/test-visual', label: 'Test visual' },
    { path: '/resultado', label: 'Diagnóstico visual' },
    { path: '/agendar', label: 'Agendar cita' },
    { path: '/gracias', label: 'Confirmación' },
    { path: '/lentes', label: 'Catálogo de lentes' },
  ],
  taller: [
    { path: '/', label: 'Landing principal' },
    { path: '/diagnostico', label: 'Diagnóstico de frenos' },
    { path: '/resultado', label: 'Resultado técnico' },
    { path: '/cotizacion', label: 'Solicitar cotización' },
    { path: '/gracias', label: 'Confirmación' },
    { path: '/servicios', label: 'Servicios y precios' },
  ],
}

const QUESTIONS: Record<string, { id: string; text: string; options: string[]; drop: number; seconds: number }[]> = {
  optica: [
    { id: 'q1', text: '¿Cómo calificarías tu visión actualmente?', options: ['Excelente', 'Buena', 'Regular', 'Mala'], drop: 0.035, seconds: 7 },
    { id: 'q2', text: '¿Hace cuánto no te realizas un chequeo visual?', options: ['Menos de 1 año', '1 a 2 años', 'Más de 2 años', 'Nunca'], drop: 0.05, seconds: 9 },
    { id: 'q3', text: '¿Qué actividad te resulta más difícil?', options: ['Leer de cerca', 'Ver de lejos', 'Usar el celular', 'Conducir de noche'], drop: 0.085, seconds: 12 },
    { id: 'q4', text: '¿Usas lentes o lentes de contacto actualmente?', options: ['Sí, lentes', 'Sí, contacto', 'Ambos', 'No uso'], drop: 0.165, seconds: 31 },
    { id: 'q5', text: '¿Presentas dolores de cabeza o fatiga visual?', options: ['Frecuentemente', 'A veces', 'Rara vez', 'Nunca'], drop: 0.06, seconds: 10 },
    { id: 'q6', text: '¿Deseas agendar una evaluación con un especialista?', options: ['Sí, esta semana', 'Sí, más adelante', 'Solo recibir información', 'No por ahora'], drop: 0.045, seconds: 13 },
  ],
  taller: [
    { id: 'q1', text: '¿Qué tipo de vehículo conduces?', options: ['Sedán', 'SUV', 'Camioneta', 'Moto'], drop: 0.04, seconds: 8 },
    { id: 'q2', text: '¿Qué síntoma has notado al frenar?', options: ['Chirrido', 'Vibración', 'Pedal largo', 'Ninguno'], drop: 0.065, seconds: 11 },
    { id: 'q3', text: '¿Cuándo fue tu último mantenimiento de frenos?', options: ['Menos de 6 meses', '6 a 12 meses', 'Más de 1 año', 'No recuerdo'], drop: 0.135, seconds: 27 },
    { id: 'q4', text: '¿Cuántos kilómetros recorres al día?', options: ['Menos de 20', '20 a 50', '50 a 100', 'Más de 100'], drop: 0.055, seconds: 12 },
    { id: 'q5', text: '¿Necesitas tu vehículo el mismo día?', options: ['Sí, urgente', 'En 24 horas', 'Esta semana', 'Sin prisa'], drop: 0.05, seconds: 9 },
  ],
}

const PRODUCTS: Record<string, { product: string; category: string; price: number }[]> = {
  optica: [
    { product: 'Lentes monofocales', category: 'Óptica', price: 145 },
    { product: 'Lentes progresivos', category: 'Óptica', price: 340 },
    { product: 'Tratamiento antirreflejo', category: 'Tratamiento', price: 95 },
    { product: 'Gafas de sol', category: 'Accesorio', price: 80 },
    { product: 'Examen visual completo', category: 'Consulta', price: 45 },
  ],
  taller: [
    { product: 'Cambio de pastillas de freno', category: 'Frenos', price: 120 },
    { product: 'Rectificación de discos', category: 'Frenos', price: 185 },
    { product: 'Cambio de aceite', category: 'Mantenimiento', price: 70 },
    { product: 'Kit de frenos completo', category: 'Frenos', price: 310 },
    { product: 'Reparación general', category: 'Mecánica', price: 420 },
  ],
}

const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Loja', 'Manta', 'Sangolquí']
const VENDORS = ['Andrea M.', 'Luis P.', 'Carolina R.', 'José T.']

// ---------------------------------------------------------------------------
// Campañas (spend = presupuesto diario)
// ---------------------------------------------------------------------------
function buildCampaigns(): Campaign[] {
  const defs: Omit<Campaign, 'id' | 'business_id' | 'started_on'>[] = [
    { platform: 'Meta Ads', name: 'Captación Visual — Quito', adset: 'Intereses optometría 25-45', ad: 'Test Visual Gratis', creative: 'Reel fondo azul', spend: 18, impressions: 41000, clicks: 980, status: 'activa' },
    { platform: 'Meta Ads', name: 'Promo Lentes 2x1', adset: 'Retargeting 30 días', ad: '2x1 en lentes', creative: 'Carrusel oferta', spend: 9, impressions: 18500, clicks: 410, status: 'activa' },
    { platform: 'Meta Ads', name: 'Retargeting Reservas', adset: 'Abandonaron test', ad: 'Tu cita te espera', creative: 'Historia con CTA', spend: 6, impressions: 9800, clicks: 390, status: 'activa' },
    { platform: 'Google Ads', name: 'Search Chequeo Visual', adset: 'Quito + óptica', ad: 'Chequeo visual cerca', creative: 'Anuncio responsive', spend: 12, impressions: 14200, clicks: 720, status: 'activa' },
    { platform: 'TikTok Ads', name: 'Test Visual TikTok', adset: '18-30 entretenimiento', ad: '¿Ves bien de noche?', creative: 'Video UGC', spend: 7, impressions: 52000, clicks: 1100, status: 'pausada' },
    { platform: 'Meta Ads', name: 'Frenos Seguros', adset: 'Propietarios vehículos 5+ años', ad: 'Diagnóstico de frenos gratis', creative: 'Video taller', spend: 14, impressions: 32000, clicks: 860, status: 'activa' },
    { platform: 'Meta Ads', name: 'Diagnóstico Gratis', adset: 'Retargeting cotizaciones', ad: 'Agenda tu revisión', creative: 'Carrusel antes/después', spend: 8, impressions: 15600, clicks: 380, status: 'activa' },
    { platform: 'Google Ads', name: 'Taller Mecánico Quito', adset: 'Búsqueda local', ad: 'Taller de frenos', creative: 'Anuncio responsive', spend: 10, impressions: 11800, clicks: 540, status: 'activa' },
    { platform: 'TikTok Ads', name: 'Reto Frenos', adset: '18-35 automovilismo', ad: '¿Tus frenos chillan?', creative: 'Clip viral', spend: 5, impressions: 47000, clicks: 990, status: 'pausada' },
  ]
  return defs.map((d, i) => ({
    ...d,
    id: `cmp_${i + 1}`,
    business_id: i < 5 ? 'optica' : 'taller',
    started_on: iso(NOW - (75 - i) * DAY),
  }))
}

export function campaignSource(c: Campaign): string {
  if (c.platform === 'Meta Ads') return c.name.includes('Retargeting') || c.name.includes('Promo') ? 'instagram' : 'facebook'
  if (c.platform === 'Google Ads') return 'google'
  if (c.platform === 'TikTok Ads') return 'tiktok'
  return 'directo'
}

function sourceFor(c: Campaign): string {
  return campaignSource(c)
}

// ---------------------------------------------------------------------------
// Sesiones
// ---------------------------------------------------------------------------
interface Ctx {
  business: Business
  campaignId?: string
  source: string
  medium: string
  device: Device
  factor: number
}

const DEVICE_WEIGHTS: { value: Device; weight: number }[] = [
  { value: 'mobile', weight: 0.68 },
  { value: 'desktop', weight: 0.27 },
  { value: 'tablet', weight: 0.05 },
]

function deviceProfile(device: Device) {
  if (device === 'mobile') {
    return { os: pick(['Android 14', 'Android 13', 'iOS 17', 'iOS 18']), browser: pick(['Chrome Mobile', 'Safari Mobile', 'Samsung Internet']), factor: 0.9 }
  }
  if (device === 'tablet') {
    return { os: pick(['iPadOS 17', 'Android 13']), browser: pick(['Safari', 'Chrome']), factor: 0.96 }
  }
  return { os: pick(['Windows 11', 'Windows 10', 'macOS 14']), browser: pick(['Chrome', 'Edge', 'Safari', 'Firefox']), factor: 1.12 }
}

function hourWeighted(): number {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  const weights = [2, 4, 6, 8, 7, 5, 6, 7, 8, 9, 10, 9, 7, 5, 2]
  return weighted(hours.map((h, i) => ({ value: h, weight: weights[i] })))
}

function makeVisitor(business: Business, campaigns: Campaign[], index: number): Visitor {
  const device = weighted(DEVICE_WEIGHTS)
  const prof = deviceProfile(device)
  const paid = campaigns.filter(c => c.business_id === business.id)
  const campaignId = weighted([
    ...paid.map(c => ({ value: c.id as string | undefined, weight: c.status === 'activa' ? 22 : 8 })),
    { value: undefined, weight: 34 },
  ])
  const campaign = paid.find(c => c.id === campaignId)
  const source = campaign ? sourceFor(campaign) : weighted([
    { value: 'directo', weight: 20 }, { value: 'organico', weight: 30 }, { value: 'referido', weight: 6 },
  ])
  const firstSeen = NOW - between(0, 89) * DAY
  return {
    id: `${business.id}_v${String(index).padStart(4, '0')}`,
    business_id: business.id,
    first_seen: iso(firstSeen),
    last_seen: iso(firstSeen),
    sessions_count: 0,
    device, os: prof.os, browser: prof.browser,
    language: 'es-EC',
    country: 'Ecuador',
    city: weighted([
      { value: 'Quito', weight: 52 }, { value: 'Guayaquil', weight: 16 },
      { value: 'Cuenca', weight: 9 }, { value: 'Ambato', weight: 8 },
      { value: 'Loja', weight: 6 }, { value: 'Manta', weight: 5 },
      { value: 'Sangolquí', weight: 4 },
    ]),
    source,
    medium: campaign ? (campaign.platform === 'Google Ads' ? 'cpc' : 'paid_social') : source === 'organico' ? 'organic' : 'none',
    campaign_id: campaign?.id,
    ad: campaign?.ad,
    creative: campaign?.creative,
    landing_page: business.id === 'optica' ? pick(['/', '/test-visual', '/lentes']) : pick(['/', '/diagnostico', '/servicios']),
    is_returning: false,
    is_identified: false,
    is_lead: false,
    is_buyer: false,
    revenue: 0,
  }
}

function makeSession(visitor: Visitor, business: Business, campaigns: Campaign[], startMs: number): Session {
  const campaign = campaigns.find(c => c.id === visitor.campaign_id)
  const deviceFactor = deviceProfile(visitor.device).factor
  const sourceFactor =
    campaign?.name.includes('Retargeting') ? 1.28
      : visitor.source === 'google' ? 1.15
        : visitor.source === 'tiktok' ? 0.72
          : visitor.source === 'organico' ? 1.06
            : visitor.source === 'referido' ? 1.18
              : visitor.source === 'instagram' ? 0.98 : 1.04
  const f = deviceFactor * sourceFactor
  const isOptica = business.id === 'optica'

  const quizStartP = (isOptica ? 0.56 : 0.41) * f
  const started = chance(Math.min(0.86, quizStartP))
  const completed = started && chance(Math.min(0.9, (isOptica ? 0.79 : 0.72) * f))
  const formStarted = completed && chance(0.9)
  const formSubmitted = formStarted && chance(0.82)
  const lead = formSubmitted
  const booked = lead && chance(isOptica ? 0.7 : 0.66)
  const confirmed = booked && chance(0.87)
  const attended = confirmed && chance(isOptica ? 0.76 : 0.8)
  const quote = attended && chance(0.62)
  const purchased = quote && chance(isOptica ? 0.54 : 0.47)
  const hadError = chance(0.035)

  const pages = PAGES[business.id]
  const pageviews: PageView[] = []
  const count = started ? (completed ? int(5, 6) : int(2, 4)) : int(1, 3)
  const navPath = pages.slice(0, Math.max(1, count))
  let cursor = startMs
  navPath.forEach((pg, idx) => {
    const seconds = Math.round(between(18, idx === 0 ? 95 : 150))
    const scroll = Math.round(between(28, 96))
    const clicks = int(0, 5)
    cursor += seconds * 1000 + int(2, 20) * 1000
    pageviews.push({
      path: pg.path, label: pg.label, scroll, clicks, seconds,
      ts: iso(cursor),
    })
  })

  const quizSteps: QuizStepLog[] = []
  if (started) {
    const qs = QUESTIONS[business.id]
    for (const [i, q] of qs.entries()) {
      const drop = q.drop * (visitor.device === 'mobile' ? 1.25 : 1)
      const viewed = true
      const answered = completed || !chance(drop)
      if (!answered) {
        quizSteps.push({ question_id: q.id, question: q.text, step: i + 1, viewed, answered: false, time_ms: Math.round(q.seconds * 1000 * between(0.4, 1.1)), changed: false, skipped: false })
        break
      }
      quizSteps.push({
        question_id: q.id, question: q.text, step: i + 1, viewed, answered: true,
        answer: pick(q.options),
        time_ms: Math.round(q.seconds * 1000 * between(0.55, 1.8)),
        changed: chance(0.07),
        skipped: false,
      })
    }
  }

  const formFields: FormFieldLog[] = []
  if (formStarted) {
    const fields = isOptica
      ? ['nombre', 'teléfono', 'email', 'edad', 'motivo']
      : ['nombre', 'teléfono', 'vehículo', 'problema']
    const abandonField = formSubmitted ? -1 : weighted(
      fields.map((_, i) => ({ value: i, weight: i === (isOptica ? 2 : 1) ? 38 : 16 }))
    )
    fields.forEach((field, i) => {
      const base = i * 9000 + int(1500, 7000)
      formFields.push({ field, action: 'focus', time_ms: base })
      if (i === abandonField) {
        formFields.push({ field, action: 'abandon', time_ms: base + int(3000, 15000) })
      } else {
        formFields.push({ field, action: 'fill', time_ms: base + int(2000, 12000) })
        if (field === 'email' && chance(0.16)) formFields.push({ field, action: 'error', time_ms: base + 14000 })
      }
    })
  }

  const duration = pageviews.reduce((s, p) => s + p.seconds, 0) + quizSteps.reduce((s, q) => s + q.time_ms / 1000, 0) + int(5, 40)
  const endMs = startMs + duration * 1000
  const scrollAvg = pageviews.length ? Math.round(pageviews.reduce((s, p) => s + p.scroll, 0) / pageviews.length) : 0
  const clicks = pageviews.reduce((s, p) => s + p.clicks, 0)
  const revenue = purchased ? makeSaleAmount(business.id) : 0

  return {
    id: `ses_${visitor.id}_${Math.round(startMs / 1000)}_${Math.floor(rand() * 999)}`,
    visitor_id: visitor.id,
    business_id: business.id,
    started_at: iso(startMs),
    ended_at: iso(endMs),
    duration_s: duration,
    source: visitor.source,
    medium: visitor.medium,
    campaign_id: visitor.campaign_id,
    device: visitor.device,
    os: visitor.os,
    browser: visitor.browser,
    landing_page: visitor.landing_page,
    pageviews,
    page_count: pageviews.length,
    scroll_avg: scrollAvg,
    clicks,
    quiz_started: started,
    quiz_completed: completed,
    quiz_steps: quizSteps,
    form_started: formStarted,
    form_submitted: formSubmitted,
    form_fields: formFields,
    form_seconds: formStarted ? Math.round(between(35, 190)) : 0,
    booked, confirmed, attended, purchased, quote,
    lead_captured: lead,
    revenue,
    had_error: hadError,
  }
}

function makeSaleAmount(businessId: string): number {
  const p = pick(PRODUCTS[businessId])
  const qty = chance(0.18) ? 2 : 1
  return Math.round(p.price * qty * (chance(0.22) ? 0.9 : 1))
}

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------
export function buildDemoDataset(): AnalyticsDataset {
  const campaigns = buildCampaigns()
  const visitors: Visitor[] = []
  const sessions: Session[] = []
  const appointments: Appointment[] = []
  const communications: Communication[] = []
  const sales: Sale[] = []

  for (const business of BUSINESSES) {
    const bizCampaigns = campaigns.filter(c => c.business_id === business.id)
    const total = business.id === 'optica' ? 620 : 480
    for (let i = 0; i < total; i++) {
      const visitor = makeVisitor(business, bizCampaigns, i)
      const extra = chance(0.24) ? (chance(0.22) ? 2 : 1) : 0
      let lastSession: Session | undefined
      const firstMs = new Date(visitor.first_seen).getTime()
      const count = 1 + extra

      for (let s = 0; s < count; s++) {
        const offset = s === 0 ? 0 : between(1, Math.max(2, (NOW - firstMs) / DAY))
        const ms = s === 0
          ? firstMs
          : Math.min(NOW - 60_000, firstMs + offset * DAY)
        const d = new Date(ms)
        d.setHours(hourWeighted(), int(0, 59), int(0, 59), 0)
        const session = makeSession(visitor, business, bizCampaigns, d.getTime())
        sessions.push(session)
        lastSession = session
      }

      visitor.sessions_count = count
      visitor.is_returning = count > 1 || chance(0.14)
      visitor.last_seen = lastSession?.started_at || visitor.first_seen
      visitor.landing_page = sessions.find(s => s.visitor_id === visitor.id)?.landing_page || visitor.landing_page
      visitor.is_lead = sessions.some(s => s.visitor_id === visitor.id && s.lead_captured)
      visitor.is_identified = visitor.is_lead
      visitor.is_buyer = sessions.some(s => s.visitor_id === visitor.id && s.purchased)
      visitor.revenue = sessions.filter(s => s.visitor_id === visitor.id).reduce((a, s) => a + s.revenue, 0)
      visitors.push(visitor)

      // Citas / comunicaciones / ventas por cada sesión convertida
      for (const session of sessions.filter(s => s.visitor_id === visitor.id)) {
        if (session.booked) {
          const scheduled = new Date(session.started_at).getTime() + between(1, 8) * DAY
          let status: Appointment['status'] = 'pendiente'
          if (session.attended) status = 'atendida'
          else if (session.confirmed) status = 'no_asistio'
          else if (chance(0.4)) status = 'cancelada'
          else if (chance(0.3)) status = 'reagendada'
          else status = 'confirmada'
          const leadTime = Math.round((scheduled - new Date(session.started_at).getTime()) / 3_600_000)
          appointments.push({
            id: `apt_${session.id}`,
            business_id: business.id,
            visitor_id: visitor.id,
            session_id: session.id,
            campaign_id: session.campaign_id,
            created_at: session.started_at,
            scheduled_for: iso(scheduled),
            status,
            reminder: weighted([
              { value: '24h' as const, weight: 46 }, { value: '24h+2h' as const, weight: 24 },
              { value: '48h' as const, weight: 18 }, { value: 'ninguno' as const, weight: 12 },
            ]),
            lead_time_hours: Math.max(2, leadTime),
            source: session.source,
          })
        }

        if (session.lead_captured) {
          const noFollow = chance(0.16)
          if (!noFollow) {
            const sentMs = new Date(session.started_at).getTime() + between(0.2, 30) * 3_600_000
            const replied = chance(0.55)
            const replyMs = replied ? sentMs + between(10, 900) * 60_000 : undefined
            communications.push({
              id: `com_${session.id}`,
              business_id: business.id,
              visitor_id: visitor.id,
              session_id: session.id,
              channel: weighted([
                { value: 'WhatsApp' as const, weight: 80 }, { value: 'Llamada' as const, weight: 15 }, { value: 'Email' as const, weight: 5 },
              ]),
              direction: 'saliente',
              sent_at: iso(sentMs),
              replied_at: replyMs ? iso(replyMs) : undefined,
              responded: replied,
              status: replied ? 'respondido' : 'enviado',
              outcome: session.purchased ? 'compro' : replied ? (session.booked ? 'agendado' : 'interesado') : 'sin_respuesta',
              first_contact: true,
              minutes_to_reply: replyMs ? Math.round((replyMs - sentMs) / 60_000) : undefined,
              notes: noFollow ? 'Sin seguimiento registrado' : undefined,
            })
          }
        }

        if (session.purchased) {
          const p = pick(PRODUCTS[business.id])
          const qty = chance(0.18) ? 2 : 1
          const price = p.price
          const discount = chance(0.24) ? Math.round(price * qty * 0.1) : 0
          const total = price * qty - discount
          const soldMs = new Date(session.started_at).getTime() + between(1, 4) * DAY + between(0, 6) * 3_600_000
          const firstMs = new Date(visitor.first_seen).getTime()
          sales.push({
            id: `sale_${session.id}`,
            business_id: business.id,
            visitor_id: visitor.id,
            session_id: session.id,
            campaign_id: session.campaign_id,
            sold_at: iso(soldMs),
            product: p.product,
            category: p.category,
            qty, price, discount, total,
            cost: Math.round(total * between(0.34, 0.56)),
            payment_status: chance(0.88) ? 'Pagado total' : chance(0.5) ? 'Pagado parcial' : 'Pendiente',
            seller: pick(VENDORS),
            source: session.source,
            first_touch_at: visitor.first_seen,
            days_to_close: Math.max(1, Math.round((soldMs - firstMs) / DAY)),
          })
        }
      }
    }
  }

  // Sesiones "en vivo" (últimos 40 minutos) para el módulo Live Activity
  for (const business of BUSINESSES) {
    for (let i = 0; i < 7; i++) {
      const visitor = makeVisitor(business, campaigns.filter(c => c.business_id === business.id), 9000 + i)
      visitor.id = `${business.id}_live_${i}`
      const start = NOW - between(2, 40) * 60_000
      const session = makeSession(visitor, business, campaigns.filter(c => c.business_id === business.id), start)
      session.id = `live_${business.id}_${i}`
      session.visitor_id = visitor.id
      // En vivo: sin desenlace comercial todavía
      session.booked = false; session.confirmed = false; session.attended = false
      session.purchased = false; session.quote = false; session.lead_captured = false
      session.revenue = 0
      sessions.push(session)
      visitor.sessions_count = 1
      visitor.last_seen = session.started_at
      visitors.push(visitor)
    }
  }

  const events = buildEvents(sessions)
  const experiments = buildExperiments()
  const improvements = buildImprovements()

  return {
    mode: 'demo',
    generated_at: iso(NOW),
    businesses: BUSINESSES,
    campaigns,
    visitors,
    sessions,
    events,
    appointments,
    communications,
    sales,
    experiments,
    improvements,
  }
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------
function buildEvents(sessions: Session[]): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = []
  let id = 1
  const push = (s: Session, ts: string, type: AnalyticsEvent['type'], page: string, label: string, metadata?: Record<string, any>) => {
    events.push({ id: id++, business_id: s.business_id, session_id: s.id, visitor_id: s.visitor_id, ts, type, page, label, metadata })
  }

  for (const s of sessions) {
    const base = new Date(s.started_at).getTime()
    push(s, iso(base), 'visita', s.landing_page, 'Ingreso al sitio', { source: s.source })
    let cursor = base
    for (const pv of s.pageviews) {
      cursor += 1000
      push(s, iso(cursor), 'page_view', pv.path, pv.label, { scroll: pv.scroll, clicks: pv.clicks })
      if (pv.scroll > 50) push(s, iso(cursor + 2500), 'scroll', pv.path, `${pv.scroll}% de scroll`)
      for (let c = 0; c < Math.min(2, pv.clicks); c++) {
        push(s, iso(cursor + 3000 + c * 1500), 'click', pv.path, pick(['CTA principal', 'Botón WhatsApp', 'Ver precios', 'Menú', 'Test visual']), {
          x: Math.round(between(6, 94)),
          y: Math.round(between(8, 92)),
        })
      }
      if (s.had_error && chance(0.5)) push(s, iso(cursor + 5000), 'error', pv.path, 'Error de interacción', { code: pick(['E_JS_01', 'E_FORM_02', 'E_IMG_404']) })
    }

    if (s.quiz_started) {
      push(s, iso(new Date(s.started_at).getTime() + 45_000), 'quiz_start', '/test-visual', 'Inició la evaluación')
      for (const q of s.quiz_steps) {
        push(s, iso(new Date(s.started_at).getTime() + 46_000 + q.step * 12_000), 'quiz_step', '/test-visual', q.question, { step: q.step, answered: q.answered, time_ms: q.time_ms })
        if (q.changed) push(s, iso(new Date(s.started_at).getTime() + 47_000 + q.step * 12_000), 'quiz_change', '/test-visual', 'Cambió su respuesta', { question: q.question_id })
        if (!q.answered) break
      }
      if (s.quiz_completed) push(s, iso(new Date(s.started_at).getTime() + 130_000), 'quiz_complete', '/resultado', 'Evaluación completada')
    }
    if (s.form_started) {
      push(s, iso(new Date(s.started_at).getTime() + 140_000), 'form_start', '/resultado', 'Formulario iniciado')
      for (const f of s.form_fields) {
        push(s, iso(new Date(s.started_at).getTime() + 141_000 + f.time_ms), f.action === 'abandon' ? 'form_abandon' : 'form_field', '/resultado', `${f.action}: ${f.field}`, { field: f.field })
      }
    }
    if (s.form_submitted) push(s, iso(new Date(s.started_at).getTime() + 260_000), 'form_submit', '/resultado', 'Lead capturado')
    if (s.booked) push(s, iso(new Date(s.started_at).getTime() + 270_000), 'booking', '/agendar', 'Cita agendada')
    if (s.confirmed) push(s, iso(new Date(s.started_at).getTime() + 300_000), 'booking_confirm', '/agendar', 'Cita confirmada')
    if (s.attended) push(s, iso(new Date(s.started_at).getTime() + 360_000), 'appointment_attend', '/agendar', 'Asistió al local')
    if (s.purchased) push(s, iso(new Date(s.started_at).getTime() + 380_000), 'sale', '/gracias', 'Compra realizada', { total: s.revenue })
    push(s, iso(new Date(s.ended_at).getTime()), 'exit', s.pageviews[s.pageviews.length - 1]?.path || '/', 'Sesión finalizada', { duration: s.duration_s })
  }
  return events.sort((a, b) => a.ts.localeCompare(b.ts))
}

// ---------------------------------------------------------------------------
// Experimentos e iniciativas
// ---------------------------------------------------------------------------
function buildExperiments(): Experiment[] {
  return [
    {
      id: 'exp_1', business_id: 'optica', name: 'Titular del test visual',
      hypothesis: 'Un titular enfocado en el beneficio ("Mira mejor sin esfuerzo") aumentará el inicio del test.',
      element: 'Titular del hero', metric: 'Inicio de evaluación',
      variants: [
        { name: 'A — Control: "Test visual gratuito"', visitors: 820, conversions: 402 },
        { name: 'B — Beneficio: "Mira mejor sin esfuerzo"', visitors: 805, conversions: 468 },
      ],
      started_on: iso(NOW - 24 * DAY), ended_on: iso(NOW - 10 * DAY),
      status: 'finalizado', confidence: 91,
      result: 'La variante B mejora el inicio del test en 4.4 puntos porcentuales.',
      decision: 'implementar',
    },
    {
      id: 'exp_2', business_id: 'optica', name: 'Pregunta de lentes (q4)',
      hypothesis: 'Reformular la pregunta de uso de lentes como opción múltiple simple reducirá el abandono.',
      element: 'Pregunta 4 del test', metric: 'Abandono del test',
      variants: [
        { name: 'A — Control', visitors: 380, conversions: 241 },
        { name: 'B — Reformulada', visitors: 374, conversions: 292 },
      ],
      started_on: iso(NOW - 12 * DAY), ended_on: iso(NOW - 2 * DAY),
      status: 'finalizado', confidence: 94,
      result: 'La nueva redacción reduce el abandono de la pregunta en 13.6 puntos.',
      decision: 'implementar',
    },
    {
      id: 'exp_3', business_id: 'taller', name: 'Campos del formulario',
      hypothesis: 'Pedir solo nombre y teléfono aumentará los envíos del formulario.',
      element: 'Formulario de cotización', metric: 'Envío de formulario',
      variants: [
        { name: 'A — 4 campos', visitors: 290, conversions: 174 },
        { name: 'B — 2 campos', visitors: 285, conversions: 207 },
      ],
      started_on: iso(NOW - 9 * DAY), ended_on: iso(NOW - 1 * DAY),
      status: 'en_curso', confidence: 78,
      result: 'Tendencia favorable a 2 campos; muestra aún insuficiente para decidir.',
      decision: 'repetir',
    },
    {
      id: 'exp_4', business_id: 'taller', name: 'Recordatorio 24h + 2h',
      hypothesis: 'Dos recordatorios reducirán las ausencias a citas.',
      element: 'Recordatorios de cita', metric: 'Asistencia a citas',
      variants: [
        { name: 'A — 1 recordatorio', visitors: 240, conversions: 168 },
        { name: 'B — 2 recordatorios', visitors: 236, conversions: 189 },
      ],
      started_on: iso(NOW - 20 * DAY), ended_on: iso(NOW - 4 * DAY),
      status: 'finalizado', confidence: 88,
      result: 'El doble recordatorio mejora la asistencia en 10.1 puntos.',
      decision: 'implementar',
    },
  ]
}

function buildImprovements(): Improvement[] {
  return [
    {
      id: 'imp_1', business_id: 'optica', problem: 'Abandono alto en la pregunta de uso de lentes',
      recommendation: 'Simplificar q4 y convertirla en opción múltiple', action: 'Se reformuló la pregunta y se redujeron opciones',
      owner: 'Equipo Pulso', implemented_at: iso(NOW - 11 * DAY), metric: 'Tasa de abandono del test',
      before_value: 26.4, after_value: 12.8, unit: '%', status: 'evaluada',
      conclusion: 'Mejora confirmada: el abandono del test bajó 13.6 puntos con 94% de confianza.',
    },
    {
      id: 'imp_2', business_id: 'taller', problem: 'Formulario con exceso de campos',
      recommendation: 'Eliminar vehículo y problema del formulario inicial', action: 'Formulario reducido a nombre y teléfono',
      owner: 'Equipo Pulso', implemented_at: iso(NOW - 8 * DAY), metric: 'Envíos de formulario',
      before_value: 58.1, after_value: 68.4, unit: '%', status: 'en_curso',
      conclusion: 'Tendencia positiva; faltan 7 días para completar la muestra.',
    },
    {
      id: 'imp_3', business_id: 'optica', problem: 'Campaña TikTok con tráfico alto y baja conversión',
      recommendation: 'Pausar o reasignar presupuesto a retargeting', action: 'Campaña pausada y presupuesto reasignado',
      owner: 'Marketing', implemented_at: iso(NOW - 5 * DAY), metric: 'Costo por lead',
      before_value: 8.9, after_value: 6.2, unit: 'USD', status: 'implementada',
      conclusion: 'El CPL global mejoró tras reasignar el presupuesto.',
    },
    {
      id: 'imp_4', business_id: 'taller', problem: 'Leads sin seguimiento en las primeras 24 horas',
      recommendation: 'Activar respuesta automática de WhatsApp y alerta al responsable', action: 'Flujo de respuesta automática',
      owner: 'Comercial', implemented_at: iso(NOW - 2 * DAY), metric: 'Leads contactados < 24h',
      before_value: 61.0, after_value: 89.0, unit: '%', status: 'implementada',
      conclusion: 'Pendiente de evaluación con 14 días de datos.',
    },
  ]
}
