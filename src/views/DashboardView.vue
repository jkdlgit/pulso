<template>
  <div class="flex flex-col h-screen overflow-hidden bg-pulso-bg text-slate-200">
    <!-- Top HUD Bar -->
    <HudTopbar :current-client="currentClient" :current-quiz="currentQuiz" :active-users="kpi.activeNow" />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Navigation -->
      <SidebarNav :client="currentClient" :quiz="currentQuiz" />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Breadcrumb / Section Header -->
        <div class="flex items-center justify-between pb-1 border-b border-pulso-border/40">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>PROYECTOS</span>
              <span>/</span>
              <span class="text-cyan-400 font-bold uppercase">{{ currentClient.name }}</span>
              <span>/</span>
              <span class="text-emerald-400 font-bold uppercase">{{ currentQuiz.name }}</span>
            </div>
            <h2 class="text-xl font-tech font-bold tracking-wide text-slate-100 flex items-center gap-2">
              <span>PANEL DE CONTROL // ANALYTICS</span>
              <span class="badge badge-cyan text-[10px]">TIEMPO REAL</span>
            </h2>
          </div>

          <div class="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span class="text-slate-500">// CANAL:</span>
            <span class="text-cyan-300 font-semibold">{{ clientSlug }}/{{ quizSlug }}</span>
          </div>
        </div>

        <!-- KPI Instrumentation Cards: Etapas Estandarizadas Pulso -->
        <div class="space-y-3">
          <!-- 6 Etapas Activas -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <KpiCard
              label="Visitas"
              :value="kpi.visitas"
              icon="👁️"
              note="Cargaron la URL"
            />
            <KpiCard
              label="Paso 1"
              :value="kpi.paso1"
              icon="1️⃣"
              note="Avanzaron paso 1"
            />
            <KpiCard
              label="Paso 2"
              :value="kpi.paso2"
              icon="2️⃣"
              note="Avanzaron paso 2"
            />
            <KpiCard
              label="Paso 3"
              :value="kpi.paso3"
              icon="3️⃣"
              note="Avanzaron paso 3"
            />
            <KpiCard
              label="Completados"
              :value="kpi.completados"
              icon="✅"
              color="green"
              note="Terminaron el quiz"
            />
            <KpiCard
              label="Reservas"
              :value="kpi.reservas"
              icon="📅"
              color="accent"
              note="Cita / WhatsApp"
            />
          </div>

          <!-- 3 Etapas del Sistema Local / Dashboard Oculus -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KpiCard
              label="Llegaron al Local"
              :value="kpi.llegaron"
              icon="📍"
              color="accent"
              :paused="!hasLocalCrm"
              :note="hasLocalCrm ? 'Sincronizado con /dashboard Oculus (estado_cita: Atendida)' : 'Requiere integración de sistema local'"
            />
            <KpiCard
              label="Nº de Ventas"
              :value="kpi.ventasCount"
              icon="💳"
              color="green"
              :paused="!hasLocalCrm"
              :note="hasLocalCrm ? 'Pedidos pagados en sistema de clínica' : 'Requiere integración de ventas/POS'"
            />
            <KpiCard
              label="Ingresos Facturados"
              :value="formatCurrency(kpi.ingresosTotal)"
              icon="💵"
              color="green"
              :paused="!hasLocalCrm"
              :note="hasLocalCrm ? 'Total facturado en pedidos completados' : 'Requiere integración de facturación'"
            />
          </div>
        </div>

        <!-- Central Interactive Flow / Topology Component -->
        <NetworkTopology :site-key="`${clientSlug}_${quizSlug}`" :leads-count="leads.length" />

        <!-- Analytics Grid: Visits & Sources -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Visits Timeline Chart -->
          <div class="hud-card lg:col-span-2">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-pulso-border/50">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">
                  Evolución Diaria de Tráfico y Conversiones
                </h3>
              </div>
              <span class="badge badge-muted text-[10px]">8 DÍAS</span>
            </div>
            <VisitsChart :data="dailyData" />
          </div>

          <!-- Traffic Sources Meter -->
          <div class="hud-card">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-pulso-border/50">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
                <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">
                  Canales de Adquisición (UTM)
                </h3>
              </div>
              <span class="text-[10px] font-mono text-cyan-400">DISTRIBUCIÓN</span>
            </div>
            <SourcesChart :data="sources" />
          </div>
        </div>

        <!-- Funnel Section -->
        <div class="hud-card">
          <div class="flex items-center justify-between mb-5 pb-2 border-b border-pulso-border/50">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">
                Embudo de Conversión por Etapas (Funnel)
              </h3>
            </div>
            <span class="text-xs font-mono text-slate-400">TASA GLOBAL: <strong class="text-cyan-300">{{ globalConversionRate }}</strong></span>
          </div>
          <FunnelChart :steps="funnelData" />
        </div>

        <!-- Recent Leads Section -->
        <div class="hud-card">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-pulso-border/50">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
              <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">
                Últimos Prospectos Registrados (CRM)
              </h3>
            </div>
            <RouterLink :to="`/${clientSlug}/${quizSlug}/leads`" class="btn-hud-secondary text-[11px]">
              VER TODOS LOS PROSPECTOS →
            </RouterLink>
          </div>
          <LeadsTable :leads="recentLeads" compact />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { usePulsoData } from '@/composables/usePulsoData'
import HudTopbar from '@/components/HudTopbar.vue'
import SidebarNav from '@/components/SidebarNav.vue'
import KpiCard from '@/components/KpiCard.vue'
import NetworkTopology from '@/components/NetworkTopology.vue'
import VisitsChart from '@/components/VisitsChart.vue'
import SourcesChart from '@/components/SourcesChart.vue'
import FunnelChart from '@/components/FunnelChart.vue'
import LeadsTable from '@/components/LeadsTable.vue'

const route = useRoute()
const clientSlugParam = computed(() => (route.params.clientSlug as string) || '')
const quizSlugParam = computed(() => (route.params.quizSlug as string) || '')
const siteKeyParam = computed(() => (route.params.siteKey as string) || '')

const {
  kpi,
  dailyData,
  sources,
  funnelData,
  leads,
  hasLocalCrm,
  currentClient,
  currentQuiz,
  clientSlug,
  quizSlug,
} = usePulsoData(clientSlugParam.value || siteKeyParam.value, quizSlugParam.value)

const recentLeads = computed(() => leads.value.slice(0, 5))

function formatCurrency(val: number): string {
  return `$ ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const globalConversionRate = computed(() => {
  if (kpi.value.visitas <= 0) return '0.0%'
  if (hasLocalCrm.value && kpi.value.ventasCount > 0) {
    return ((kpi.value.ventasCount / kpi.value.visitas) * 100).toFixed(1) + '%'
  }
  return ((kpi.value.reservas / kpi.value.visitas) * 100).toFixed(1) + '%'
})
</script>
