<template>
  <div class="space-y-4 pt-1">
    <div v-if="data.length > 0" class="space-y-4">
      <div v-for="source in data" :key="source.label" class="space-y-1.5">
        <div class="flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full shadow-sm" :style="{ backgroundColor: source.color }"></span>
            <span class="font-medium text-slate-200">{{ source.label.toUpperCase() }}</span>
          </div>
          <span class="font-bold text-cyan-300 font-mono">{{ source.value }}%</span>
        </div>
        <div class="w-full bg-pulso-void/80 h-2 rounded-full overflow-hidden p-[1px] border border-pulso-border/60">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :style="{
              width: `${source.value}%`,
              backgroundColor: source.color,
              boxShadow: `0 0 10px ${source.color}80`
            }"
          ></div>
        </div>
      </div>

      <!-- Quick stats insight -->
      <div class="pt-3 border-t border-pulso-border/60 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span class="text-slate-500">// CANAL PRINCIPAL</span>
        <span class="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          {{ topSource?.label }} ({{ topSource?.value }}%)
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="py-8 text-center font-mono">
      <span class="text-xs text-slate-400 font-semibold">// SIN FUENTES REGISTRADAS</span>
      <p class="text-[10px] text-slate-500 mt-1">Se detectarán UTMs al recibir visitas.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SourceItem {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  data: SourceItem[]
}>()

const topSource = computed(() => {
  if (!props.data || props.data.length === 0) return null
  return [...props.data].sort((a, b) => b.value - a.value)[0]
})
</script>
