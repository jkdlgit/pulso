<template>
  <div class="h-full flex flex-col overflow-hidden text-slate-200">
    <!-- Header de Auditoría y Frecuencia (30 min) -->
    <div class="p-3 bg-pulso-void/90 border-b border-pulso-border/70 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="font-tech text-xs font-bold text-slate-100 uppercase tracking-wider">
          Auditoría Autónoma de Expertos
        </span>
        <span class="badge badge-cyan text-[8px] py-0 px-1.5">
          Ciclo 30 min
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[9px] font-mono text-slate-400">
          Hace {{ minutesSinceLastAudit }} min · Próxima en {{ minutesUntilNextAudit }} min
        </span>
        <button
          @click="runAuditCycle"
          :disabled="isAuditing"
          class="px-2 py-1 rounded bg-pulso-void border border-pulso-border hover:border-violet-400 text-[8px] font-mono text-violet-300 hover:text-violet-200 transition-colors flex items-center gap-1 disabled:opacity-40"
          title="Forzar re-análisis completo de toda la base de datos y Meta Ads"
        >
          <span>⚡</span>
          <span>{{ isAuditing ? 'ESCANEANDO...' : 'RE-AUDITAR' }}</span>
        </button>
      </div>
    </div>

    <!-- Barra de Impacto Ejecutivo Proyectado -->
    <div class="p-2.5 bg-gradient-to-r from-violet-950/40 via-cyan-950/30 to-pulso-void border-b border-pulso-border/50 grid grid-cols-3 gap-2 text-center flex-shrink-0">
      <div class="p-1.5 rounded bg-pulso-void/60 border border-pulso-border/40">
        <span class="text-[8px] font-mono uppercase text-slate-400 block">Salud Global</span>
        <span class="text-xs font-bold font-tech text-emerald-400">{{ commandData.healthScore }}/100</span>
      </div>
      <div class="p-1.5 rounded bg-pulso-void/60 border border-pulso-border/40">
        <span class="text-[8px] font-mono uppercase text-slate-400 block">Evaluaciones</span>
        <span class="text-xs font-bold font-tech text-cyan-300">+105% Potencial</span>
      </div>
      <div class="p-1.5 rounded bg-pulso-void/60 border border-pulso-border/40">
        <span class="text-[8px] font-mono uppercase text-slate-400 block">Costo / Cita</span>
        <span class="text-xs font-bold font-tech text-amber-300">-$0.58 / Paciente</span>
      </div>
    </div>

    <!-- Lista de Tarjetas con Storytelling y % de Mejora -->
    <div class="flex-1 overflow-y-auto p-3 space-y-3 pr-2 scrollbar-thin">
      <div
        v-for="card in auditCards"
        :key="card.id"
        class="rounded-xl border bg-pulso-surface/80 p-3.5 space-y-2.5 transition-all hover:border-violet-500/50 shadow-lg"
        :class="card.urgency === 'alta' ? 'border-rose-500/40' : 'border-pulso-border/70'"
      >
        <!-- Header de la Tarjeta -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span
              class="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full"
              :class="card.urgency === 'alta' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'"
            >
              {{ card.urgency === 'alta' ? 'URGENCIA ALTA' : 'OPORTUNIDAD CLAVE' }}
            </span>
            <span class="text-[9px] font-mono text-cyan-400 font-bold uppercase">
              // {{ card.category }}
            </span>
          </div>

          <button
            @click="handleAskAbout(card)"
            class="text-[9px] font-mono text-violet-300 hover:text-violet-100 flex items-center gap-1 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 px-2 py-1 rounded transition-colors"
          >
            <span>💬</span>
            <span>PREGUNTAR AL CHAT →</span>
          </button>
        </div>

        <!-- Título Narrativo de la Historia -->
        <h4 class="text-xs font-bold text-slate-100 leading-snug">
          {{ card.storyTitle }}
        </h4>

        <!-- Párrafo de Storytelling -->
        <p class="text-[10px] text-slate-300 leading-relaxed font-sans bg-pulso-void/50 p-2.5 rounded-lg border border-pulso-border/40">
          {{ card.narrative }}
        </p>

        <!-- Bloque de Métricas Duras y Brecha -->
        <div class="grid grid-cols-2 gap-2 text-[9px] font-mono">
          <div class="p-2 rounded bg-pulso-void/80 border border-pulso-border/50">
            <span class="text-slate-400 block text-[8px] uppercase">{{ card.hardMetrics.labelA }}</span>
            <span class="text-slate-200 font-bold">{{ card.hardMetrics.valueA }}</span>
            <span class="text-rose-400 block text-[8px] mt-1">{{ card.hardMetrics.gap }}</span>
          </div>
          <div class="p-2 rounded bg-emerald-950/20 border border-emerald-500/30">
            <span class="text-emerald-400 block text-[8px] uppercase">Impacto Proyectado</span>
            <span class="text-emerald-200 font-bold">{{ card.projectedImpact.percentage }}</span>
            <span class="text-slate-400 block text-[8px] mt-1">{{ card.projectedImpact.financialGain }}</span>
          </div>
        </div>

        <!-- Voces y Veredictos del Consejo de Expertos -->
        <div class="pt-1.5 border-t border-pulso-border/40 space-y-1.5">
          <span class="text-[8px] font-mono uppercase tracking-wider text-slate-400 block">
            Posturas del Consejo de Expertos:
          </span>
          <div
            v-for="(exp, expIdx) in card.expertVoices"
            :key="expIdx"
            class="text-[9px] font-mono flex items-start gap-1.5 p-1.5 rounded bg-pulso-void/40 border border-pulso-border/30"
          >
            <span class="text-xs flex-shrink-0">{{ exp.roleIcon }}</span>
            <div class="flex-1 leading-snug">
              <strong class="text-slate-200 font-bold mr-1">{{ exp.roleName }}:</strong>
              <span class="text-slate-400">{{ exp.verdict }}</span>
            </div>
          </div>
        </div>

        <!-- Botón de Acción Directa -->
        <div class="pt-1 flex justify-end">
          <button
            @click="handleAskAbout(card)"
            class="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-violet-600/80 to-cyan-600/80 hover:from-violet-500 hover:to-cyan-500 text-white font-mono text-[9px] font-bold flex items-center justify-center gap-1.5 shadow transition-all"
          >
            <span>💬 Abrir diálogo sobre este caso con los especialistas</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCopilotAudit, type StorytellingCard } from './useCopilotAudit'
import { useCopilotStore } from './copilotMemoryStore'

const {
  auditCards,
  minutesSinceLastAudit,
  minutesUntilNextAudit,
  isAuditing,
  runAuditCycle,
  commandData,
} = useCopilotAudit()

const { injectFindingToChat } = useCopilotStore()

const emit = defineEmits<{
  (e: 'select-card-prompt', prompt: string): void
}>()

function handleAskAbout(card: StorytellingCard) {
  const prompt = injectFindingToChat(
    card.suggestedPrompt,
    `Hallazgo: "${card.storyTitle}" (${card.category}) · Impacto esperado: ${card.projectedImpact.percentage}`
  )
  emit('select-card-prompt', prompt)
}
</script>
