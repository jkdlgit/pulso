<template>
  <PageHeader
    code="22 // SETTINGS & PRIVACY"
    title="Privacidad, datos y configuración"
    description="Qué datos se recopilan, con qué finalidad, cuánto se conservan y cómo se protegen. La plataforma diferencia datos observados, declarados, registrados, importados, calculados e inferidos."
  >
    <template #actions>
      <span class="badge badge-green text-[9px]">ESQUEMA {{ schema }}</span>
      <span class="badge" :class="dataset.mode === 'live' ? 'badge-green' : 'badge-amber'">
        {{ dataset.mode === 'live' ? 'DATOS REALES' : 'MODO DEMO' }}
      </span>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 mb-4">
      <StatCard label="Negocios" :value="number(dataset.businesses.length)" icon="🏢" />
      <StatCard label="Tablas lógicas" :value="number(tables.length)" icon="🗄️" tone="cyan" />
      <StatCard label="Eventos" :value="number(dataset.events.length)" icon="📡" tone="violet" />
      <StatCard label="Visitantes" :value="number(dataset.visitors.length)" icon="👥" />
      <StatCard label="Vistas guardadas" :value="number(savedViews.length)" icon="💾" tone="amber" />
      <StatCard label="Retención" :value="retention" icon="⏳" tone="slate" note="Configurable" />
      <StatCard label="Datos sensibles" :value="`${sensitiveCount}`" icon="🔒" tone="rose" note="Salud visual" />
      <StatCard label="Consentimiento" :value="consent" icon="✅" :tone="consent === 'Registrado' ? 'green' : 'amber'" />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Clasificación de datos</h3>
          <span class="text-[9px] font-mono text-slate-500">ORIGEN Y RESTRICCIONES</span>
        </div>
        <div class="space-y-2">
          <div v-for="c in dataClasses" :key="c.type" class="p-2.5 rounded-lg border" :class="c.border">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ c.icon }}</span>
                <p class="text-[10px] font-bold" :class="c.tone">{{ c.type }}</p>
              </div>
              <span class="badge badge-muted text-[8px] py-0 px-1.5">{{ c.examples.length }} campos</span>
            </div>
            <p class="text-[9px] font-mono text-slate-400 mt-1 leading-relaxed">{{ c.description }}</p>
            <div class="flex items-center gap-1 flex-wrap mt-1.5">
              <span v-for="e in c.examples" :key="e" class="badge badge-muted text-[7px] py-0 px-1">{{ e }}</span>
            </div>
            <p class="text-[8px] font-mono text-slate-600 mt-1">🔒 {{ c.restriction }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Estado del consentimiento
          </h3>
          <div class="space-y-2">
            <div v-for="p in privacyStatus" :key="p.label" class="flex items-center justify-between text-[9px] font-mono p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
              <span class="text-slate-400">{{ p.label }}</span>
              <span :class="p.ok ? 'text-emerald-300' : 'text-amber-300'">{{ p.value }}</span>
            </div>
          </div>
        </div>

        <div class="hud-card">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
            Acceso al esquema
          </h3>
          <div class="space-y-1.5 text-[9px] font-mono">
            <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
              <span class="text-slate-400">Esquema</span>
              <span class="text-cyan-300">{{ schema }}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
              <span class="text-slate-400">Modo actual</span>
              <span :class="dataset.mode === 'live' ? 'text-emerald-300' : 'text-amber-300'">{{ dataset.mode === 'live' ? 'Live' : 'Demo' }}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
              <span class="text-slate-400">Variables</span>
              <span class="text-slate-300">VITE_ANALYTICS_SCHEMA</span>
            </div>
          </div>
          <p class="mt-2 text-[8px] font-mono text-slate-500 leading-relaxed">
            El acceso se realiza con clave pública (anon) y Row Level Security. El rol anónimo solo puede leer datos del negocio autorizado.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <div class="hud-card xl:col-span-2 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold">Catálogo de tablas</h3>
          <span class="text-[9px] font-mono text-slate-500">{{ tables.length }} TABLAS LÓGICAS</span>
        </div>
        <DataTable :columns="tableColumns" :rows="tables" row-key="name">
          <template #cell-name="{ row }">
            <span class="text-cyan-300 font-bold">{{ row.name }}</span>
          </template>
          <template #cell-retention="{ row }">
            <span class="text-slate-400">{{ row.retention }}</span>
          </template>
          <template #cell-classification="{ row }">
            <span class="badge text-[8px] py-0 px-1.5" :class="classBadge(row.classification)">{{ row.classification }}</span>
          </template>
        </DataTable>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
          Retención y eliminación
        </h3>
        <div class="space-y-2">
          <div v-for="r in retentionRules" :key="r.label" class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <div class="flex items-center justify-between text-[9px] font-mono">
              <span class="text-slate-300">{{ r.label }}</span>
              <span class="text-cyan-300 font-bold">{{ r.value }}</span>
            </div>
            <p class="text-[8px] font-mono text-slate-500 mt-0.5">{{ r.note }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Vistas guardadas
        </h3>
        <div v-if="savedViews.length" class="space-y-1.5">
          <div v-for="v in savedViews" :key="v.id" class="flex items-center gap-2 p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
            <div class="flex-1 min-w-0">
              <p class="text-[10px] font-mono text-slate-200 truncate">{{ v.name }}</p>
              <p class="text-[8px] font-mono text-slate-500">
                {{ v.filters.business === 'all' ? 'Todos' : v.filters.business }} · {{ v.filters.days }}d ·
                {{ v.filters.source === 'all' ? 'todas las fuentes' : v.filters.source }}
              </p>
            </div>
            <button @click="apply(v)" class="btn-hud-secondary text-[8px] py-1 px-2">APLICAR</button>
            <button @click="remove(v.id)" class="text-slate-600 hover:text-rose-400 text-[10px] px-1">✕</button>
          </div>
        </div>
        <p v-else class="py-6 text-center text-[10px] font-mono text-slate-500">
          Aún no hay vistas guardadas. Usa el botón «VISTAS» en los filtros globales.
        </p>
      </div>

      <div class="hud-card">
        <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold mb-3 pb-2 border-b border-pulso-border/50">
          Principios de recopilación
        </h3>
        <div class="space-y-2 text-[9px] font-mono text-slate-400 leading-relaxed">
          <p class="flex gap-2"><span class="text-emerald-400">✓</span> Transparencia sobre qué se recopila y para qué.</p>
          <p class="flex gap-2"><span class="text-emerald-400">✓</span> Finalidad definida para cada dato.</p>
          <p class="flex gap-2"><span class="text-emerald-400">✓</span> Consentimiento cuando sea necesario.</p>
          <p class="flex gap-2"><span class="text-emerald-400">✓</span> Minimización: solo lo necesario y autorizado.</p>
          <p class="flex gap-2"><span class="text-emerald-400">✓</span> Retención limitada y eliminación cuando corresponda.</p>
          <p class="flex gap-2"><span class="text-emerald-400">✓</span> Protección reforzada para datos de salud visual.</p>
          <p class="flex gap-2"><span class="text-rose-400">✕</span> Sin fingerprinting invasivo ni identificación encubierta.</p>
          <p class="flex gap-2"><span class="text-rose-400">✕</span> Sin envío de datos sensibles a plataformas publicitarias.</p>
          <p class="flex gap-2"><span class="text-rose-400">✕</span> La ubicación por IP se trata como aproximada, nunca GPS.</p>
        </div>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import DataTable, { type Column } from '../components/DataTable.vue'
import { useAnalytics } from '../store'
import { number } from '../engine'
import { analyticsSchema } from '../supabaseAnalytics'

const { dataset, savedViews, applyView, deleteView } = useAnalytics()
const schema = analyticsSchema

const retention = '90 días'
const consent = 'Registrado'
const sensitiveCount = computed(() => dataset.value.sessions.filter(s => s.quiz_started).length)

function apply(v: any) { applyView(v) }
function remove(id: string) { deleteView(id) }

const dataClasses = [
  {
    type: 'Observado', icon: '👁️', tone: 'text-cyan-300',
    description: 'Capturado automáticamente durante la navegación con consentimiento.',
    examples: ['page_view', 'click', 'scroll', 'tiempo activo'],
    restriction: 'No incluye contenido de campos sensibles ni pulsaciones de teclado.',
    border: 'bg-cyan-500/5 border-cyan-500/20',
  },
  {
    type: 'Declarado', icon: '✍️', tone: 'text-emerald-300',
    description: 'Información que la persona escribe voluntariamente.',
    examples: ['nombre', 'teléfono', 'email', 'respuestas de evaluación'],
    restriction: 'Finalidad declarada; datos de salud con acceso restringido.',
    border: 'bg-emerald-500/5 border-emerald-500/20',
  },
  {
    type: 'Registrado por el negocio', icon: '🏪', tone: 'text-violet-300',
    description: 'Anotado manualmente por el equipo durante la atención.',
    examples: ['cita', 'asistencia', 'cotización', 'venta', 'motivo de pérdida'],
    restriction: 'Solo personal autorizado; se conserva con fines comerciales y contables.',
    border: 'bg-violet-500/5 border-violet-500/20',
  },
  {
    type: 'Importado', icon: '📥', tone: 'text-amber-300',
    description: 'Recibido de plataformas publicitarias externas.',
    examples: ['inversión', 'impresiones', 'clics', 'campaña', 'anuncio'],
    restriction: 'Se distingue siempre de lo observado en el sitio.',
    border: 'bg-amber-500/5 border-amber-500/20',
  },
  {
    type: 'Calculado', icon: '🧮', tone: 'text-sky-300',
    description: 'Derivado matemáticamente de otros datos.',
    examples: ['conversión', 'CPL', 'ROAS', 'ticket medio', 'tiempo medio'],
    restriction: 'Reproducible y documentado; no se presenta como observación directa.',
    border: 'bg-sky-500/5 border-sky-500/20',
  },
  {
    type: 'Inferido / predicho', icon: '🧠', tone: 'text-rose-300',
    description: 'Estimación probabilística o atribución.',
    examples: ['probabilidad de compra', 'atribución', 'intención estimada'],
    restriction: 'Marcado como estimación; nunca se muestra como un hecho.',
    border: 'bg-rose-500/5 border-rose-500/20',
  },
]

const privacyStatus = computed(() => [
  { label: 'Consentimiento de analítica', value: hasConsent() ? 'Registrado' : 'Pendiente', ok: hasConsent() },
  { label: 'Datos de salud', value: 'Acceso restringido', ok: true },
  { label: 'Envío a plataformas', value: 'Bloqueado para datos sensibles', ok: true },
  { label: 'Ubicación', value: 'Aproximada por IP', ok: true },
  { label: 'Identificación entre dispositivos', value: 'Solo con evidencia', ok: true },
  { label: 'Anonimización', value: 'Identificador seudónimo', ok: true },
])

const hasConsent = () => dataset.value.mode === 'live'

const tables = computed(() => [
  { name: 'businesses', description: 'Negocios administrados', rows: dataset.value.businesses.length, retention: 'Permanente', classification: 'Configuración' },
  { name: 'campaigns', description: 'Campañas y anuncios', rows: dataset.value.campaigns.length, retention: '24 meses', classification: 'Importado' },
  { name: 'visitors (visitor_facts)', description: 'Identificador seudónimo y perfil', rows: dataset.value.visitors.length, retention: '90 días', classification: 'Observado' },
  { name: 'sessions (session_facts)', description: 'Sesiones y navegación', rows: dataset.value.sessions.length, retention: '90 días', classification: 'Observado' },
  { name: 'events', description: 'Eventos de interacción', rows: dataset.value.events.length, retention: '90 días', classification: 'Observado' },
  { name: 'quiz_answers', description: 'Respuestas de evaluación', rows: dataset.value.sessions.filter(s => s.quiz_started).length, retention: '90 días', classification: 'Sensible' },
  { name: 'form_fields', description: 'Interacción con formularios', rows: dataset.value.sessions.filter(s => s.form_started).length, retention: '90 días', classification: 'Declarado' },
  { name: 'appointments', description: 'Citas y asistencias', rows: dataset.value.appointments.length, retention: '24 meses', classification: 'Registrado' },
  { name: 'communications', description: 'Seguimiento comercial', rows: dataset.value.communications.length, retention: '24 meses', classification: 'Registrado' },
  { name: 'sales', description: 'Ventas y resultados', rows: dataset.value.sales.length, retention: '7 años (contable)', classification: 'Registrado' },
  { name: 'experiments', description: 'Pruebas A/B', rows: dataset.value.experiments.length, retention: 'Permanente', classification: 'Configuración' },
  { name: 'improvements', description: 'Seguimiento de mejoras', rows: dataset.value.improvements.length, retention: 'Permanente', classification: 'Configuración' },
  { name: 'saved_views', description: 'Filtros guardados', rows: savedViews.value.length, retention: 'Hasta eliminar', classification: 'Configuración' },
])

const retentionRules = [
  { label: 'Eventos de navegación', value: '90 días', note: 'Agregables después; el detalle individual se elimina.' },
  { label: 'Datos de formularios', value: '90 días', note: 'Salvo obligación legal o relación comercial activa.' },
  { label: 'Datos de salud visual', value: 'Acceso restringido', note: 'Cifrado y acceso limitado al personal autorizado.' },
  { label: 'Ventas y facturación', value: '7 años', note: 'Requisito contable y tributario.' },
  { label: 'Solicitudes de eliminación', value: '30 días', note: 'Plazo objetivo para anonimizar o eliminar.' },
]

function classBadge(c: string) {
  if (c === 'Sensible') return 'badge-rose'
  if (c === 'Observado') return 'badge-cyan'
  if (c === 'Declarado') return 'badge-green'
  if (c === 'Registrado') return 'badge-violet'
  if (c === 'Importado') return 'badge-amber'
  return 'badge-muted'
}

const tableColumns: Column[] = [
  { key: 'name', label: 'Tabla' },
  { key: 'description', label: 'Contenido' },
  { key: 'rows', label: 'Registros', align: 'right', format: r => number(r.rows) },
  { key: 'retention', label: 'Retención' },
  { key: 'classification', label: 'Clasificación' },
]
</script>
