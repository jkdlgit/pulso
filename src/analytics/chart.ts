// Configuración global de Chart.js con la estética HUD de Pulso
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

Chart.defaults.color = '#94a3b8'
Chart.defaults.font.family = "'JetBrains Mono', monospace"
Chart.defaults.font.size = 10
Chart.defaults.borderColor = 'rgba(29, 42, 72, 0.55)'

export const PALETTE = ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#22d3ee', '#fb923c', '#64748b']

export function baseOptions(extra: any = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, padding: 14, font: { size: 10 } },
      },
      tooltip: {
        backgroundColor: 'rgba(13, 19, 34, 0.97)',
        borderColor: 'rgba(56, 189, 248, 0.4)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
        bodyFont: { family: "'JetBrains Mono', monospace", size: 10 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(29, 42, 72, 0.35)', drawBorder: false },
        ticks: { color: '#64748b', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(29, 42, 72, 0.35)', drawBorder: false },
        ticks: { color: '#64748b' },
      },
    },
    ...extra,
  }
}

export function lineDataset(label: string, data: number[], color = PALETTE[0], fill = true) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: fill ? `${color}22` : 'transparent',
    pointBackgroundColor: color,
    pointBorderColor: '#050810',
    pointRadius: 2,
    pointHoverRadius: 5,
    borderWidth: 2,
    tension: 0.35,
    fill,
  }
}

export function barDataset(label: string, data: number[], color = PALETTE[0]) {
  return {
    label,
    data,
    backgroundColor: `${color}bb`,
    hoverBackgroundColor: color,
    borderColor: color,
    borderWidth: 1,
    borderRadius: 4,
    maxBarThickness: 34,
  }
}
