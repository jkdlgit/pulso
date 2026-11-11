<template>
  <header class="h-14 border-b border-pulso-border/80 bg-pulso-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
    <!-- Brand, Client Selector & Quiz Pills -->
    <div class="flex items-center gap-3 sm:gap-4 min-w-0">
      <RouterLink to="/" class="flex items-center gap-2 group flex-shrink-0">
        <div class="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-sm font-bold text-cyan-300 shadow-glow-cyan group-hover:bg-cyan-500 group-hover:text-pulso-void transition-all">
          📡
        </div>
        <span class="font-tech text-sm tracking-widest font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
          PULSO
        </span>
      </RouterLink>

      <span class="text-slate-700 hidden sm:inline">|</span>

      <!-- 🏢 Selector de Cliente -->
      <div class="relative flex items-center">
        <select
          :value="activeClientSlug"
          @change="onClientSelect(($event.target as HTMLSelectElement).value)"
          class="bg-pulso-void border border-pulso-border/90 rounded-lg text-xs font-mono text-cyan-300 font-bold px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:border-cyan-400 cursor-pointer hover:border-cyan-500/50 transition-all shadow-inner"
        >
          <option
            v-for="c in MOCK_CLIENTS"
            :key="c.slug"
            :value="c.slug"
            class="bg-slate-900 text-slate-200"
          >
            {{ c.emoji }} {{ c.name }}
          </option>
        </select>
        <span class="absolute right-2 text-[10px] text-slate-400 pointer-events-none">▼</span>
      </div>

      <span class="text-slate-700 text-xs hidden md:inline">/</span>

      <!-- 📋 Píldoras de Quizzes del Cliente Activo -->
      <div class="flex items-center gap-1 p-1 rounded-lg bg-pulso-void border border-pulso-border/90 text-xs font-mono overflow-x-auto max-w-[280px] sm:max-w-none">
        <RouterLink
          v-for="q in clientQuizzes"
          :key="q.quiz_key"
          :to="`/${activeClientSlug}/${q.quiz_key}${currentSubPath}`"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded transition-all text-[11px] whitespace-nowrap"
          :class="activeQuizKey === q.quiz_key
            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
            : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50'"
        >
          <span>{{ q.quiz_key === 'quiz2' ? '🧪' : '👁️' }}</span>
          <span>{{ q.name.replace(/\(.*?\)/g, '').trim() || q.quiz_key.toUpperCase() }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- Center HUD Status Badges -->
    <div class="hidden xl:flex items-center gap-4 text-xs font-mono text-slate-400">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
        <span class="text-slate-300">TELEMETRÍA:</span>
        <span class="text-emerald-400 font-semibold">ACTIVA</span>
      </div>
      <span class="text-slate-700">·</span>
      <div>
        <span>CLIENTE:</span>
        <span class="text-cyan-400 ml-1 font-semibold">{{ activeClient?.name }}</span>
      </div>
      <span class="text-slate-700">·</span>
      <div>
        <span>LATENCIA:</span>
        <span class="text-cyan-400 ml-1">18ms</span>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-3 flex-shrink-0">
      <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <span class="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
        <span class="font-bold">{{ activeUsers }}</span> en línea
      </div>

      <RouterLink
        to="/"
        class="btn-hud-secondary text-[11px] hidden sm:flex items-center gap-1"
        title="Ver catálogo de clientes"
      >
        <span>⇄</span>
        <span>TODOS</span>
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { MOCK_CLIENTS } from '@/mock'
import type { Client, QuizConfig } from '@/types'

const props = defineProps<{
  siteName?: string
  activeUsers?: number
  currentClient?: Client
  currentQuiz?: QuizConfig
}>()

const route = useRoute()
const router = useRouter()

// Determinar el slug del cliente actual a partir de props o de los parámetros de ruta
const activeClientSlug = computed(() => {
  if (props.currentClient?.slug) return props.currentClient.slug
  if (route.params.clientSlug) return route.params.clientSlug as string
  const siteKey = (route.params.siteKey as string) || ''
  if (siteKey === 'quiz2' || siteKey === 'oculus' || siteKey === 'quiz1') return 'opticajohanna'
  return MOCK_CLIENTS[0].slug
})

// Objeto de cliente activo
const activeClient = computed(() => {
  return MOCK_CLIENTS.find(c => c.slug === activeClientSlug.value) || MOCK_CLIENTS[0]
})

// Quizzes del cliente activo
const clientQuizzes = computed(() => {
  return activeClient.value?.quizzes || []
})

// Quiz activo actual
const activeQuizKey = computed(() => {
  if (props.currentQuiz?.quiz_key) return props.currentQuiz.quiz_key
  if (route.params.quizSlug) return route.params.quizSlug as string
  const siteKey = (route.params.siteKey as string) || ''
  if (siteKey === 'quiz2') return 'quiz2'
  if (siteKey === 'oculus' || siteKey === 'quiz1') return 'quiz1'
  return clientQuizzes.value[0]?.quiz_key || 'quiz1'
})

// Preservar la sub-pestaña (/live o /leads) al cambiar de quiz
const currentSubPath = computed(() => {
  const path = route.path
  if (path.endsWith('/live')) return '/live'
  if (path.endsWith('/leads')) return '/leads'
  return ''
})

function onClientSelect(newClientSlug: string) {
  const targetClient = MOCK_CLIENTS.find(c => c.slug === newClientSlug)
  const firstQuiz = targetClient?.quizzes[0]?.quiz_key || 'quiz1'
  router.push(`/${newClientSlug}/${firstQuiz}${currentSubPath.value}`)
}
</script>
