<template>
  <header class="h-14 flex-shrink-0 border-b border-pulso-border/80 bg-pulso-surface/90 backdrop-blur-md px-4 flex items-center justify-between gap-3 z-20">
    <div class="flex items-center gap-3 min-w-0">
      <!-- Business selector -->
      <div class="relative flex items-center">
        <select
          :value="filters.business"
          @change="onBusiness(($event.target as HTMLSelectElement).value)"
          class="bg-pulso-void border border-pulso-border/90 rounded-lg text-[11px] font-mono text-cyan-300 font-bold px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:border-cyan-400 cursor-pointer hover:border-cyan-500/50 transition-all"
        >
          <option value="all" class="bg-slate-900 text-slate-200">🌐 Todos los negocios</option>
          <option v-for="b in dataset.businesses" :key="b.id" :value="b.id" class="bg-slate-900 text-slate-200">
            {{ b.emoji }} {{ b.name }}
          </option>
        </select>
        <span class="absolute right-2 text-[9px] text-slate-500 pointer-events-none">▼</span>
      </div>

      <div class="hidden lg:flex items-center gap-2 text-[10px] font-mono">
        <span class="badge" :class="dataset.mode === 'live' ? 'badge-green' : 'badge-amber'">
          <span class="w-1.5 h-1.5 rounded-full" :class="dataset.mode === 'live' ? 'bg-emerald-400 live-pulse' : 'bg-amber-400'"></span>
          {{ dataset.mode === 'live' ? 'DATOS REALES' : 'MODO DEMO' }}
        </span>
        <span class="badge badge-cyan">SCHEMA {{ schema }}</span>
      </div>
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      <div class="hidden xl:flex items-center gap-3 text-[10px] font-mono text-slate-500 pr-2 border-r border-pulso-border/60">
        <span>ACTUALIZADO</span>
        <span class="text-slate-300">{{ updatedLabel }}</span>
      </div>
      <button
        @click="refresh"
        class="btn-hud-secondary text-[10px] py-1.5"
        :disabled="loading"
        title="Volver a consultar el esquema analytic_pulso"
      >
        <span :class="loading ? 'animate-spin inline-block' : ''">🔄</span>
        <span class="hidden sm:inline">{{ loading ? 'SINCRONIZANDO' : 'ACTUALIZAR' }}</span>
      </button>
      <RouterLink to="/analytics/settings" class="w-7 h-7 rounded-lg border border-pulso-border/80 bg-pulso-card flex items-center justify-center text-xs hover:border-cyan-500/40 transition-colors" title="Privacidad y configuración">
        🛡️
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAnalytics } from '../store'
import { analyticsSchema } from '../supabaseAnalytics'

const { dataset, filters, loading, init, setBusiness } = useAnalytics()
const schema = analyticsSchema
const ready = ref(false)

const updatedLabel = computed(() => {
  if (!ready.value) return '—'
  return new Date(dataset.value.generated_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
})
ready.value = true

function onBusiness(id: string) {
  setBusiness(id)
}

async function refresh() {
  await init(true)
}
</script>
