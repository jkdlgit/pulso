<template>
  <div class="hud-card relative overflow-hidden p-6 border-pulso-border/90">
    <!-- Top HUD info -->
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-pulso-border/50">
      <div class="flex items-center gap-3">
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 live-pulse"></span>
        <h3 class="font-tech text-xs tracking-widest uppercase text-cyan-300 font-bold">
          Topología de Red & Flujo de Telemetría // {{ siteKey.toUpperCase() }}
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="activeView = 'network'"
          class="px-2.5 py-1 rounded text-[11px] font-mono tracking-wider transition-all"
          :class="activeView === 'network' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan' : 'text-slate-500 hover:text-slate-300'"
        >
          [TOPOLOGÍA]
        </button>
        <button
          @click="activeView = 'sequence'"
          class="px-2.5 py-1 rounded text-[11px] font-mono tracking-wider transition-all"
          :class="activeView === 'sequence' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan' : 'text-slate-500 hover:text-slate-300'"
        >
          [SECUENCIA]
        </button>
      </div>
    </div>

    <!-- Network Canvas (SVG Interactive Diagram) -->
    <div v-if="activeView === 'network'" class="relative w-full h-64 bg-pulso-void/60 rounded-lg border border-pulso-border/60 flex items-center justify-center p-4">
      <svg class="w-full h-full max-w-3xl" viewBox="0 0 700 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
            <stop offset="50%" stop-color="#00f0ff" stop-opacity="1" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.8" />
          </linearGradient>
          <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Connecting Lines -->
        <path d="M 120 110 L 260 110" stroke="#1d2a48" stroke-width="2" />
        <path d="M 120 110 L 260 110" stroke="url(#cyanGlow)" stroke-width="2" class="packet-flow-line" filter="url(#neonFilter)" />

        <path d="M 310 95 L 430 65" stroke="#1d2a48" stroke-width="2" />
        <path d="M 310 95 L 430 65" stroke="#38bdf8" stroke-width="2" class="packet-flow-line" />

        <path d="M 310 125 L 430 155" stroke="#1d2a48" stroke-width="2" />
        <path d="M 310 125 L 430 155" stroke="#10b981" stroke-width="2" class="packet-flow-line" />

        <path d="M 480 65 L 590 65" stroke="#1d2a48" stroke-width="2" />
        <path d="M 480 65 L 590 65" stroke="#10b981" stroke-width="2" class="packet-flow-line" />

        <!-- NODE 1: Cliente / Visitante -->
        <g transform="translate(70, 75)">
          <rect x="0" y="0" width="70" height="70" rx="12" fill="#0d1424" stroke="#38bdf8" stroke-width="1.5" />
          <text x="35" y="32" text-anchor="middle" font-size="22">📱</text>
          <text x="35" y="52" text-anchor="middle" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">CLIENTE</text>
          <text x="35" y="62" text-anchor="middle" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="7">/{{ siteKey }}</text>
        </g>

        <!-- NODE 2: Edge Tracker -->
        <g transform="translate(250, 75)">
          <rect x="0" y="0" width="75" height="70" rx="12" fill="#0d1424" stroke="#6366f1" stroke-width="1.5" />
          <text x="37" y="32" text-anchor="middle" font-size="22">📡</text>
          <text x="37" y="52" text-anchor="middle" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">TRACKER</text>
          <text x="37" y="62" text-anchor="middle" fill="#818cf8" font-family="'JetBrains Mono', monospace" font-size="7">tracker.js</text>
        </g>

        <!-- NODE 3: Pulso Engine -->
        <g transform="translate(420, 30)">
          <rect x="0" y="0" width="75" height="65" rx="12" fill="#0d1424" stroke="#00f0ff" stroke-width="1.5" />
          <text x="37" y="30" text-anchor="middle" font-size="20">⚡</text>
          <text x="37" y="48" text-anchor="middle" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">ENGINE</text>
          <text x="37" y="57" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="7">PULSO</text>
        </g>

        <!-- NODE 4: Supabase Database -->
        <g transform="translate(420, 125)">
          <rect x="0" y="0" width="75" height="65" rx="12" fill="#0d1424" stroke="#10b981" stroke-width="1.5" />
          <text x="37" y="30" text-anchor="middle" font-size="20">🗄️</text>
          <text x="37" y="48" text-anchor="middle" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">DATABASE</text>
          <text x="37" y="57" text-anchor="middle" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="7">PulsoDB</text>
        </g>

        <!-- NODE 5: Conversión / CRM WhatsApp -->
        <g transform="translate(580, 30)">
          <rect x="0" y="0" width="75" height="65" rx="12" fill="#0d1424" stroke="#25D366" stroke-width="1.5" />
          <text x="37" y="30" text-anchor="middle" font-size="20">💬</text>
          <text x="37" y="48" text-anchor="middle" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">WHATSAPP</text>
          <text x="37" y="57" text-anchor="middle" fill="#25D366" font-family="'JetBrains Mono', monospace" font-size="7">LEADS: {{ leadsCount }}</text>
        </g>
      </svg>
    </div>

    <!-- Sequence Diagram View -->
    <div v-else class="h-64 bg-pulso-void/60 rounded-lg border border-pulso-border/60 p-4 font-mono text-xs overflow-y-auto space-y-2">
      <div class="flex items-center gap-2 text-cyan-400">
        <span class="text-slate-500">[0.00s]</span>
        <span>Cliente visita /{{ siteKey }} -> Carga tracker</span>
        <span class="badge badge-cyan ml-auto">PAGEVIEW</span>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span class="text-slate-500">[0.15s]</span>
        <span>Conexión establecida con PulsoDB</span>
        <span class="badge badge-muted ml-auto">HANDSHAKE</span>
      </div>
      <div v-if="leadsCount > 0" class="flex items-center gap-2 text-emerald-400">
        <span class="text-slate-500">[OK]</span>
        <span>{{ leadsCount }} Prospecto(s) registrado(s) en PulsoDB</span>
        <span class="badge badge-green ml-auto">LEADS_SYNC</span>
      </div>
      <div v-else class="flex items-center gap-2 text-slate-500">
        <span class="text-slate-600">[...]</span>
        <span>Esperando primer formulario enviado desde /{{ siteKey }}...</span>
        <span class="badge badge-muted ml-auto">LISTENING</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    siteKey?: string
    leadsCount?: number
  }>(),
  {
    siteKey: 'quiz2',
    leadsCount: 0,
  }
)

const activeView = ref<'network' | 'sequence'>('network')
</script>
