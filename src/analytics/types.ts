// ============================================================================
// PULSO ANALYTICS — Modelo de datos de inteligencia de marketing y comportamiento
// ============================================================================

export type BusinessId = string

export interface Business {
  id: BusinessId
  name: string
  emoji: string
  industry: string
  hasLocalCrm: boolean
  currency: string
  accent: string
  website: string
}

export type Platform = 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'Orgánico' | 'Directo' | 'Referidos'
export type Device = 'mobile' | 'desktop' | 'tablet'
export type BuyerStatus = 'all' | 'buyers' | 'nonbuyers'
export type VisitorStatus = 'all' | 'new' | 'returning'

export interface Campaign {
  id: string
  business_id: BusinessId
  platform: Platform
  name: string
  adset: string
  ad: string
  creative: string
  spend: number
  impressions: number
  clicks: number
  started_on: string
  ended_on?: string
  status: 'activa' | 'pausada' | 'finalizada'
}

export interface Visitor {
  id: string
  business_id: BusinessId
  first_seen: string
  last_seen: string
  sessions_count: number
  device: Device
  os: string
  browser: string
  language: string
  country: string
  city: string
  source: string
  medium: string
  campaign_id?: string
  ad?: string
  creative?: string
  landing_page: string
  is_returning: boolean
  is_identified: boolean
  is_lead: boolean
  is_buyer: boolean
  revenue: number
}

export interface QuizStepLog {
  question_id: string
  question: string
  step: number
  viewed: boolean
  answered: boolean
  answer?: string
  time_ms: number
  changed: boolean
  skipped: boolean
}

export interface FormFieldLog {
  field: string
  action: 'focus' | 'fill' | 'error' | 'abandon'
  time_ms: number
}

export interface PageView {
  path: string
  label: string
  scroll: number
  clicks: number
  seconds: number
  ts: string
}

export interface Session {
  id: string
  visitor_id: string
  business_id: BusinessId
  started_at: string
  ended_at: string
  duration_s: number
  source: string
  medium: string
  campaign_id?: string
  device: Device
  os: string
  browser: string
  landing_page: string
  pageviews: PageView[]
  page_count: number
  scroll_avg: number
  clicks: number
  quiz_started: boolean
  quiz_completed: boolean
  quiz_steps: QuizStepLog[]
  form_started: boolean
  form_submitted: boolean
  form_fields: FormFieldLog[]
  form_seconds: number
  booked: boolean
  confirmed: boolean
  attended: boolean
  purchased: boolean
  quote: boolean
  lead_captured: boolean
  revenue: number
  had_error: boolean
}

export type EventType =
  | 'visita' | 'page_view' | 'scroll' | 'click' | 'interaccion'
  | 'quiz_start' | 'quiz_step' | 'quiz_change' | 'quiz_complete'
  | 'form_start' | 'form_field' | 'form_submit' | 'form_abandon'
  | 'booking' | 'booking_confirm' | 'appointment_attend' | 'appointment_noshow'
  | 'lead' | 'whatsapp' | 'sale' | 'error' | 'exit'

export interface AnalyticsEvent {
  id: number
  business_id: BusinessId
  session_id: string
  visitor_id: string
  ts: string
  type: EventType
  page: string
  label: string
  metadata?: Record<string, any>
}

export interface Appointment {
  id: string
  business_id: BusinessId
  visitor_id: string
  session_id: string
  campaign_id?: string
  created_at: string
  scheduled_for: string
  status: 'pendiente' | 'confirmada' | 'atendida' | 'no_asistio' | 'cancelada' | 'reagendada'
  reminder: 'ninguno' | '24h' | '48h' | '24h+2h'
  lead_time_hours: number
  source: string
}

export interface Communication {
  id: string
  business_id: BusinessId
  visitor_id: string
  session_id: string
  channel: 'WhatsApp' | 'Llamada' | 'Email'
  direction: 'saliente' | 'entrante'
  sent_at: string
  replied_at?: string
  responded: boolean
  status: 'pendiente' | 'enviado' | 'entregado' | 'respondido' | 'sin_respuesta'
  outcome: 'interesado' | 'agendado' | 'compro' | 'no_interesado' | 'sin_respuesta' | 'pendiente'
  first_contact: boolean
  minutes_to_reply?: number
  notes?: string
}

export interface Sale {
  id: string
  business_id: BusinessId
  visitor_id: string
  session_id: string
  campaign_id?: string
  sold_at: string
  product: string
  category: string
  qty: number
  price: number
  discount: number
  total: number
  cost: number
  payment_status: 'Pagado total' | 'Pagado parcial' | 'Pendiente' | 'Devuelto'
  seller: string
  source: string
  first_touch_at: string
  days_to_close: number
}

export interface Experiment {
  id: string
  business_id: BusinessId
  name: string
  hypothesis: string
  element: string
  variants: { name: string; visitors: number; conversions: number }[]
  metric: string
  started_on: string
  ended_on?: string
  status: 'borrador' | 'en_curso' | 'finalizado'
  result: string
  confidence: number
  decision: 'sin_decision' | 'implementar' | 'descartar' | 'repetir'
}

export interface Improvement {
  id: string
  business_id: BusinessId
  problem: string
  recommendation: string
  action: string
  owner: string
  implemented_at: string
  metric: string
  before_value: number
  after_value: number
  unit: string
  status: 'pendiente' | 'en_curso' | 'implementada' | 'evaluada'
  conclusion: string
}

export type Severity = 'good' | 'bad' | 'warn' | 'info'

export interface Insight {
  id: string
  business_id: BusinessId | 'all'
  severity: Severity
  category: 'Adquisición' | 'Comportamiento' | 'Evaluaciones' | 'Formularios' | 'Citas' | 'Ventas' | 'Seguimiento' | 'Experiencia'
  title: string
  finding: string
  evidence: string
  metric_label: string
  metric_value: string
  comparison?: string
  recommendation: string
  expected_impact: 'alto' | 'medio' | 'bajo'
  effort: 'alto' | 'medio' | 'bajo'
  priority: number
  confidence: 'alta' | 'media' | 'baja'
  data_points: number
  actions: string[]
}

export interface AnalyticsDataset {
  mode: 'demo' | 'live'
  generated_at: string
  businesses: Business[]
  campaigns: Campaign[]
  visitors: Visitor[]
  sessions: Session[]
  events: AnalyticsEvent[]
  appointments: Appointment[]
  communications: Communication[]
  sales: Sale[]
  experiments: Experiment[]
  improvements: Improvement[]
}

export interface AnalyticsFilters {
  business: BusinessId | 'all'
  days: 7 | 14 | 30 | 90
  source: string
  campaign: string
  device: 'all' | Device
  visitor: VisitorStatus
  buyer: BuyerStatus
  compare: boolean
}

export interface Kpis {
  visitors: number
  newVisitors: number
  returningVisitors: number
  sessions: number
  engaged: number
  quizStarted: number
  quizCompleted: number
  leads: number
  appointments: number
  confirmed: number
  attended: number
  quotes: number
  sales: number
  revenue: number
  avgTicket: number
  adSpend: number
  cpl: number
  cpa: number
  cac: number
  roi: number
  conversionRate: number
  abandonRate: number
  activeNow: number
}

export interface FunnelStage {
  key: string
  label: string
  count: number
  pct: number
  dropPct: number
  avgHours?: number
  note?: string
}

export interface TimeseriesPoint {
  date: string
  label: string
  visitors: number
  sessions: number
  leads: number
  appointments: number
  sales: number
  revenue: number
  adSpend: number
}

export interface BreakdownRow {
  key: string
  label: string
  visitors: number
  sessions: number
  leads: number
  appointments: number
  sales: number
  revenue: number
  spend: number
  conversion: number
  cpl: number
  roas: number
  color?: string
}

export interface QuestionStat {
  question_id: string
  question: string
  step: number
  views: number
  answers: number
  abandons: number
  answerRate: number
  avgSeconds: number
  changedRate: number
  topAnswer: string
  topAnswerPct: number
}

export interface FormFieldStat {
  field: string
  focus: number
  filled: number
  errors: number
  abandons: number
  abandonRate: number
  avgSeconds: number
}

export interface PathRow {
  path: string
  label: string
  views: number
  visitors: number
  avgSeconds: number
  avgScroll: number
  exits: number
  exitRate: number
  conversions: number
  conversionRate: number
}

export interface SavedView {
  id: string
  name: string
  filters: AnalyticsFilters
  created_at: string
}
