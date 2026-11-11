<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-xs font-mono">
      <thead>
        <tr class="border-b border-pulso-border/90 bg-pulso-void/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
          <th class="py-3 px-4">PROSPECTO</th>
          <th class="py-3 px-4">TELÉFONO (WA)</th>
          <th class="py-3 px-4" v-if="!compact">EDAD</th>
          <th class="py-3 px-4">ESTADO CRM</th>
          <th class="py-3 px-4">FUENTE UTM</th>
          <th class="py-3 px-4">FECHA / HORA</th>
          <th class="py-3 px-4 text-right">ACCIÓN</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-pulso-border/40">
        <tr
          v-for="lead in leads"
          :key="lead.id"
          class="hover:bg-cyan-500/5 transition-colors group"
        >
          <!-- Nombre -->
          <td class="py-3 px-4">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-pulso-surface border border-pulso-border flex items-center justify-center text-[10px] font-bold text-cyan-300 shadow-sm">
                {{ getInitials(lead.nombre) }}
              </div>
              <div>
                <p class="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {{ lead.nombre || 'Sin nombre' }}
                </p>
                <p class="text-[10px] text-slate-500" v-if="lead.email">{{ lead.email }}</p>
              </div>
            </div>
          </td>

          <!-- Teléfono -->
          <td class="py-3 px-4 text-slate-300">
            {{ lead.telefono || '—' }}
          </td>

          <!-- Edad -->
          <td class="py-3 px-4 text-slate-400" v-if="!compact">
            {{ lead.edad ? `${lead.edad} a` : '—' }}
          </td>

          <!-- Estado -->
          <td class="py-3 px-4">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="badge" :class="statusClass(lead.estado)">
                {{ lead.estado }}
              </span>
              <span v-if="lead.estado_cita === 'Atendida'" class="badge badge-cyan text-[9px] py-0 px-1.5 font-mono" title="Cita atendida en /dashboard Oculus">
                📍 ATENDIDA
              </span>
            </div>
          </td>

          <!-- Fuente UTM -->
          <td class="py-3 px-4">
            <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <span class="w-1.5 h-1.5 rounded-full" :class="utmDotClass(lead.utm_source)"></span>
              {{ lead.utm_source || 'directo' }}
            </span>
          </td>

          <!-- Fecha -->
          <td class="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
            {{ formatDate(lead.created_at) }}
          </td>

          <!-- Acción WhatsApp y Llegada -->
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                v-if="lead.estado_cita !== 'Atendida'"
                @click="marcarLlegada(lead)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-semibold text-[11px] transition-all shadow-sm"
                title="Registrar que el cliente llegó presencialmente al local"
              >
                <span>📍</span> Marcar Llegada
              </button>
              <span v-else class="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                <span>✓</span> En Local
              </span>

              <a
                v-if="lead.telefono"
                :href="whatsappUrl(lead.telefono, lead.nombre)"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white font-medium text-[11px] transition-all"
              >
                <span>💬</span> WhatsApp
              </a>
              <span v-else class="text-slate-600">—</span>
            </div>
          </td>
        </tr>

        <tr v-if="leads.length === 0">
          <td colspan="7" class="py-12 text-center text-slate-500 font-mono">
            <div class="w-10 h-10 rounded-lg bg-pulso-surface border border-pulso-border flex items-center justify-center text-lg mx-auto mb-2 text-cyan-400">
              👥
            </div>
            <p class="text-xs font-semibold text-slate-300">TABLA LIMPIA // SIN LEADS REGISTRADOS</p>
            <p class="text-[10px] text-slate-500 mt-1">Completa el formulario en /quiz2 para ver el registro en vivo.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Lead } from '@/types'
import { supabase, hasSupabaseConfig } from '@/supabase'

const props = defineProps<{
  leads: Lead[]
  compact?: boolean
}>()

const emit = defineEmits<{
  'update-status': [id: number, status: Lead['estado']]
}>()

async function marcarLlegada(lead: Lead) {
  if (!hasSupabaseConfig) return
  try {
    const { error } = await supabase
      .from('leads')
      .update({ estado_cita: 'Atendida', estado: 'Atendido' })
      .eq('id', lead.id)
    if (!error) {
      lead.estado_cita = 'Atendida'
      lead.estado = 'Atendido'
    }
  } catch (e) {
    console.error('[PULSO] Error al marcar llegada:', e)
  }
}

function onStatusChange(id: number, event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update-status', id, target.value as Lead['estado'])
}

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

function statusClass(status: Lead['estado']) {
  const map: Record<string, string> = {
    Nuevo: 'badge-green',
    Contactado: 'badge-amber',
    Agendado: 'badge-cyan',
    Cerrado: 'badge-green',
    Descartado: 'badge-rose'
  }
  return map[status] || 'badge-muted'
}

function utmDotClass(utm?: string) {
  if (!utm) return 'bg-slate-500'
  const lower = utm.toLowerCase()
  if (lower.includes('instagram')) return 'bg-fuchsia-400'
  if (lower.includes('facebook')) return 'bg-blue-400'
  if (lower.includes('google')) return 'bg-amber-400'
  if (lower.includes('tiktok')) return 'bg-cyan-400'
  return 'bg-slate-400'
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleString('es-EC', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function whatsappUrl(phone: string, name?: string) {
  const cleanPhone = phone.replace(/\D/g, '')
  const formatted = cleanPhone.startsWith('09') ? `593${cleanPhone.slice(1)}` : cleanPhone
  const greeting = name ? `Hola ${name}, te saludamos de parte de tu chequeo visual...` : 'Hola, te escribimos...'
  return `https://wa.me/${formatted}?text=${encodeURIComponent(greeting)}`
}
</script>
