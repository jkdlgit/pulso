<template>
  <aside class="w-64 bg-pulso-surface/95 border-r border-pulso-border/80 flex flex-col justify-between p-4 z-10 flex-shrink-0">
    <div class="space-y-6">
      <!-- Client & Quiz Card Pill -->
      <div class="p-3 rounded-xl bg-pulso-card/90 border border-pulso-border/90 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-pulso-surface border border-pulso-border flex items-center justify-center text-lg shadow-sm">
            {{ displayEmoji }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold font-tech tracking-wide text-slate-100 truncate" :title="displayName">
              {{ displayName }}
            </p>
            <p class="text-[10px] font-mono text-cyan-400/90 truncate" :title="displaySub">
              {{ displaySub }}
            </p>
          </div>
        </div>

        <div class="mt-3 pt-2.5 border-t border-pulso-border/60 flex items-center justify-between text-[10px] font-mono">
          <span class="text-slate-500">CANAL TRACKER</span>
          <span class="badge badge-green text-[9px] py-0 px-2">ONLINE</span>
        </div>
      </div>

      <!-- Navigation links -->
      <nav class="space-y-1.5">
        <p class="px-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
          // NAVEGACIÓN
        </p>

        <RouterLink
          :to="basePath"
          class="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 border"
          :class="isDashboardActive
            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-glow-cyan font-bold'
            : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-pulso-card/60'"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-sm">📊</span>
            <span class="tracking-wide">DASHBOARD</span>
          </div>
          <span class="text-[10px] text-slate-600">01</span>
        </RouterLink>

        <RouterLink
          :to="`${basePath}/live`"
          class="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 border"
          :class="isLiveActive
            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-glow-cyan font-bold'
            : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-pulso-card/60'"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-sm">⚡</span>
            <span class="tracking-wide">TELEMETRÍA EN VIVO</span>
          </div>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
        </RouterLink>

        <RouterLink
          :to="`${basePath}/leads`"
          class="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 border"
          :class="isLeadsActive
            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-glow-cyan font-bold'
            : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-pulso-card/60'"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-sm">👥</span>
            <span class="tracking-wide">LEADS CAPTURADOS</span>
          </div>
          <span class="badge badge-cyan text-[9px] py-0 px-1.5">CRM</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Bottom snippet hint -->
    <div class="p-3 bg-pulso-void/70 rounded-xl border border-pulso-border/70 text-[11px] font-mono">
      <div class="flex items-center justify-between text-slate-400 mb-1.5">
        <span class="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">SNIPPET SCRIPT</span>
        <button @click="copySnippet" class="text-cyan-400 hover:text-cyan-200 text-[10px] uppercase font-bold transition-colors">
          {{ copied ? 'COPIADO ✓' : 'COPIAR' }}
        </button>
      </div>
      <div class="p-2 bg-[#050810] rounded text-[10px] text-slate-300 font-mono overflow-x-auto truncate border border-slate-900">
        &lt;script src="..." data-client="{{ currentClientSlug }}" data-quiz="{{ currentQuizSlug }}"&gt;
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { Client, QuizConfig, Site } from '@/types'
import { MOCK_CLIENTS } from '@/mock'

const props = defineProps<{
  client?: Client
  quiz?: QuizConfig
  site?: Site
}>()

const route = useRoute()
const copied = ref(false)

const currentClientSlug = computed(() => {
  if (props.client?.slug) return props.client.slug
  if (route.params.clientSlug) return route.params.clientSlug as string
  const siteKey = (route.params.siteKey as string) || ''
  if (siteKey === 'quiz2' || siteKey === 'oculus' || siteKey === 'quiz1') return 'opticajohanna'
  return MOCK_CLIENTS[0].slug
})

const currentQuizSlug = computed(() => {
  if (props.quiz?.quiz_key) return props.quiz.quiz_key
  if (route.params.quizSlug) return route.params.quizSlug as string
  const siteKey = (route.params.siteKey as string) || ''
  if (siteKey === 'quiz2') return 'quiz2'
  if (siteKey === 'oculus' || siteKey === 'quiz1') return 'quiz1'
  return 'quiz1'
})

const basePath = computed(() => {
  return `/${currentClientSlug.value}/${currentQuizSlug.value}`
})

const isDashboardActive = computed(() => {
  return route.name === 'client-quiz-dashboard' || route.name === 'legacy-dashboard'
})

const isLiveActive = computed(() => {
  return route.name === 'client-quiz-live' || route.name === 'legacy-live'
})

const isLeadsActive = computed(() => {
  return route.name === 'client-quiz-leads' || route.name === 'legacy-leads'
})

const displayName = computed(() => {
  if (props.client?.name) return props.client.name
  const found = MOCK_CLIENTS.find(c => c.slug === currentClientSlug.value)
  return found?.name || props.site?.name || 'Cliente'
})

const displaySub = computed(() => {
  if (props.quiz?.name) return props.quiz.name
  return `/${currentClientSlug.value}/${currentQuizSlug.value}`
})

const displayEmoji = computed(() => {
  if (props.client?.emoji) return props.client.emoji
  const found = MOCK_CLIENTS.find(c => c.slug === currentClientSlug.value)
  return found?.emoji || '🌐'
})

function copySnippet() {
  const code = `<script src="http://localhost:5174/tracker.js" data-client="${currentClientSlug.value}" data-quiz="${currentQuizSlug.value}" defer><\/script>`
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>
