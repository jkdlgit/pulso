import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// Plugin de Telemetría Pulso en tiempo real
function pulsoTelemetryPlugin(): Plugin {
  const eventsFile = path.resolve(__dirname, 'telemetry_events.json')
  let eventsMemory: any[] = []

  try {
    if (fs.existsSync(eventsFile)) {
      eventsMemory = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'))
    }
  } catch (e) {
    eventsMemory = []
  }

  return {
    name: 'pulso-telemetry-endpoint',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Habilitar CORS para que localhost:5173 (Oculus) pueda enviar eventos sin restricción
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        // Endpoint para recibir eventos de telemetría: POST /api/event
        if (req.method === 'POST' && req.url === '/api/event') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const event = JSON.parse(body)
              event.id = Date.now() + Math.floor(Math.random() * 1000)
              event.created_at = event.created_at || new Date().toISOString()
              
              // Normalizar client_key y quiz_key
              if (!event.client_key || !event.quiz_key) {
                if (event.site_key?.includes('_')) {
                  const parts = event.site_key.split('_')
                  event.client_key = event.client_key || parts[0]
                  event.quiz_key = event.quiz_key || parts[1]
                } else if (event.site_key === 'quiz1' || event.site_key === 'oculus') {
                  event.client_key = 'opticajohanna'
                  event.quiz_key = 'quiz1'
                } else if (event.site_key === 'quiz2') {
                  event.client_key = 'opticajohanna'
                  event.quiz_key = 'quiz2'
                } else {
                  event.client_key = event.client_key || 'opticajohanna'
                  event.quiz_key = event.quiz_key || event.site_key || 'quiz1'
                }
              }

              // 🛡️ DEDUPLICACIÓN EN MOTOR:
              // Para etapas críticas del funnel (visita, pasos, completado, reserva):
              // Si la misma sesión ya registró este tipo de evento, no lo duplicamos
              const singleEvents = ['visita', 'paso_1', 'paso_2', 'paso_3', 'completado', 'reserva']
              if (singleEvents.includes(event.event_type) && event.session_id) {
                const matchSite = (e: any) => e.site_key === event.site_key || 
                  (e.client_key === event.client_key && e.quiz_key === event.quiz_key)
                const alreadyExists = eventsMemory.some(
                  e => matchSite(e) &&
                       e.session_id === event.session_id &&
                       e.event_type === event.event_type
                )
                if (alreadyExists) {
                  console.log(`🛡️ [PULSO ENGINE] Evento ignorado por deduplicación: [${event.event_type.toUpperCase()}] para sesión ${event.session_id}`)
                  res.setHeader('Content-Type', 'application/json')
                  res.statusCode = 200
                  res.end(JSON.stringify({ success: true, deduplicated: true }))
                  return
                }
              }

              eventsMemory.unshift(event)
              if (eventsMemory.length > 500) eventsMemory.pop()

              // Guardar en archivo local
              fs.writeFileSync(eventsFile, JSON.stringify(eventsMemory, null, 2))

              console.log(`📡 [PULSO ENGINE] Evento registrado: [${event.event_type.toUpperCase()}] -> ${event.event_name} (${event.client_key}/${event.quiz_key})`)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, eventId: event.id }))
            } catch (err: any) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        // Endpoint para consultar eventos telemétricos: GET /api/events
        if (req.method === 'GET' && req.url?.startsWith('/api/events')) {
          const urlObj = new URL(req.url, 'http://localhost:5174')
          const clientParam = urlObj.searchParams.get('client')
          const quizParam = urlObj.searchParams.get('quiz')
          const siteKeyParam = urlObj.searchParams.get('siteKey')
          
          let filtered = eventsMemory

          if (clientParam && quizParam) {
            filtered = eventsMemory.filter(e => {
              const eClient = e.client_key || (e.site_key?.includes('_') ? e.site_key.split('_')[0] : 'opticajohanna')
              const eQuiz = e.quiz_key || (e.site_key === 'oculus' ? 'quiz1' : (e.site_key?.includes('_') ? e.site_key.split('_')[1] : e.site_key))
              return eClient === clientParam && eQuiz === quizParam
            })
          } else if (clientParam) {
            filtered = eventsMemory.filter(e => {
              const eClient = e.client_key || (e.site_key?.includes('_') ? e.site_key.split('_')[0] : 'opticajohanna')
              return eClient === clientParam
            })
          } else if (siteKeyParam) {
            filtered = eventsMemory.filter(e => {
              if (e.site_key === siteKeyParam) return true
              if ((siteKeyParam === 'oculus' || siteKeyParam === 'quiz1') && (e.site_key === 'oculus' || e.site_key === 'quiz1' || e.site_key === 'opticajohanna_quiz1')) return true
              if (siteKeyParam === 'quiz2' && (e.site_key === 'quiz2' || e.site_key === 'opticajohanna_quiz2')) return true
              return false
            })
          }

          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify(filtered))
          return
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), pulsoTelemetryPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
