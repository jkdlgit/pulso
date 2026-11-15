<template>
  <div class="flex h-screen overflow-hidden bg-pulso-bg text-slate-200">
    <AnalyticsSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <AnalyticsTopbar />
      <GlobalFilterBar />
      <main class="flex-1 overflow-y-auto p-4 lg:p-5">
        <RouterView />
      </main>
    </div>
  </div>
  <!-- Consejo Asesor Estratégico — Ventana Flotante (overlay, no afecta el layout) -->
  <FloatingCopilotWindow />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AnalyticsSidebar from './AnalyticsSidebar.vue'
import AnalyticsTopbar from './AnalyticsTopbar.vue'
import GlobalFilterBar from './GlobalFilterBar.vue'
import { useAnalytics } from '../store'
import FloatingCopilotWindow from '../copilot/FloatingCopilotWindow.vue'

const { init } = useAnalytics()
onMounted(() => { init() })
</script>
