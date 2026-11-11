<template>
  <PageHeader
    code="06 // HEATMAPS"
    title="Mapas de calor e interacción visual"
    description="Zonas con mayor y menor actividad por página, dispositivo y segmento. Los mapas son agregaciones de coordenadas, no grabaciones de pantalla ni captura de datos personales."
  >
    <template #actions>
      <span class="badge badge-cyan text-[9px]">COORDENADAS AGREGADAS</span>
    </template>

    <!-- Selector de página / segmento -->
    <div class="hud-card mb-4 py-3">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-wider mr-1">Página:</span>
          <button
            v-for="p in pages"
            :key="p.path"
            @click="page = p.path"
            class="px-2.5 py-1 rounded text-[9px] font-mono border transition-all"
            :class="page === p.path ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40' : 'text-slate-400 border-pulso-border/60 hover:text-slate-200'"
          >
            {{ p.label }}
          </button>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <button
              v-for="d in devices"
              :key="d.value"
              @click="device = d.value"
              class="px-2 py-1 rounded text-[9px] font-mono border"
              :class="device === d.value ? 'bg-violet-500/15 text-violet-300 border-violet-500/40' : 'text-slate-500 border-transparent hover:text-slate-300'"
            >
              {{ d.label }}
            </button>
          </div>
          <select v-model="segment" class="bg-pulso-void border border-pulso-border rounded-lg px-2 py-1.5 text-[9px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400">
            <option value="all">Todos los visitantes</option>
            <option value="buyers">Compradores</option>
            <option value="nonbuyers">No compradores</option>
            <option value="mobile">Móvil</option>
            <option value="desktop">Escritorio</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2.5 mb-4">
      <StatCard label="Clics en página" :value="clickPoints.length" icon="🖱️" />
      <StatCard label="Sesiones con clic" :value="`${clickRate}%`" icon="👆" tone="cyan" note="De las visitas a la página" />
      <StatCard label="Scroll medio" :value="`${avgScroll}%`" icon="📜" tone="green" note="Profundidad alcanzada" />
      <StatCard label="Tiempo medio" :value="`${avgSeconds}s`" icon="⏱️" note="Permanencia en la página" />
      <StatCard label="Interacción repetida" :value="`${repeatRate}%`" icon="🔁" tone="amber" note="Más de un clic igual" />
      <StatCard label="Clics compradores" :value="buyerClicks" icon="💳" tone="green" note="Segmento con compra" />
      <StatCard label="Clics no compradores" :value="nonBuyerClicks" icon="👤" tone="slate" note="Sin compra registrada" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">
            Mapa de clics · {{ pageLabel }}
          </h3>
          <span class="text-[9px] font-mono text-slate-500">{{ clickPoints.length }} PUNTOS</span>
        </div>
        <HeatmapPanel :points="clickPoints" :subtitle="`Clics agregados · ${pageLabel}`" :height="320" />
      </div>

      <div class="hud-card">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Distribución de scroll</h3>
          <span class="badge badge-cyan text-[8px]">PROFUNDIDAD</span>
        </div>
        <div class="space-y-2.5 mt-3">
          <div v-for="b in scrollBuckets" :key="b.label">
            <div class="flex items-center justify-between text-[9px] font-mono mb-1">
              <span class="text-slate-400">{{ b.label }}</span>
              <span class="text-slate-300">{{ b.count }} sesiones · {{ b.pct }}%</span>
            </div>
            <div class="h-2 rounded bg-pulso-void overflow-hidden">
              <div class="h-full rounded bg-gradient-to-r from-cyan-600 to-cyan-400" :style="{ width: `${b.pct}%` }"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-2.5 rounded-lg bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
          Si la mayoría se detiene antes del 50%, el contenido inferior podría no estar siendo visto. No confundir con falta de interés sin revisar la longitud de la página.
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Compradores · mapa de clics
        </h3>
        <HeatmapPanel :points="buyerPoints" subtitle="Segmento compradores" :height="220" />
      </div>
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          No compradores · mapa de clics
        </h3>
        <HeatmapPanel :points="nonBuyerPoints" subtitle="Segmento no compradores" :height="220" />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="hud-card xl:col-span-2">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Elementos más clicados · {{ pageLabel }}
        </h3>
        <DataTable :columns="elementColumns" :rows="elements" row-key="label">
          <template #cell-label="{ row }">
            <span class="text-slate-200">{{ row.label }}</span>
          </template>
          <template #cell-share="{ row }">
            <div class="flex items-center justify-end gap-2">
              <div class="w-20 h-1.5 rounded bg-pulso-void overflow-hidden">
                <div class="h-full bg-amber-400" :style="{ width: `${row.share}%` }"></div>
              </div>
              <span class="text-amber-300">{{ row.share }}%</span>
            </div>
          </template>
        </DataTable>
      </div>
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Lectura del mapa
        </h3>
        <div class="space-y-2">
          <div v-for="i in readings" :key="i.title" class="p-2.5 rounded-lg bg-pulso-void/50 border border-pulso-border/50">
            <p class="text-[10px] font-semibold" :class="i.tone">{{ i.title }}</p>
            <p class="text-[9px] font-mono text-slate-500 mt-0.5 leading-relaxed">{{ i.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import HeatmapPanel from '../components/HeatmapPanel.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { pathStats } from '../engine'

const { filtered, dataset } = useAnalytics()

const pages = computed(() => pathStats(filtered.value).map(p => ({ path: p.path, label: p.label })))
const page = ref('/')
watch(pages, val => {
  if (val.length && !val.some(p => p.path === page.value)) page.value = val[0].path
}, { immediate: true })

const devices = [
  { value: 'all', label: 'Todos' },
  { value: 'mobile', label: 'Móvil' },
  { value: 'desktop', label: 'Escritorio' },
] as const
const device = ref<'all' | 'mobile' | 'desktop'>('all')
const segment = ref<'all' | 'buyers' | 'nonbuyers' | 'mobile' | 'desktop'>('all')

const pageLabel = computed(() => pages.value.find(p => p.path === page.value)?.label || page.value)
const sessionMap = computed(() => new Map(filtered.value.sessions.map(s => [s.id, s])))

const scopedEvents = computed(() => filtered.value.events.filter(e => {
  if (e.page !== page.value) return false
  const s = sessionMap.value.get(e.session_id)
  if (!s) return false
  if (device.value !== 'all' && s.device !== device.value) return false
  if (segment.value === 'buyers' && !s.purchased) return false
  if (segment.value === 'nonbuyers' && s.purchased) return false
  if (segment.value === 'mobile' && s.device !== 'mobile') return false
  if (segment.value === 'desktop' && s.device !== 'desktop') return false
  return true
}))

const clickPoints = computed(() => scopedEvents.value
  .filter(e => e.type === 'click')
  .map(e => ({ x: Number(e.metadata?.x ?? 50), y: Number(e.metadata?.y ?? 50), weight: 1, label: e.label })))

const buyerPoints = computed(() => clickPointsFor(true))
const nonBuyerPoints = computed(() => clickPointsFor(false))

function clickPointsFor(buyer: boolean) {
  return filtered.value.events
    .filter(e => e.type === 'click' && e.page === page.value)
    .filter(e => sessionMap.value.get(e.session_id)?.purchased === buyer)
    .filter(e => device.value === 'all' || sessionMap.value.get(e.session_id)?.device === device.value)
    .map(e => ({ x: Number(e.metadata?.x ?? 50), y: Number(e.metadata?.y ?? 50), weight: 1, label: e.label }))
}

const pageSessions = computed(() => filtered.value.sessions.filter(s => {
  if (!s.pageviews.some(p => p.path === page.value)) return false
  if (device.value !== 'all' && s.device !== device.value) return false
  if (segment.value === 'buyers' && !s.purchased) return false
  if (segment.value === 'nonbuyers' && s.purchased) return false
  if (segment.value === 'mobile' && s.device !== 'mobile') return false
  if (segment.value === 'desktop' && s.device !== 'desktop') return false
  return true
}))

const clickRate = computed(() => pageSessions.value.length
  ? Math.round((pageSessions.value.filter(s => s.pageviews.find(p => p.path === page.value)?.clicks || 0).length / pageSessions.value.length) * 100)
  : 0)

const avgScroll = computed(() => {
  const vals = pageSessions.value.map(s => s.pageviews.find(p => p.path === page.value)?.scroll || 0)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
})
const avgSeconds = computed(() => {
  const vals = pageSessions.value.map(s => s.pageviews.find(p => p.path === page.value)?.seconds || 0)
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
})

const repeatRate = computed(() => {
  const counts = new Map<string, number>()
  scopedEvents.value.filter(e => e.type === 'click').forEach(e => counts.set(e.label, (counts.get(e.label) || 0) + 1))
  const repeated = [...counts.values()].filter(n => n > 1).length
  return counts.size ? Math.round((repeated / counts.size) * 100) : 0
})

const buyerClicks = computed(() => clickPointsFor(true).length)
const nonBuyerClicks = computed(() => clickPointsFor(false).length)

const scrollBuckets = computed(() => {
  const ranges = [[0, 25], [26, 50], [51, 75], [76, 100]]
  const total = pageSessions.value.length || 1
  return ranges.map(([min, max]) => {
    const count = pageSessions.value.filter(s => {
      const scroll = s.pageviews.find(p => p.path === page.value)?.scroll || 0
      return scroll >= min && scroll <= max
    }).length
    return { label: `${min}–${max}%`, count, pct: Math.round((count / total) * 100) }
  })
})

const elements = computed(() => {
  const map = new Map<string, number>()
  scopedEvents.value.filter(e => e.type === 'click').forEach(e => map.set(e.label, (map.get(e.label) || 0) + 1))
  const total = [...map.values()].reduce((a, b) => a + b, 0) || 1
  return [...map.entries()].map(([label, count]) => ({ label, count, share: Math.round((count / total) * 100) })).sort((a, b) => b.count - a.count)
})

const readings = computed(() => [
  {
    title: elements.value[0] ? `"${elements.value[0].label}" concentra la atención` : 'Sin clics en la página',
    text: elements.value[0] ? `${elements.value[0].count} clics (${elements.value[0].share}% del total). Es el elemento con mayor intención de interacción.` : 'Aún no hay clics registrados para este filtro.',
    tone: 'text-cyan-300',
  },
  {
    title: avgScroll.value < 50 ? 'Más de la mitad no llega al final' : 'Buen nivel de lectura',
    text: `Scroll medio de ${avgScroll.value}%. ${avgScroll.value < 50 ? 'Revisar si el contenido clave está en la parte superior.' : 'El contenido inferior también está siendo visto.'}`,
    tone: avgScroll.value < 50 ? 'text-amber-300' : 'text-emerald-300',
  },
  {
    title: buyerClicks.value > nonBuyerClicks.value ? 'Los compradores interactúan más' : 'Los no compradores interactúan más',
    text: `Compradores: ${buyerClicks.value} clics · No compradores: ${nonBuyerClicks.value}. Comparar zonas puede revelar qué elementos acompañan la decisión.`,
    tone: 'text-violet-300',
  },
])

const elementColumns: Column[] = [
  { key: 'label', label: 'Elemento' },
  { key: 'count', label: 'Clics', align: 'right' },
  { key: 'share', label: 'Participación', align: 'right' },
]
</script>
