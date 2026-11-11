<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-[11px] font-mono">
      <thead>
        <tr class="border-b border-pulso-border/90 bg-pulso-void/50 text-slate-500 font-semibold uppercase tracking-wider text-[9px]">
          <th
            v-for="col in columns"
            :key="col.key"
            class="py-2.5 px-3 whitespace-nowrap"
            :class="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''"
            :style="col.width ? { width: col.width } : undefined"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-pulso-border/30">
        <tr
          v-for="(row, idx) in rows"
          :key="rowKey ? row[rowKey] : idx"
          class="hover:bg-cyan-500/5 transition-colors"
          :class="clickable ? 'cursor-pointer' : ''"
          @click="clickable && $emit('row-click', row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="py-2.5 px-3"
            :class="[col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : '', col.className || 'text-slate-300']"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ col.format ? col.format(row) : (row[col.key] ?? '—') }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="py-10 text-center">
            <p class="text-[11px] text-slate-400">// SIN REGISTROS PARA LOS FILTROS SELECCIONADOS</p>
            <p class="text-[10px] text-slate-600 mt-1">{{ emptyText }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface Column {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  width?: string
  className?: string
  format?: (row: any) => string | number
}

withDefaults(defineProps<{
  columns: Column[]
  rows: any[]
  rowKey?: string
  clickable?: boolean
  emptyText?: string
}>(), { clickable: false, emptyText: 'Los datos aparecerán cuando exista actividad.' })

defineEmits<{ 'row-click': [row: any] }>()
</script>
