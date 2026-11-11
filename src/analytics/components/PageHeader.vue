<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500 mb-1">
          <span class="text-cyan-500">{{ code }}</span>
          <span class="text-slate-700">//</span>
          <span>PULSO ANALYTICS</span>
        </div>
        <h1 class="text-lg font-tech font-bold tracking-wide text-slate-100 flex items-center gap-2 flex-wrap">
          {{ title }}
          <slot name="tag" />
        </h1>
        <p v-if="description" class="text-[11px] font-mono text-slate-500 mt-1 max-w-3xl leading-relaxed">
          {{ description }}
        </p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  code: string
  description?: string
}>()
</script>
