<template>
  <div class="w-full overflow-x-auto">
    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="{ minWidth: '760px', height: `${height}px` }" preserveAspectRatio="xMidYMid meet">
      <!-- Column headers -->
      <g v-for="(col, ci) in columns" :key="`h${ci}`">
        <text :x="colX[ci]" :y="16" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="9" letter-spacing="1.5">
          {{ col.label.toUpperCase() }}
        </text>
        <line :x1="colX[ci]" :y1="22" :x2="colX[ci] + NODE_W" :y2="22" stroke="#1d2a48" stroke-width="1" />
      </g>

      <!-- Links -->
      <path
        v-for="(l, i) in layout.links"
        :key="`l${i}`"
        :d="l.path"
        fill="none"
        :stroke="l.color"
        :stroke-width="l.width"
        stroke-opacity="0.28"
        class="hover:stroke-opacity-60 transition-all"
      >
        <title>{{ l.label }}: {{ l.value }}</title>
      </path>

      <!-- Nodes -->
      <g v-for="n in layout.nodes" :key="n.key" class="cursor-default">
        <rect :x="n.x" :y="n.y" :width="NODE_W" :height="Math.max(16, n.h)" rx="4" :fill="n.color + '22'" :stroke="n.color" stroke-width="1.2" />
        <text :x="n.x + 6" :y="n.y + Math.min(14, Math.max(10, n.h / 2))" fill="#e2e8f0" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="600">
          {{ truncate(n.label, 15) }}
        </text>
        <text :x="n.x + NODE_W - 6" :y="n.y + Math.min(14, Math.max(10, n.h / 2))" text-anchor="end" :fill="n.color" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">
          {{ n.value }}
        </text>
        <title>{{ n.label }}: {{ n.value }}</title>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SNode { key: string; label: string; value: number; color?: string }
interface SLink { source: string; target: string; value: number; color?: string }
interface SColumn { label: string; nodes: SNode[] }

const props = withDefaults(defineProps<{
  columns: SColumn[]
  links: SLink[]
  height?: number
}>(), { height: 330 })

const W = 1000
const H = 360
const NODE_W = 118
const TOP = 34
const BOTTOM = 10
const GAP = 12

const colX = computed(() => {
  const n = props.columns.length
  if (n <= 1) return [20]
  return props.columns.map((_, i) => 20 + i * ((W - NODE_W - 40) / (n - 1)))
})

const maxTotal = computed(() => Math.max(
  1,
  ...props.columns.map(c => c.nodes.reduce((s, n) => s + n.value, 0))
))

const layout = computed(() => {
  const nodes: (SNode & { x: number; y: number; h: number })[] = []
  const nodeMap = new Map<string, SNode & { x: number; y: number; h: number }>()
  const avail = H - TOP - BOTTOM
  const maxTotalV = maxTotal.value

  props.columns.forEach((col, ci) => {
    const total = col.nodes.reduce((s, n) => s + n.value, 0) || 1
    const usable = avail - GAP * Math.max(0, col.nodes.length - 1)
    let y = TOP
    for (const n of col.nodes) {
      const h = Math.max(16, (n.value / total) * usable)
      const node = { ...n, color: n.color || '#38bdf8', x: colX.value[ci], y, h }
      nodes.push(node)
      nodeMap.set(n.key, node)
      y += h + GAP
    }
  })

  const usedSource = new Map<string, number>()
  const usedTarget = new Map<string, number>()
  const links = props.links.map((l, i) => {
    const s = nodeMap.get(l.source)
    const t = nodeMap.get(l.target)
    if (!s || !t) return null
    const band = (l.value / maxTotalV) * avail
    const thickness = Math.max(1.2, Math.min(24, band))
    const sUsed = usedSource.get(l.source) || 0
    const tUsed = usedTarget.get(l.target) || 0
    const sy = s.y + Math.min(s.h - thickness, sUsed) + thickness / 2
    const ty = t.y + Math.min(t.h - thickness, tUsed) + thickness / 2
    usedSource.set(l.source, sUsed + thickness)
    usedTarget.set(l.target, tUsed + thickness)
    const x1 = s.x + NODE_W
    const x2 = t.x
    const dx = Math.max(30, (x2 - x1) * 0.45)
    return {
      ...l,
      path: `M ${x1} ${sy} C ${x1 + dx} ${sy}, ${x2 - dx} ${ty}, ${x2} ${ty}`,
      width: thickness,
      color: l.color || s.color || '#38bdf8',
      label: `${s.label} → ${t.label}`,
    }
  }).filter(Boolean) as any[]

  return { nodes, links }
})

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}
</script>
