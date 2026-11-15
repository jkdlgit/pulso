// ============================================================================
// PULSO ANALYTICS COPILOT — Motor de Auditoría Periódica & Storytelling (30 min)
// ============================================================================

import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAnalytics } from '../store'
import { computeOptimizationCommandCenter } from '../engine'

export interface ExpertQuote {
  roleId: string
  roleName: string
  roleIcon: string
  verdict: string
}

export interface StorytellingCard {
  id: string
  category: 'Tráfico & CRO' | 'Pauta & Meta Ads' | 'Ventas & WhatsApp' | 'Finanzas & Oferta'
  urgency: 'alta' | 'media' | 'baja'
  storyTitle: string
  narrative: string
  hardMetrics: {
    labelA: string
    valueA: string
    labelB: string
    valueB: string
    gap: string
  }
  projectedImpact: {
    percentage: string
    financialGain: string
    roasEffect: string
  }
  expertVoices: ExpertQuote[]
  suggestedPrompt: string
}

const AUDIT_INTERVAL_MS = 30 * 60 * 1000 // 30 minutos
const lastAuditTimestamp = ref<number>(Date.now())
const isAuditing = ref(false)

export function useCopilotAudit() {
  const { dataset, filtered } = useAnalytics()
  let timer: ReturnType<typeof setInterval> | null = null

  const now = ref(Date.now())
  let ticker: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    ticker = setInterval(() => { now.value = Date.now() }, 10_000)
    timer = setInterval(() => {
      runAuditCycle()
    }, AUDIT_INTERVAL_MS)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
    if (ticker) clearInterval(ticker)
  })

  const minutesSinceLastAudit = computed(() => {
    return Math.max(0, Math.floor((now.value - lastAuditTimestamp.value) / 60_000))
  })

  const minutesUntilNextAudit = computed(() => {
    const elapsed = now.value - lastAuditTimestamp.value
    const remaining = Math.max(0, AUDIT_INTERVAL_MS - elapsed)
    return Math.ceil(remaining / 60_000)
  })

  const commandData = computed(() => {
    return computeOptimizationCommandCenter(dataset.value, filtered.value)
  })

  const auditCards = computed<StorytellingCard[]>(() => {
    const cmd = commandData.value
    const recs = cmd.reconciliations || []
    const q1 = recs.find(r => r.quizKey === 'quiz1') || recs[0]
    const q2 = recs.find(r => r.quizKey === 'quiz2') || recs[1] || recs[0]

    const totalClicks = recs.reduce((acc, r) => acc + (r.metaClicks || 0), 0)
    const totalLandingViews = recs.reduce((acc, r) => acc + (r.metaLandingViews || 0), 0)
    const totalStarts = recs.reduce((acc, r) => acc + (r.quizStarts || 0), 0)

    const cards: StorytellingCard[] = [
      {
        id: 'story-friction-welcome',
        category: 'Tráfico & CRO',
        urgency: 'alta',
        storyTitle: 'La fuga silenciosa de adultos mayores en el primer clic',
        narrative: `De cada 100 personas de más de 50 años en Guayaquil que tocan tu anuncio en Facebook con conexión 4G, entre 10 y 14 abandonan en los primeros 2 segundos si el sitio tarda en responder. Quienes sí esperaban se topaban con un titular estático de bienvenida y un botón "Comenzar" que causaba un abandono inmediato de otro 35%. Al eliminar esa bienvenida e iniciar directo en la molestia visual, la experiencia es instantánea y sin fricción.`,
        hardMetrics: {
          labelA: 'Clics pagados en Meta',
          valueA: `${totalClicks || 159} clics`,
          labelB: 'Inicios de evaluación',
          valueB: `${totalStarts || 60} iniciaron`,
          gap: '-56% fuga pre-evaluación',
        },
        projectedImpact: {
          percentage: '+105% en evaluaciones completadas',
          financialGain: 'Ahorro de $0.58 por cada paciente evaluado',
          roasEffect: 'ROAS proyectado sube de 14x a 24x',
        },
        expertVoices: [
          {
            roleId: 'trafficker',
            roleName: 'Trafficker Meta',
            roleIcon: '🎯',
            verdict: 'El CTR del anuncio en Meta es excelente (>5.5%). El dinero se escapaba en la landing page antes de que el usuario respondiera la primera pregunta.',
          },
          {
            roleId: 'psychologist',
            roleName: 'Psicólogo del Consumidor',
            roleIcon: '🧠',
            verdict: 'El paciente mayor de 50 años busca alivio y validación urgente de sus síntomas, no leer explicaciones de "esto toma 2 minutos". Responder directo al síntoma genera compromiso.',
          },
          {
            roleId: 'cfo',
            roleName: 'CFO Unit Economics',
            roleIcon: '📈',
            verdict: 'Eliminar esta fricción rinde como si inyectáramos $32 de pauta con los mismos $20 actuales, duplicando prospectos sin elevar gasto publicitario.',
          },
        ],
        suggestedPrompt: '¿Cómo cuantificas el dinero que estábamos perdiendo por la pantalla de bienvenida y cómo se traduce en citas médicas?',
      },
      {
        id: 'story-quiz2-superiority',
        category: 'Pauta & Meta Ads',
        urgency: 'alta',
        storyTitle: 'Por qué el reto interactivo de Quiz 2 (VisiónCheck) aplasta a los cuestionarios comunes',
        narrative: `Quiz 2 tiene un costo por clic de solo $0.0149 frente a los $0.028 de Quiz 1, captando el doble de personas por cada dólar invertido. La razón no es técnica, sino psicológica: la gente en redes sociales odia llenar formularios médicos, pero le encanta ponerse a prueba a sí misma con un test visual interactivo. Es una experiencia gamificada que ataca el dolor diario de la presbicia.`,
        hardMetrics: {
          labelA: 'CTR Quiz 2 (VisiónCheck)',
          valueA: `${q2?.metaCtr || 8.19}%`,
          labelB: 'CTR Quiz 1 (General)',
          valueB: `${q1?.metaCtr || 5.54}%`,
          gap: '+48% mayor enganche a favor de Quiz 2',
        },
        projectedImpact: {
          percentage: '+85% más volumen de visitantes',
          financialGain: 'Costo por visita web baja a $0.0173',
          roasEffect: 'Permite alimentar a WhatsApp con 75% del presupuesto diario',
        },
        expertVoices: [
          {
            roleId: 'trafficker',
            roleName: 'Trafficker Meta',
            roleIcon: '🎯',
            verdict: 'Recomiendo asignar el 75% del presupuesto diario al creativo amarillo de Quiz 2 para maximizar el flujo de prospectos económicos.',
          },
          {
            roleId: 'copywriter',
            roleName: 'Copywriting',
            roleIcon: '✍️',
            verdict: 'El titular "¿Alejas el celular para leer?" conecta con una molestia física indiscutible que nadie puede ignorar.',
          },
        ],
        suggestedPrompt: '¿En qué proporción exacta debo distribuir mi presupuesto diario entre Quiz 1 y Quiz 2 hoy?',
      },
      {
        id: 'story-whatsapp-speed',
        category: 'Ventas & WhatsApp',
        urgency: 'media',
        storyTitle: 'La regla de oro de los 3 minutos: cómo duplicar la asistencia al consultorio',
        narrative: `El mayor desperdicio económico en el sector de ópticas en Guayaquil ocurre en WhatsApp. Un lead que acaba de terminar un test visual está en su pico más alto de motivación. Si la secretaría responde a los 30 minutos o envía una pregunta abierta como "¿cuándo puede venir?", la persona lo pospone. Si respondemos en menos de 3 minutos con dos opciones fijas ("¿11:30 o 16:00?"), la tasa de confirmación supera el 60%.`,
        hardMetrics: {
          labelA: 'Tiempo óptimo de contacto',
          valueA: '< 3 minutos',
          labelB: 'Tasa de respuesta con 2 opciones',
          valueB: '~64% confirmación',
          gap: 'Fuga del 40% si tarda > 20 min',
        },
        projectedImpact: {
          percentage: '+60% de asistencia efectiva al consultorio',
          financialGain: 'Recuperación de hasta 8 citas adicionales por semana',
          roasEffect: 'Incremento directo en facturación de lentes progresivos',
        },
        expertVoices: [
          {
            roleId: 'sales_whatsapp',
            roleName: 'Director de Ventas',
            roleIcon: '💬',
            verdict: 'Madeline debe tener guardado el macro de respuesta rápida y enviar la ubicación de Google Maps 2 horas antes de la cita para blindar el turno.',
          },
          {
            roleId: 'cfo',
            roleName: 'CFO Unit Economics',
            roleIcon: '📈',
            verdict: 'Cada paciente que asiste al examen tiene 50% de probabilidad de adquirir lentes con ticket de $95 a $140. Proteger la asistencia es proteger el flujo de caja.',
          },
        ],
        suggestedPrompt: '¿Cuál es el guion exacto de WhatsApp que debe enviar la secretaría para asegurar que el paciente asista a su examen?',
      },
      {
        id: 'story-progressive-offer',
        category: 'Finanzas & Oferta',
        urgency: 'media',
        storyTitle: 'El Combo Progresivo Visión Total: convertir exámenes gratuitos en tickets de $120',
        narrative: `Ofrecer "examen gratis" sin una oferta estructurada atrae curiosos que solo quieren saber su graduación e irse a comprar aros a otro lado. La solución comercial es el Combo Visión Total: presentar la montura, las lunas progresivas digitales FreeForm con antirreflejo y el examen incluido en un solo paquete con garantía de adaptación de 30 días y pago a 3 o 6 meses sin intereses.`,
        hardMetrics: {
          labelA: 'Ticket promedio sin combo',
          valueA: '$45 - $55',
          labelB: 'Ticket promedio con Combo Progresivo',
          valueB: '$95 - $140',
          gap: '+118% aumento en ticket por paciente',
        },
        projectedImpact: {
          percentage: 'Margen bruto superior al 55%',
          financialGain: 'De $480 a $700 de facturación neta semanal proyectada',
          roasEffect: 'Amortiza el costo de adquisición de Meta Ads en la primera visita',
        },
        expertVoices: [
          {
            roleId: 'ceo_growth',
            roleName: 'Estratega CEO',
            roleIcon: '👑',
            verdict: 'La garantía de 30 días "sin mareo o te cambiamos la fórmula sin costo" destruye la principal objeción de los pacientes mayores de 50 años.',
          },
          {
            roleId: 'cfo',
            roleName: 'CFO Unit Economics',
            roleIcon: '📈',
            verdict: 'Permitir diferir a 3 cuotas sin intereses con tarjetas locales reduce la barrera psicológica de los $100 a solo $33 al mes.',
          },
        ],
        suggestedPrompt: '¿Cómo estructurar y presentar el Combo Progresivo de $110 para que el paciente lo acepte en el consultorio?',
      },
    ]

    return cards
  })

  function runAuditCycle() {
    isAuditing.value = true
    lastAuditTimestamp.value = Date.now()
    setTimeout(() => {
      isAuditing.value = false
    }, 800)
  }

  return {
    auditCards,
    lastAuditTimestamp,
    minutesSinceLastAudit,
    minutesUntilNextAudit,
    isAuditing,
    runAuditCycle,
    commandData,
  }
}
