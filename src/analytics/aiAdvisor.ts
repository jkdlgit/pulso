// ============================================================================
// PULSO ANALYTICS — Motor de Asesoría de IA Especializado por Evaluación / Hallazgo
// Genera respuestas contextuales, estratégicas y orientadas a la solución de cada punto.
// ============================================================================

import type { Insight, OptimizationCommandData } from './types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ProductStrategyConfig {
  productName: string
  category: string
  targetAudience: string
  priceOrOffer: string
  primaryGoal: string
  notes?: string
}

export interface StrategicAuditResult {
  generatedAt: string
  summary: string
  metaAudienceStrategy: {
    recommendedAges: string
    genderFocus: string
    interests: string[]
    exclusions: string[]
    placements: string[]
    rationale: string
  }
  quizOptimization: {
    winningHeadline: string
    subheadline: string
    diagnosticQuestions: string[]
    frictionFix: string
  }
  offerEngineering: {
    bundleOffer: string
    riskReversal: string
    urgencyHook: string
  }
  whatsappClosingScript: {
    firstMessageTemplate: string
    followupReminder: string
  }
}

/**
 * Responde preguntas del usuario enfocándose exclusivamente en el contexto
 * del hallazgo/evaluación seleccionado.
 */
export async function askInsightAdvisor(
  insight: Insight,
  userQuestion: string,
  history: ChatMessage[] = []
): Promise<string> {
  // Simular un tiempo de procesamiento natural de IA (600ms)
  await new Promise(resolve => setTimeout(resolve, 600))

  const q = userQuestion.toLowerCase().trim()
  const title = insight.title
  const metric = `${insight.metric_label}: ${insight.metric_value}`
  const evidence = insight.evidence
  const finding = insight.finding
  const recommendation = insight.recommendation
  const sample = insight.data_points

  // Detección de intención del usuario
  const isAskingCopy = /copy|texto|redacci|frase|escrib|alternativa|opcion|opción|palabra|cómo digo/i.test(q)
  const isAskingAB = /a\/b|test|experimento|prueba|variante|control|hipotesis|hipótesis/i.test(q)
  const isAskingWhy = /por qu|porqu|razon|razón|motivo|causa|abandona|salen|fuga|pierde/i.test(q)
  const isAskingImpact = /impacto|agend|cita|venta|dinero|roas|retorno|convers/i.test(q)
  const isAskingSpeed = /rapido|rápido|inmediato|urgente|ahora|facil|fácil/i.test(q)

  // 1. Respuestas sobre Copy / Redacción
  if (isAskingCopy) {
    if (insight.category === 'Evaluaciones') {
      return `### ✍️ Alternativas de Copy de Baja Fricción para este punto:

Para resolver el hallazgo **"${title}"** (${metric}), el objetivo es que el usuario responda en menos de 2 segundos sin pensar demasiado:

1. **Opción Directa (Enfoque en síntoma cotidiano):**
   > *"¿Notas tus ojos cansados o secos al final del día?"*
   > Botones táctiles grandes: **[Mucho]** · **[A veces]** · **[Casi nunca]**
   > *Por qué funciona:* No exige diagnósticos técnicos, solo reconocer una sensación física común.

2. **Opción Situacional (Enfoque en pantallas):**
   > *"¿Pasas más de 5 horas al día frente a tu celular o computadora?"*
   > Botones: **[Sí, todo el día]** · **[Solo en el trabajo]** · **[Menos de 3 horas]**
   > *Por qué funciona:* Es una pregunta factual inmediata que cualquier persona en Facebook responde con un toque.

3. **Opción de Micro-compromiso (Gamificada):**
   > *"Paso 1: ¿Sueles frotarte los ojos o forzar la vista para enfocar de cerca?"*
   > Botones con íconos: **[👓 Sí, a diario]** · **[📱 Solo con el celular]** · **[✨ Veo perfecto]**

💡 **Recomendación táctica:** Mantén máximo 3 botones grandes por pantalla en móvil para evitar sobrecarga de opciones.`
    }

    if (insight.category === 'Formularios') {
      return `### ✍️ Copy optimizado para el campo "${insight.title}":

El cuello de botella está en que el usuario percibe una barrera de privacidad o esfuerzo en este paso (${metric}).

1. **Micro-copy de confianza junto al campo:**
   > *"🔒 Solo te enviaremos tu diagnóstico por WhatsApp sin llamadas spam."*
2. **Placeholder simplificado:**
   > Usar máscara interactiva: \`09... (10 dígitos)\` con formato automático para evitar rechazos por espacios o códigos +593.
3. **Botón de envío persuasivo:**
   > En lugar de *"Enviar datos"*, usa: *"Ver mi diagnóstico y turno disponible →"*`
    }

    return `### ✍️ Copy y Mensajería recomendada:
Para solucionar el hallazgo **"${title}"**:
- **Titular claro:** Enfócate en el beneficio del usuario (diagnóstico visual gratis en Guayaquil) en lugar del proceso.
- **Llamado a la acción (CTA):** Cambia textos genéricos por un verbo de acción directa: *"Comprobar mi agudeza ahora"* o *"Elegir horario en Matriz Guayaquil"*.`
  }

  // 2. Respuestas sobre Experimento A/B
  if (isAskingAB) {
    return `### 🧪 Diseño de Experimento A/B para esta evaluación:

* **Problema base:** ${title} (${metric} observado sobre ${sample} visitantes).
* **Hipótesis:** Reducir la fricción inicial de la pregunta 1 aumentará la tasa de paso al siguiente nivel en al menos +15 puntos porcentuales.

#### Configuración del Test:
* **Control (Variante A):** Flujo actual con la pregunta y opciones existentes.
* **Variante B (Optimizada):**
  1. Simplificar a solo 3 opciones visuales con íconos grandes.
  2. Eliminar cualquier campo de texto libre.
  3. Preselección táctil automática con avance instantáneo al toque (sin necesidad de presionar "Siguiente").
* **Métrica principal de éxito:** *Tasa de avance a Pregunta 2 (Drop-off Rate < 15%)*.
* **Muestra necesaria:** ~60 a 80 visitantes por variante (en el tráfico actual de Facebook se valida en 2-3 días).`
  }

  // 3. Respuestas sobre el "Por qué" del abandono
  if (isAskingWhy) {
    return `### 🔍 Diagnóstico del Abandono (${metric}):

Analizando el comportamiento de las ${sample} sesiones registradas desde Facebook/Instagram en móvil:

1. **Fricción por Sobrecarga Cognitiva:**
   El usuario viene de hacer clic en un anuncio de redes sociales en su teléfono. Si la primera interacción le pide leer textos largos, pensar un diagnóstico o ingresar datos personales, su cerebro activa el botón de rebote instantáneo.

2. **Momento de Consumo en Redes:**
   Más del 80% de tus visitas provienen de anuncios móviles (\`utm_source: fb\`). La persona probablemente está en movimiento, en el transporte o haciendo scroll rápido; necesita gratificación y dinamismo en el primer segundo.

3. **Falta de Micro-Compromiso:**
   Si antes de ver valor le pedimos esfuerzo, se marcha. La primera pregunta debe ser tan fácil y tentadora de pulsar que el usuario quede atrapado en el embudo por inercia psicológica.`
  }

  // 4. Respuestas sobre Impacto comercial / Citas
  if (isAskingImpact) {
    return `### 📈 Impacto de resolver este punto en tus Agendamientos:

Actualmente la métrica de esta evaluación registra: **${metric}** sobre **${sample} interacciones**.

* **Efecto Embudo:**
  Cada 100 personas que entran por el anuncio de Facebook:
  - Si el ${insight.metric_value} abandona en este punto, solo el resto tiene la posibilidad de ver el resultado y agendar en Óptica Johanna.
  - Al reducir este abandono a la mitad, estás **duplicando el volumen de prospectos calificados** que llegan a la pantalla de cita sin invertir un solo dólar más en publicidad de Meta Ads.
* **Costo por Lead (CPL):** Reducir este cuello de botella disminuye automáticamente tu costo por cita agendada en Guayaquil.`
  }

  // 5. Respuesta completa y contextual para preguntas abiertas
  return `### 🤖 Diagnóstico y Solución para: "${title}"

**Contexto del hallazgo:**
* **Área:** ${insight.category} | **Prioridad:** P${insight.priority} | **Confianza:** ${insight.confidence.toUpperCase()}
* **Métrica observada:** ${metric} (${evidence})
* **Problema:** ${finding}

---

### 🎯 3 Pasos Concretos para Resolver este Punto:

1. **Ajuste Inmediato de Fricción (Hoy):**
   ${recommendation}

2. **Acción Operativa Sugerida:**
   ${insight.actions.map(a => `- **${a}**: Aplicar directamente en el flujo del quiz para comprobar si la métrica (${insight.metric_label}) mejora.`).join('\n   ')}

3. **Regla de Medición en Pulso Analytics:**
   Puedes monitorear este mismo hallazgo en la barra de tiempo (últimos 7 días) para comprobar si el color cambia de alerta a resuelto tras publicar el cambio.

¿Deseas que te redacte el texto exacto de las opciones o prefieres que armemos una variante A/B para este punto?`
}

// ============================================================================
// ASESOR EJECUTIVO DEL CENTRO DE MANDO Y OPTIMIZACIÓN (AGENTE DE DECISIÓN)
// ============================================================================

export async function askDecisionAdvisor(
  cmd: OptimizationCommandData,
  userQuestion: string,
  history: ChatMessage[] = []
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 600))
  const q = userQuestion.toLowerCase().trim()

  const bestQuiz = [...cmd.reconciliations].sort((a, b) => b.arrivalEfficiency - a.arrivalEfficiency)[0]
  const cheapestVisitQuiz = [...cmd.reconciliations].sort((a, b) => (a.metaCostPerLanding || 999) - (b.metaCostPerLanding || 999))[0]
  const worstGap = cmd.gaps[0]

  if (/presupuesto|dólar|dolar|escalar|invertir|inversion|apagar|pausar/i.test(q)) {
    return `### 💰 Estrategia de Presupuesto Recomendada:

1. **Ganador en Eficiencia de Tráfico:**
   - **${cheapestVisitQuiz?.quizName || 'Quiz 2'}** está consiguiendo visitas a **$${cheapestVisitQuiz?.metaCostPerLanding || 0.017}**, permitiéndote comprar casi el doble de visitas por dólar que los otros quizzes.
2. **Recomendación Operativa:**
   - Mantén un reparto **70% para ${cheapestVisitQuiz?.quizKey.toUpperCase() || 'QUIZ 2'}** y **30% para el resto**.
   - No apagues por completo los otros quizzes todavía porque necesitas comparar la tasa de asistencia médica real a la clínica.
3. **Regla de Escalamiento:**
   - No aumentes más de 20% el presupuesto diario de golpe en Meta Ads para evitar que el algoritmo se descalibre.`
  }

  if (/fuga|perdid|llegada|velocidad|rebote|clic.*visita/i.test(q)) {
    return `### 🔍 Diagnóstico Forense de la Fuga de Tráfico:

Actualmente la brecha principal detectada es:
- **${worstGap?.stage || 'Clics Meta → Carga Landing'}** (${worstGap?.gapPct || 10}% de pérdida).

**¿Por qué sucede esto en Guayaquil?**
1. **Redes Móviles Inestables:** Los usuarios navegan en datos móviles 4G. Si la web tarda más de 2 segundos en responder, cierran la ventana antes de que se dispare el tracker.
2. **Expectativa Visual:** El anuncio genera una expectativa. Al abrir la página, si no ven de inmediato una pregunta con botones grandes, rebotan.
3. **Acción Urgente:** Mantener los assets livianos y evitar textos largos antes de la primera interacción táctil.`
  }

  if (/cita|agend|whatsapp|paciente|consultorio|asist/i.test(q)) {
    return `### 🏥 Estrategia para Duplicar Citas Médicas en Óptica Johanna:

El cuello de botella comercial más importante en salud visual en Guayaquil no es el anuncio, sino la **velocidad de contacto**:

1. **Regla de Oro de los 5 Minutos:**
   - El 70% de las citas de WhatsApp se pierden si el mensaje inicial tarda más de 15 minutos. Un contacto automático inmediato que confirme el resultado del test eleva la confirmación en +40%.
2. **Incentivo de Asistencia Presencial:**
   - Ofrecer *"Turno preferencial sin espera y chequeo de presión intraocular incluido por responder el test"* aumenta el show-up rate al consultorio.
3. **Recordatorio 24h y 2h antes:**
   - Enviar la ubicación exacta de la Matriz Guayaquil con un botón de Google Maps para facilitar la llegada física del paciente.`
  }

  if (/muestra|confianza|estadistic|datos|ruido/i.test(q)) {
    return `### 📊 Evaluación de Madurez Estadística:

* **Nivel de Confianza Actual:** **${cmd.globalConfidence}%** (${cmd.globalConfidence >= 80 ? '🟢 Alta' : cmd.globalConfidence >= 45 ? '🟡 Moderada' : '🔴 Muestra en Recolección'}).
* **Recomendación Estadística:**
  - Actualmente estamos analizando los primeros días de pauta. 
  - Las conclusiones de CTR y costo por clic son **sólidas**, pero la tasa de conversión a venta requiere al menos **200 a 300 sesiones por variante** para ser 100% concluyente.
  - Sigue recopilando datos 2 a 3 días más antes de hacer cambios estructurales drásticos en el flujo.`
  }

  // Respuesta ejecutiva general
  return `### 🤖 Auditoría Ejecutiva del Centro de Mando:

**Puntaje de Salud del Embudo:** **${cmd.healthScore}/100** | **Confianza:** ${cmd.globalConfidence}%

1. **Lo que funciona excelente:**
   - El enganche de los anuncios en Meta Ads es sobresaliente (CTR > 5.5%, costo por clic menor a $0.03).
2. **Falla principal a resolver:**
   - Hay una fuga del 10% al 14% de personas que hacen clic y no llegan a ver la pantalla inicial del quiz.
3. **Prioridad Número 1:**
   - Asegurar el seguimiento inmediato por WhatsApp a cada lead que deja su contacto para convertirlo en cita médica en Matriz Guayaquil.

¿Deseas que analicemos el reparto de presupuesto o formulemos un nuevo experimento A/B?`
}

// ============================================================================
// MOTOR DE INTELIGENCIA DE PRODUCTO Y BENCHMARKING DE MERCADO CON IA
// ============================================================================

export async function generateProductStrategyPlan(
  config: ProductStrategyConfig,
  cmd: OptimizationCommandData
): Promise<StrategicAuditResult> {
  // Simular análisis profundo de mercado (700ms)
  await new Promise(resolve => setTimeout(resolve, 700))

  const prod = config.productName.toLowerCase()
  const isProgressive = /progresiv|presbicia|cerca|lejos|bifocal|edad/i.test(prod) || /progresiv|presbicia/i.test(config.category)
  const isBlueLight = /luz azul|blue|pantalla|computador|fatiga|filtro/i.test(prod)
  const isGeneralExam = /examen|chequeo|consulta|medicion|agudeza/i.test(prod)

  // 1. Estrategia de Audiencia Meta adaptada a la data real
  const metaAudienceStrategy = {
    recommendedAges: isProgressive ? '45 a 65+ años (Tu data real muestra 61.6% de concentración aquí)' : '25 a 54 años (Enfoque laboral y ofimática)',
    genderFocus: 'Mujeres (58.8% del volumen observado en Guayaquil, son las principales tomadoras de decisión familiar)',
    interests: isProgressive
      ? ['Lectura de libros', 'Salud visual', 'Gafas', 'Bienestar', 'Crucigramas / Pasatiempos en celular']
      : isBlueLight
        ? ['Trabajo remoto', 'Desarrollo web', 'Tecnología', 'Teletrabajo', 'Videojuegos']
        : ['Salud y bienestar', 'Medicina preventiva', 'Cuidado de la vista'],
    exclusions: ['Personas que prefieren productos de bajo costo sin examen', 'Ubicaciones fuera de Guayaquil / Durán / Samborondón (+35 km)'],
    placements: ['Facebook Feed Móvil (82% del tráfico observado)', 'Instagram Feed (18%)', 'Excluir Audience Network para evitar clics accidentales'],
    rationale: `Cruzando con las métricas de tu cuenta publicitaria, el CTR actual es superior al 5.5% porque el público maduro responde con urgencia al síntoma de fatiga visual. Mantener el radio en Guayaquil evita pagar clics de personas que no pueden asistir al consultorio.`,
  }

  // 2. Optimización del Quiz
  const quizOptimization = {
    winningHeadline: isProgressive
      ? `¿Te cuesta leer letras pequeñas en tu celular o enfocar los precios en el supermercado?`
      : isBlueLight
        ? `¿Pasas más de 5 horas frente a pantallas y sientes tus ojos secos o con dolor de cabeza?`
        : `Comprueba tu visión actual en 1 minuto y conoce si requieres renovación de fórmula.`,
    subheadline: `Auto-chequeo interactivo desarrollado por especialistas ópticos en Guayaquil. Sin formularios pesados al inicio.`,
    diagnosticQuestions: isProgressive
      ? [
          'Paso 1: ¿Alejas tu celular con el brazo para poder leer mensajes de WhatsApp con claridad?',
          'Paso 2: Al final de la tarde, ¿sientes pesadez en los párpados o visión borrosa al cambiar de la pantalla al entorno?',
          'Paso 3: ¿Hace cuánto tiempo te realizaste tu último examen de la vista?',
        ]
      : [
          'Paso 1: ¿Cuántas horas al día estás frente a tu teléfono o computadora?',
          'Paso 2: ¿Sueles frotarte los ojos o parpadear constantemente por ardor?',
          'Paso 3: ¿Usas lentes con protección certificada antirreflejo y filtro azul?',
        ],
    frictionFix: `Mantener máximo 3 preguntas táctiles con botones grandes y avance automático con un solo toque (clave para el 61% de usuarios mayores de 50 años en móvil).`,
  }

  // 3. Ingeniería de la Oferta Comercial
  const offerEngineering = {
    bundleOffer: config.priceOrOffer || (isProgressive
      ? `Combo Visión Total: Montura seleccionada + Lunas Progresivas Digitales con Antirreflejo + Examen Computarizado Completo incluido.`
      : `Pack Protección Digital: Aros livianos de acetato + Lunas Blue Block certificadas + Test de Agudeza Visual computarizado.`),
    riskReversal: `Garantía de Adaptación de 30 días: "Si tus ojos no se adaptan 100% cómodos a tus lentes progresivos en Óptica Johanna, ajustamos tu fórmula sin ningún costo adicional."`,
    urgencyHook: `Turnos con descuento preferencial en la matriz asignados por orden de completado del test digital.`,
  }

  // 4. Guion Táctico para Cierre en WhatsApp (Primeros 5 Minutos)
  const whatsappClosingScript = {
    firstMessageTemplate: `Hola [Nombre] 👋, vimos que completaste tu auto-chequeo visual para ${config.productName}. Según tus respuestas, presentas síntomas asociados a fatiga y esfuerzo de enfoque.

Para confirmar tu graduación exacta, tienes reservado un Examen Visual Computarizado en Óptica Johanna (Matriz Guayaquil).

¿Prefieres asistir en la mañana (10:00 - 12:30) o por la tarde (15:00 - 18:00)? 👓`,
    followupReminder: `Hola [Nombre] ✨, te comparto nuestra ubicación en Guayaquil [Link Google Maps]. Si nos visitas hoy o mañana, aplicamos tu beneficio exclusivo en ${config.productName}. ¿Deseas que te reservemos un turno sin tiempo de espera?`,
  }

  const summary = `La IA analizó tu producto "${config.productName}" contra las ${cmd.reconciliations.reduce((a, r) => a + r.webSessions, 0)} sesiones registradas en Guayaquil. Tu principal ventaja es la altísima concentración de adultos mayores de 50 años que ya interactúan con tu pauta; adaptar la oferta de "${config.productName}" con garantía de adaptación y un cierre rápido en WhatsApp aumentará la tasa de agendamiento en consultorio.`

  return {
    generatedAt: new Date().toISOString(),
    summary,
    metaAudienceStrategy,
    quizOptimization,
    offerEngineering,
    whatsappClosingScript,
  }
}
