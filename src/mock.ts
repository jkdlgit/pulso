// Mock data types (para respaldo o testing inicial)
import type { Client, Site, Event, Lead, KpiData, FunnelStep, DailyVisit } from './types'

// Catálogo Multi-Cliente: Un cliente puede tener múltiples Quizzes
export const MOCK_CLIENTS: Client[] = [
  {
    id: 'opticajohanna',
    slug: 'opticajohanna',
    name: 'Óptica Johanna (Oculus)',
    emoji: '👁️',
    industry: 'Salud Visual / Optometría',
    owner_email: 'contacto@opticajohanna.com',
    has_local_crm: true, // Cuenta con sistema /dashboard Oculus
    quizzes: [
      {
        id: 'quiz1',
        quiz_key: 'quiz1',
        name: 'Quiz 1 (Test Visual Principal)',
        url: 'http://localhost:5173/opticajohanna/quiz1',
        active: true,
        created_at: '2026-10-01T00:00:00Z',
      },
      {
        id: 'quiz2',
        quiz_key: 'quiz2',
        name: 'Quiz 2 (Diagnóstico Rápido Pulso)',
        url: 'http://localhost:5173/opticajohanna/quiz2',
        active: true,
        created_at: '2026-11-06T00:00:00Z',
      },
    ],
  },
  {
    id: 'mecanicaluis',
    slug: 'mecanicaluis',
    name: 'Mecánica Luis',
    emoji: '🔧',
    industry: 'Taller Automotriz & Frenos',
    owner_email: 'info@mecanicaluis.com',
    has_local_crm: false,
    quizzes: [
      {
        id: 'quiz1',
        quiz_key: 'quiz1',
        name: 'Quiz 1 (Diagnóstico Rápido de Frenos)',
        url: 'https://mecanicaluis.com/quiz1',
        active: true,
        created_at: '2026-10-15T00:00:00Z',
      },
    ],
  },
  {
    id: 'compupablo',
    slug: 'compupablo',
    name: 'CompuServicios Pablo',
    emoji: '💻',
    industry: 'Venta de Laptops & Reparación',
    owner_email: 'ventas@compupablo.com',
    has_local_crm: false,
    quizzes: [
      {
        id: 'quiz1',
        quiz_key: 'quiz1',
        name: 'Quiz 1 (Asesor de Laptop Ideal)',
        url: 'https://compupablo.com/quiz1',
        active: false,
        created_at: '2026-10-20T00:00:00Z',
      },
    ],
  },
]

export const MOCK_SITES: Site[] = [
  {
    id: 'quiz1',
    site_key: 'quiz1',
    name: 'Oculus // Quiz 1 (Original)',
    url: 'http://localhost:5173/quiz1',
    owner_email: 'admin@oculus.com',
    active: true,
    has_local_crm: true,
    created_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'quiz2',
    site_key: 'quiz2',
    name: 'Oculus // Quiz 2 (Prueba Pulso)',
    url: 'http://localhost:5173/quiz2',
    owner_email: 'admin@pulso.local',
    active: true,
    has_local_crm: true,
    created_at: '2026-11-06T00:00:00Z',
  },
  {
    id: 'oculus',
    site_key: 'oculus',
    name: 'Oculus // Quiz 1 (Original)',
    url: 'http://localhost:5173/quiz1',
    owner_email: 'admin@oculus.com',
    active: true,
    has_local_crm: true,
    created_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'clienteb',
    site_key: 'clienteb',
    name: 'Landing Cliente B (Mecánica)',
    url: 'https://clienteb.vercel.app',
    owner_email: 'admin@clienteb.com',
    active: false,
    has_local_crm: false,
    created_at: '2026-10-15T00:00:00Z',
  },
]

export const MOCK_KPI: KpiData = {
  visitas: 0,
  paso1: 0,
  paso2: 0,
  paso3: 0,
  completados: 0,
  reservas: 0,
  llegaron: 0,
  ventasCount: 0,
  ingresosTotal: 0,
  activeNow: 0,
}

export const MOCK_FUNNEL: FunnelStep[] = [
  { label: 'Entrada / Visitas', count: 0, pct: 0 },
  { label: 'Paso 1 (Datos / Inicio)', count: 0, pct: 0 },
  { label: 'Paso 2 (Evaluación)', count: 0, pct: 0 },
  { label: 'Paso 3 (Diagnóstico)', count: 0, pct: 0 },
  { label: 'Completados (Test Finalizado)', count: 0, pct: 0 },
  { label: 'Reservas (Cita / WhatsApp)', count: 0, pct: 0 },
  { label: 'Llegaron al Local', count: 0, pct: 0, status: 'PAUSADO' },
  { label: 'Ventas Concretadas', count: 0, pct: 0, status: 'PAUSADO' },
]

export const MOCK_DAILY: DailyVisit[] = []
export const MOCK_LEADS: Lead[] = []
export const MOCK_EVENTS: Event[] = []
export const MOCK_SOURCES: { label: string; value: number; color: string }[] = []
