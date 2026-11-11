<template>
  <div class="flex flex-col h-screen overflow-hidden bg-pulso-bg text-slate-200">
    <HudTopbar :current-client="currentClient" :current-quiz="currentQuiz" :active-users="filteredLeads.length" />

    <div class="flex flex-1 overflow-hidden">
      <SidebarNav :client="currentClient" :quiz="currentQuiz" />

      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-pulso-border/50">
          <div>
            <h2 class="text-xl font-tech font-bold text-slate-100 flex items-center gap-2">
              <span>CRM // GESTIÓN DE PROSPECTOS & CONVERSIONES</span>
              <span class="badge badge-cyan text-[10px]">{{ filteredLeads.length }} LEADS</span>
            </h2>
            <p class="text-xs font-mono text-slate-500 mt-0.5">
              Contactos generados por <span class="text-cyan-400 font-semibold">{{ currentClient.name }}</span> ({{ currentQuiz.name }})
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Filter Dropdown -->
            <select
              v-model="filterStatus"
              class="bg-pulso-card border border-pulso-border rounded-lg text-xs font-mono text-slate-200 px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="todos">TODOS LOS ESTADOS</option>
              <option value="Nuevo">🟢 NUEVOS</option>
              <option value="Contactado">🟡 CONTACTADOS</option>
              <option value="Agendado">🔵 AGENDADOS</option>
              <option value="Cerrado">🟣 CERRADOS</option>
            </select>

            <button @click="exportCSV" class="btn-hud-secondary text-xs">
              <span>📥</span> EXPORTAR CSV
            </button>
          </div>
        </div>

        <!-- CRM Table Card -->
        <div class="hud-card p-0 overflow-hidden">
          <LeadsTable :leads="filteredLeads" :compact="false" @update-status="updateLeadStatus" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePulsoData } from '@/composables/usePulsoData'
import type { Lead } from '@/types'
import HudTopbar from '@/components/HudTopbar.vue'
import SidebarNav from '@/components/SidebarNav.vue'
import LeadsTable from '@/components/LeadsTable.vue'

const route = useRoute()
const clientSlugParam = computed(() => (route.params.clientSlug as string) || '')
const quizSlugParam = computed(() => (route.params.quizSlug as string) || '')
const siteKeyParam = computed(() => (route.params.siteKey as string) || '')

const {
  leads: leadsList,
  currentClient,
  currentQuiz,
  clientSlug,
  quizSlug
} = usePulsoData(clientSlugParam.value || siteKeyParam.value, quizSlugParam.value)

const filterStatus = ref('todos')

const filteredLeads = computed(() => {
  if (filterStatus.value === 'todos') return leadsList.value
  return leadsList.value.filter(l => l.estado === filterStatus.value)
})

function updateLeadStatus(leadId: number, newStatus: Lead['estado']) {
  const lead = leadsList.value.find(l => l.id === leadId)
  if (lead) {
    lead.estado = newStatus
  }
}

function exportCSV() {
  const headers = ['ID', 'Nombre', 'Teléfono', 'Edad', 'Estado', 'Fuente', 'Fecha']
  const rows = filteredLeads.value.map(l => [
    l.id,
    `"${l.nombre || ''}"`,
    `"${l.telefono || ''}"`,
    l.edad || '',
    l.estado,
    l.utm_source || 'directo',
    l.created_at
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `leads_${clientSlug.value}_${quizSlug.value}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
