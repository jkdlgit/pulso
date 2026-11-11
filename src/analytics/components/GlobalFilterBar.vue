<template>
  <div class="flex-shrink-0 border-b border-pulso-border/60 bg-pulso-bg/70 px-4 py-2 z-10">
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Período -->
      <div class="flex items-center gap-0.5 p-0.5 rounded-lg bg-pulso-void border border-pulso-border/80">
        <button
          v-for="d in [7, 14, 30, 90]"
          :key="d"
          @click="filters.days = d as any"
          class="px-2.5 py-1 rounded text-[10px] font-mono transition-all"
          :class="filters.days === d ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200 border border-transparent'"
        >
          {{ d }}D
        </button>
      </div>

      <span class="text-slate-700 text-[10px] hidden sm:inline">|</span>

      <select v-model="filters.source" class="filter-select" title="Fuente de adquisición">
        <option value="all">Fuente: todas</option>
        <option v-for="s in sourceOptions" :key="s" :value="s">{{ sourceLabel(s) }}</option>
      </select>

      <select v-model="filters.campaign" class="filter-select max-w-[190px]" title="Campaña" @change="onCampaign">
        <option value="all">Campaña: todas</option>
        <option v-for="c in campaignsForFilter" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <select v-model="filters.device" class="filter-select" title="Dispositivo">
        <option value="all">Dispositivo: todos</option>
        <option value="mobile">Móvil</option>
        <option value="desktop">Escritorio</option>
        <option value="tablet">Tablet</option>
      </select>

      <select v-model="filters.visitor" class="filter-select" title="Tipo de visitante">
        <option value="all">Visitante: todos</option>
        <option value="new">Nuevos</option>
        <option value="returning">Recurrentes</option>
      </select>

      <select v-model="filters.buyer" class="filter-select" title="Resultado comercial">
        <option value="all">Compra: todos</option>
        <option value="buyers">Compradores</option>
        <option value="nonbuyers">No compradores</option>
      </select>

      <label class="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 cursor-pointer px-1 select-none">
        <input v-model="filters.compare" type="checkbox" class="accent-cyan-400 w-3 h-3" />
        <span>Comparar</span>
      </label>

      <div class="flex-1"></div>

      <button @click="resetFilters" class="btn-hud-secondary text-[10px] py-1.5" title="Restablecer filtros">
        ↺ <span class="hidden sm:inline">RESET</span>
      </button>

      <div class="relative">
        <button @click="panel = !panel" class="btn-hud-secondary text-[10px] py-1.5" :class="panel ? 'border-cyan-500/50 text-cyan-300' : ''">
          💾 <span class="hidden sm:inline">VISTAS</span>
          <span class="text-[8px] text-slate-500">{{ savedViews.length }}</span>
        </button>

        <div v-if="panel" class="absolute right-0 top-9 w-72 bg-pulso-surface border border-pulso-border rounded-xl shadow-hud p-3 z-50">
          <p class="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">// Vistas guardadas</p>
          <div class="max-h-40 overflow-y-auto space-y-1 mb-2">
            <div v-if="savedViews.length === 0" class="text-[10px] font-mono text-slate-600 py-2">
              Aún no has guardado combinaciones de filtros.
            </div>
            <div
              v-for="v in savedViews"
              :key="v.id"
              class="flex items-center gap-1 group"
            >
              <button
                @click="apply(v)"
                class="flex-1 text-left px-2 py-1.5 rounded border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 text-[10px] font-mono text-slate-300 truncate"
              >
                {{ v.name }}
                <span class="text-[8px] text-slate-600 ml-1">{{ v.filters.days }}d</span>
              </button>
              <button @click="remove(v.id)" class="text-slate-600 hover:text-rose-400 text-[10px] px-1" title="Eliminar">✕</button>
            </div>
          </div>
          <div class="flex items-center gap-1.5 pt-2 border-t border-pulso-border/60">
            <input
              v-model="viewName"
              placeholder="Nombre de la vista..."
              class="flex-1 bg-pulso-void border border-pulso-border rounded px-2 py-1.5 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              @keyup.enter="save"
            />
            <button @click="save" class="btn-hud text-[9px] py-1.5 px-2">GUARDAR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { sourceLabel } from '../demo'
import { useAnalytics } from '../store'
import type { SavedView } from '../types'

const { dataset, filters, campaignsForFilter, savedViews, resetFilters, saveView, applyView, deleteView } = useAnalytics()
const panel = ref(false)
const viewName = ref('')

const sourceOptions = computed(() =>
  [...new Set(dataset.value.sessions.map(s => s.source))].sort()
)

function onCampaign() {
  if (filters.campaign === 'all' || filters.business !== 'all') return
  const c = dataset.value.campaigns.find(x => x.id === filters.campaign)
  if (c) filters.business = c.business_id
}

function save() {
  saveView(viewName.value)
  viewName.value = ''
}

function apply(v: SavedView) {
  applyView(v)
  panel.value = false
}

function remove(id: string) {
  deleteView(id)
}
</script>

<style scoped>
.filter-select {
  @apply bg-pulso-void border border-pulso-border/80 rounded-lg text-[10px] font-mono text-slate-300 px-2 py-1.5 appearance-none cursor-pointer hover:border-cyan-500/40 focus:outline-none focus:border-cyan-400 transition-colors;
}
</style>
