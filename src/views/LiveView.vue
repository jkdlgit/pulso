<template>
  <div class="flex flex-col h-screen overflow-hidden bg-pulso-bg text-slate-200">
    <HudTopbar :current-client="currentClient" :current-quiz="currentQuiz" :active-users="kpi.activeNow" />

    <div class="flex flex-1 overflow-hidden">
      <SidebarNav :client="currentClient" :quiz="currentQuiz" />

      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Header Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-pulso-border/50">
          <div>
            <h2 class="text-xl font-tech font-bold text-slate-100 flex items-center gap-2">
              <span>TELEMETRÍA // FLUJO DE PAQUETES DE EVENTOS</span>
              <span class="badge badge-green text-[10px]">EN VIVO</span>
            </h2>
            <p class="text-xs font-mono text-slate-500 mt-0.5">
              Captura e inspección de eventos en tiempo real para 
              <span class="text-cyan-400 font-semibold">{{ currentClient.name }}</span> —
              <span class="text-emerald-400 font-semibold">{{ currentQuiz.name }}</span>
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button @click="clearEvents" class="btn-hud-secondary text-[11px]">
              LIMPIAR BUFFER
            </button>
            <button @click="refreshLeads" class="btn-hud text-[11px]">
              🔄 ACTUALIZAR
            </button>
          </div>
        </div>

        <!-- Packet Flow Console -->
        <div class="hud-card p-0 overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-12 gap-2 px-4 py-3 bg-pulso-void border-b border-pulso-border text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            <div class="col-span-1">NO.</div>
            <div class="col-span-2">TIMESTAMP</div>
            <div class="col-span-2">ORIGEN / PAÍS</div>
            <div class="col-span-2">TIPO EVENTO</div>
            <div class="col-span-3">PAYLOAD / DETALLE</div>
            <div class="col-span-1">CANAL</div>
            <div class="col-span-1 text-right">DISP.</div>
          </div>

          <!-- Packet rows -->
          <div v-if="events.length > 0" class="divide-y divide-pulso-border/30 max-h-[600px] overflow-y-auto">
            <div
              v-for="(event, idx) in events"
              :key="event.id"
              class="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs font-mono items-center hover:bg-cyan-500/5 transition-all group"
            >
              <!-- Index Number Badge -->
              <div class="col-span-1">
                <span class="w-6 h-6 rounded-full bg-pulso-surface border border-pulso-border flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                  {{ events.length - idx }}
                </span>
              </div>

              <!-- Timestamp -->
              <div class="col-span-2 text-slate-400 text-[11px]">
                {{ formatTime(event.created_at) }}
              </div>

              <!-- Source / Country -->
              <div class="col-span-2 text-slate-300 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{{ event.country === 'EC' ? 'Ecuador' : 'Colombia' }}</span>
              </div>

              <!-- Event Type Badge -->
              <div class="col-span-2">
                <span class="badge" :class="eventBadgeClass(event.event_type)">
                  {{ event.event_name }}
                </span>
              </div>

              <!-- Detail / Metadata -->
              <div class="col-span-3 text-slate-400 text-[11px] truncate">
                {{ event.metadata ? JSON.stringify(event.metadata) : 'telemetry_ack: ok' }}
              </div>

              <!-- UTM Source -->
              <div class="col-span-1 text-slate-400 text-[11px]">
                {{ event.utm_source || 'directo' }}
              </div>

              <!-- Device Icon -->
              <div class="col-span-1 text-right text-slate-400 text-sm">
                {{ deviceIcon(event.device) }}
              </div>
            </div>
          </div>

          <!-- Estado Vacío Cuando no hay eventos -->
          <div v-else class="p-12 text-center font-mono">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl mx-auto mb-3">
              📡
            </div>
            <p class="text-sm text-slate-300 font-semibold mb-1">ESPERANDO TELEMETRÍA EN VIVO</p>
            <p class="text-xs text-slate-500 max-w-md mx-auto">
              Aún no se han recibido eventos para este sitio. Al interactuar en 
              <span class="text-cyan-300 font-mono">/quiz2</span>, los eventos aparecerán aquí automáticamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePulsoData } from '@/composables/usePulsoData'
import HudTopbar from '@/components/HudTopbar.vue'
import SidebarNav from '@/components/SidebarNav.vue'

const route = useRoute()
const clientSlugParam = computed(() => (route.params.clientSlug as string) || '')
const quizSlugParam = computed(() => (route.params.quizSlug as string) || '')
const siteKeyParam = computed(() => (route.params.siteKey as string) || '')

// Conectar con datos telemétricos reales (sin simulaciones falsas)
const {
  events,
  kpi,
  refreshLeads,
  currentClient,
  currentQuiz,
  clientSlug,
  quizSlug
} = usePulsoData(clientSlugParam.value || siteKeyParam.value, quizSlugParam.value)

function clearEvents() {
  events.value = []
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function eventBadgeClass(type: string) {
  const map: Record<string, string> = {
    pageview: 'badge-cyan',
    step_complete: 'badge-muted',
    lead: 'badge-amber',
    conversion: 'badge-green',
    exit: 'badge-rose'
  }
  return map[type] ?? 'badge-muted'
}

function deviceIcon(device?: string) {
  return device === 'mobile' ? '📱' : device === 'desktop' ? '💻' : '📟'
}
</script>
