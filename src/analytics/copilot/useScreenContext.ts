// ============================================================================
// PULSO ANALYTICS COPILOT — Sensor de Conciencia de Pantalla & Sistema
// ============================================================================

import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAnalytics } from '../store'

export interface ScreenContextSnapshot {
  path: string
  routeName: string
  pageTitle: string
  pageArea: string
  summary: string
  activeFilters: {
    days: number
    business: string
    source: string
    campaign: string
  }
  visibleKpis: {
    sessions: number
    visitors: number
    appointments: number
    sales: number
    adSpend: number
  }
  focusedItem: {
    type?: string
    id?: string
    label?: string
    metadata?: Record<string, any>
  } | null
}

const focusedItem = ref<{
  type?: string
  id?: string
  label?: string
  metadata?: Record<string, any>
} | null>(null)

export function useScreenContext() {
  const route = useRoute()
  const { filtered } = useAnalytics()

  const pageDetails = computed(() => {
    const p = route?.path || '/analytics/overview'

    if (p.includes('command-center')) {
      return {
        title: 'Centro de Mando & Asesor de Crecimiento',
        area: 'Estrategia & Toma de Decisiones',
        summary: 'Vista ejecutiva global con auditoría cruzada Meta Ads vs Web, simulador de escenarios económicos y análisis de producto.',
      }
    }
    if (p.includes('overview') || p === '/analytics') {
      return {
        title: 'Visión General del Negocio (Overview)',
        area: 'Métricas Principales & Salud del Embudo',
        summary: 'Tablero macro con KPIs agregados, volumen de visitantes, costo de adquisición y resumen de ventas en Óptica Johanna.',
      }
    }
    if (p.includes('acquisition')) {
      return {
        title: 'Adquisición de Tráfico & Meta Ads',
        area: 'Campañas Publicitarias & Pauta',
        summary: 'Rendimiento comparativo de pauta: impresiones, CTR de anuncios (Quiz 1 vs Quiz 2), CPC y atribución de canal.',
      }
    }
    if (p.includes('behavior')) {
      return {
        title: 'Comportamiento en Sitio',
        area: 'Interacción del Usuario & Navegación',
        summary: 'Profundidad de scroll, clics por página, tiempo de permanencia y páginas más visitadas en la web.',
      }
    }
    if (p.includes('heatmaps')) {
      return {
        title: 'Mapas de Calor Visuales (Heatmaps)',
        area: 'Zonas Calientes & Clics Táctiles',
        summary: 'Concentración de toques y pulsaciones táctiles de usuarios móviles en Guayaquil sobre los quizzes.',
      }
    }
    if (p.includes('replay')) {
      return {
        title: 'Replay de Sesiones Táctiles (Vectorial)',
        area: 'Reproductor DOM & Privacidad por Diseño',
        summary: 'Reconstrucción en tiempo real de cómo el paciente navega el quiz paso a paso y selecciona respuestas.',
      }
    }
    if (p.includes('evaluations')) {
      return {
        title: 'Evaluaciones Clínicas & Quizzes',
        area: 'Rendimiento de Preguntas Médicas',
        summary: 'Tasa de inicio de test, abandono por paso clínico, síntomas visuales más comunes y diagnósticos completados.',
      }
    }
    if (p.includes('funnels')) {
      return {
        title: 'Embudos de Conversión (Funnels)',
        area: 'Pérdida & Fricción de Etapas',
        summary: 'Fuga paso a paso: Impresiones Meta ➔ Visitas ➔ Inicios Quiz ➔ Respuestas ➔ Citas WhatsApp ➔ Venta Local.',
      }
    }
    if (p.includes('appointments')) {
      return {
        title: 'Citas Médicas & Consultorio',
        area: 'Agendamiento & Asistencia',
        summary: 'Citas generadas desde WhatsApp, tasa de confirmación de secretaría y pacientes agendados en Matriz Guayaquil.',
      }
    }
    if (p.includes('followup')) {
      return {
        title: 'Seguimiento & CRM WhatsApp',
        area: 'Comunicaciones & Madeline',
        summary: 'Mensajes enviados a prospectos, tiempos de respuesta (< 5 min) y recuperación de leads que dejaron en visto.',
      }
    }
    if (p.includes('sales')) {
      return {
        title: 'Ventas de Lentes & Facturación',
        area: 'Caja, Pedidos & Ticket Promedio',
        summary: 'Ventas efectivas de monturas, lunas progresivas digitales FreeForm y filtro luz azul, con ingresos netos.',
      }
    }
    if (p.includes('leads') || p.includes('visitors')) {
      return {
        title: 'Pacientes, Leads & Visitantes',
        area: 'Base de Datos de Contactos',
        summary: 'Detalle de nombres, teléfonos y síntomas de cada persona que completó o inició la evaluación visual.',
      }
    }

    return {
      title: 'Módulo del Sistema Pulso',
      area: 'Analítica General',
      summary: 'Analítica de rendimiento y conversión de salud visual.',
    }
  })

  const snapshot = computed<ScreenContextSnapshot>(() => {
    const f = filtered.value
    return {
      path: route?.path || '/analytics',
      routeName: String(route?.name || 'analytics'),
      pageTitle: pageDetails.value.title,
      pageArea: pageDetails.value.area,
      summary: pageDetails.value.summary,
      activeFilters: {
        days: f?.filters?.days || 30,
        business: f?.filters?.business || 'all',
        source: f?.filters?.source || 'all',
        campaign: f?.filters?.campaign || 'all',
      },
      visibleKpis: {
        sessions: f?.sessions?.length || 0,
        visitors: f?.visitors?.length || 0,
        appointments: f?.appointments?.length || 0,
        sales: f?.sales?.length || 0,
        adSpend: f?.adSpend || 0,
      },
      focusedItem: focusedItem.value,
    }
  })

  function setFocusedItem(item: { type?: string; id?: string; label?: string; metadata?: Record<string, any> } | null) {
    focusedItem.value = item
  }

  return {
    snapshot,
    pageDetails,
    focusedItem,
    setFocusedItem,
  }
}
