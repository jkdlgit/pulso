/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pulso: {
          void:    '#050810',
          bg:      '#070a12',
          surface: '#0d1322',
          card:    '#11192d',
          border:  '#1d2a48',
          accent:  '#38bdf8', // Neon Sky Cyan
          electric:'#3b82f6',
          green:   '#10b981', // Emerald
          neon:    '#00f0ff',
          amber:   '#f59e0b',
          rose:    '#f43f5e',
          muted:   '#64748b',
          text:    '#f1f5f9',
          violet:  '#8b5cf6',
          pink:    '#ec4899',
          orange:  '#fb923c',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        tech: ['Chakra Petch', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'hud': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)",
        'hud-linear': "linear-gradient(180deg, rgba(17, 25, 45, 0.85) 0%, rgba(13, 19, 34, 0.95) 100%)",
      }
    },
  },
  plugins: [],
}
