-- ==============================================================================
-- 📡 PULSO ANALYTICS — ESQUEMA DEDICADO EN PulsoDB (Esquema DEV y PRO)
-- Pega este script en Supabase Dashboard > SQL Editor > New query y pulsa RUN.
-- No borra ni modifica los datos de Oculus; agrega las tablas telemétricas necesarias.
-- ==============================================================================

-- 1. Asegurar esquemas
CREATE SCHEMA IF NOT EXISTS dev;
CREATE SCHEMA IF NOT EXISTS pro;

GRANT USAGE ON SCHEMA dev TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA pro TO anon, authenticated, service_role;

-- 2. Tabla de Sitios en dev
CREATE TABLE IF NOT EXISTS dev.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key TEXT NOT NULL UNIQUE,          -- ej: 'oculus', 'quiz2', 'clienteb'
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabla de Eventos Telemétricos en dev
CREATE TABLE IF NOT EXISTS dev.events (
  id BIGSERIAL PRIMARY KEY,
  site_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,              -- 'pageview', 'step_complete', 'lead', 'conversion', 'exit'
  event_name TEXT NOT NULL,              -- 'paso_1_sintomas', 'lead_capturado', etc.
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  country TEXT DEFAULT 'EC',
  device TEXT,                          -- 'mobile', 'desktop', 'tablet'
  browser TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de alto rendimiento
CREATE INDEX IF NOT EXISTS idx_events_site_key_dev ON dev.events(site_key);
CREATE INDEX IF NOT EXISTS idx_events_session_id_dev ON dev.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at_dev ON dev.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_type_dev ON dev.events(event_type);

-- 4. Habilitar RLS y Políticas para el rol anon
ALTER TABLE dev.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura anonima dev sites" ON dev.sites;
CREATE POLICY "Permitir lectura anonima dev sites"
  ON dev.sites FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Permitir insercion anonima dev events" ON dev.events;
CREATE POLICY "Permitir insercion anonima dev events"
  ON dev.events FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura anonima dev events" ON dev.events;
CREATE POLICY "Permitir lectura anonima dev events"
  ON dev.events FOR SELECT TO anon, authenticated USING (true);

GRANT ALL ON ALL TABLES IN SCHEMA dev TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA dev TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dev GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 5. Semilla inicial de sitios
INSERT INTO dev.sites (site_key, name, url) VALUES
  ('oculus', 'Quiz 1 — Oculus Original', 'http://localhost:5173/quiz1'),
  ('quiz2', 'Quiz 2 — Oculus con Pulso', 'http://localhost:5173/quiz2'),
  ('clienteb', 'Landing Cliente B', 'https://clienteb.vercel.app')
ON CONFLICT (site_key) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url;

-- 6. Habilitar Supabase Realtime para events y leads
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE dev.events;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE dev.leads;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;
