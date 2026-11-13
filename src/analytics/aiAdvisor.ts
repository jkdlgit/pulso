// ============================================================================
// PULSO ANALYTICS — Motor de Asesoría de IA Especializado por Evaluación / Hallazgo
// Genera respuestas contextuales, estratégicas y orientadas a la solución de cada punto.
// ============================================================================

import type { Insight } from './types'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
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
