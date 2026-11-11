<template>
  <div class="min-h-screen bg-pulso-bg text-slate-200 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
    <!-- Background Tech Glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full"></div>

    <!-- Header / Brand HUD -->
    <div class="max-w-5xl mx-auto w-full">
      <div class="flex items-center justify-between pb-6 border-b border-pulso-border/70 mb-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-xl text-cyan-300 shadow-glow-cyan">
            📡
          </div>
          <div>
            <h1 class="text-2xl font-tech font-bold tracking-widest text-slate-100 flex items-center gap-2">
              <span>PULSO</span>
              <span class="text-cyan-400 font-mono text-xs font-normal">[MULTI-TENANT ENGINE]</span>
            </h1>
            <p class="text-xs font-mono text-slate-400">TELEMETRÍA & ANALYTICS EN TIEMPO REAL // GESTIÓN DE CLIENTES Y QUIZZES</p>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
            <span>TELEMETRÍA: ACTIVA (ONLINE)</span>
          </div>
        </div>
      </div>

      <!-- Instruction / Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <p class="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">// SELECCIONAR CLIENTE & QUIZ</p>
          <h2 class="text-lg font-tech font-bold text-slate-200">Clientes & Plataformas Conectadas</h2>
        </div>
        <span class="text-xs font-mono text-slate-500 hidden sm:inline">SELECCIONA UN CLIENTE O QUIZ ESPECÍFICO</span>
      </div>

      <!-- Clients Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div
          v-for="client in clientsList"
          :key="client.slug"
          class="hud-card p-5 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300"
        >
          <!-- Top Row: Client Info -->
          <div>
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-pulso-surface border border-pulso-border flex items-center justify-center text-2xl group-hover:border-cyan-500/50 transition-colors shadow-sm">
                  {{ client.emoji }}
                </div>
                <div>
                  <h3 class="font-tech text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {{ client.name }}
                  </h3>
                  <p class="text-xs font-mono text-slate-400">
                    {{ client.industry }}
                  </p>
                </div>
              </div>

              <!-- Local CRM / System status -->
              <span
                class="badge text-[10px]"
                :class="client.has_local_crm ? 'badge-green' : 'badge-muted'"
              >
                {{ client.has_local_crm ? 'CRM OCULUS' : 'WEB TRACKER' }}
              </span>
            </div>

            <div class="text-[11px] font-mono text-slate-400 mb-4 bg-pulso-void/60 p-2.5 rounded-lg border border-pulso-border/60">
              <span class="text-slate-500">CLIENTE ID:</span> <code class="text-cyan-300 font-bold">/{{ client.slug }}</code>
              <span class="mx-2 text-slate-700">·</span>
              <span class="text-slate-500">QUIZZES:</span> <span class="text-slate-200 font-bold">{{ client.quizzes.length }}</span>
            </div>

            <!-- List of Quizzes for this Client -->
            <div class="space-y-2 mb-4">
              <p class="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                // QUIZZES DISPONIBLES:
              </p>

              <div class="grid grid-cols-1 gap-2">
                <RouterLink
                  v-for="quiz in client.quizzes"
                  :key="quiz.quiz_key"
                  :to="`/${client.slug}/${quiz.quiz_key}`"
                  class="flex items-center justify-between p-2.5 rounded-lg bg-pulso-surface/80 hover:bg-cyan-500/10 border border-pulso-border hover:border-cyan-500/40 transition-all text-xs font-mono group/quiz"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-sm">{{ quiz.quiz_key === 'quiz2' ? '🧪' : '👁️' }}</span>
                    <span class="text-slate-200 font-semibold group-hover/quiz:text-cyan-300 transition-colors truncate">
                      {{ quiz.name }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-[10px] text-slate-500 font-mono">/{{ quiz.quiz_key }}</span>
                    <span class="text-cyan-400 group-hover/quiz:translate-x-0.5 transition-transform text-xs font-bold">→</span>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Bottom Footer of Card -->
          <div class="pt-3 border-t border-pulso-border/60 flex items-center justify-between text-xs font-mono">
            <div>
              <span class="text-slate-500 text-[10px]">TOTAL LEADS: </span>
              <span class="text-emerald-400 font-bold">{{ client.totalLeads }}</span>
            </div>

            <RouterLink
              :to="`/${client.slug}/${client.quizzes[0]?.quiz_key || 'quiz1'}`"
              class="text-cyan-400 hover:text-cyan-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-all text-[11px]"
            >
              <span>ABRIR TELEMETRÍA</span>
              <span>→</span>
            </RouterLink>
          </div>
        </div>

        <!-- Add Client Placeholder Card -->
        <div class="border border-dashed border-pulso-border/90 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group min-h-[220px]">
          <div class="w-12 h-12 rounded-xl border border-dashed border-slate-700 group-hover:border-cyan-400 flex items-center justify-center text-slate-500 group-hover:text-cyan-300 mb-3 transition-colors text-xl font-bold">
            +
          </div>
          <p class="font-tech text-sm uppercase tracking-wider text-slate-300 group-hover:text-cyan-200 font-bold">
            Registrar Nuevo Cliente / Quiz
          </p>
          <p class="text-xs font-mono text-slate-500 mt-1 max-w-xs">
            Crear espacio aislado multi-inquilino con prefijo de URL personalizado (ej: <code>/:cliente/:quiz</code>)
          </p>
        </div>
      </div>
    </div>

    <!-- Footer HUD -->
    <footer class="max-w-5xl mx-auto w-full pt-6 border-t border-pulso-border/50 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
      <div>
        PULSO TELEMETRY // MOTOR MULTI-CLIENTE ACTIVO (SCHEMA: dev)
      </div>
      <div>
        LATENCIA RED: <span class="text-cyan-400">18MS</span> · PROTOCOLO: <span class="text-emerald-400">TLS 1.3</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase, hasSupabaseConfig } from '@/supabase'
import { MOCK_CLIENTS } from '@/mock'
import type { Client } from '@/types'

interface ClientCardData extends Client {
  totalLeads: number
}

const clientsList = ref<ClientCardData[]>(
  MOCK_CLIENTS.map(c => ({
    ...c,
    totalLeads: 0,
  }))
)

async function fetchRealLeadCounts() {
  if (!hasSupabaseConfig) return
  try {
    // 1. Leads de Supabase
    const { data: allLeads } = await supabase
      .from('leads')
      .select('id, origen, client_id')

    if (!allLeads) return

    clientsList.value.forEach(client => {
      if (client.slug === 'opticajohanna') {
        // Óptica Johanna incluye leads históricos de Oculus (quiz1, quiz2, Quiz, opticajohanna)
        client.totalLeads = allLeads.length
      } else {
        // Clientes específicos
        client.totalLeads = allLeads.filter((l: any) => l.client_id === client.slug).length
      }
    })
  } catch (e) {
    console.warn('[PULSO] Error consultando conteo de leads:', e)
  }
}

onMounted(() => {
  fetchRealLeadCounts()
})
</script>
