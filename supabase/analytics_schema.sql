-- ==============================================================================
-- 📡 PULSO ANALYTICS — ESQUEMA DEDICADO `analytic_pulso`
-- ------------------------------------------------------------------------------
-- Este script crea el esquema analítico separado del esquema operativo de Pulso.
-- No modifica `dev`, `pro` ni las tablas de la aplicación original.
--
-- Uso: Supabase Dashboard > SQL Editor > New query > RUN.
-- Requiere extensión pgcrypto (gen_random_uuid), ya disponible en Supabase.
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS analytic_pulso;

GRANT USAGE ON SCHEMA analytic_pulso TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytic_pulso
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytic_pulso
  GRANT SELECT ON TABLES TO anon;

-- ==============================================================================
-- 1. NEGOCIOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.businesses (
  id            TEXT PRIMARY KEY,                -- 'optica', 'taller'
  name          TEXT NOT NULL,
  emoji         TEXT DEFAULT '🏢',
  industry      TEXT DEFAULT '',
  has_local_crm BOOLEAN NOT NULL DEFAULT false,
  currency      TEXT NOT NULL DEFAULT 'USD',
  accent        TEXT NOT NULL DEFAULT '#38bdf8',
  website       TEXT DEFAULT '',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. CAMPAÑAS (datos importados de plataformas publicitarias)
--    spend = presupuesto DIARIO en la moneda del negocio.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.campaigns (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  platform    TEXT NOT NULL,                     -- 'Meta Ads' | 'Google Ads' | 'TikTok Ads'
  name        TEXT NOT NULL,
  adset       TEXT DEFAULT '',
  ad          TEXT DEFAULT '',
  creative    TEXT DEFAULT '',
  spend       NUMERIC(12,2) NOT NULL DEFAULT 0,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks      BIGINT NOT NULL DEFAULT 0,
  started_on  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_on    TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'activa',    -- 'activa' | 'pausada' | 'finalizada'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_campaigns_business ON analytic_pulso.campaigns(business_id);

-- ==============================================================================
-- 3. VISITANTES (identificador seudónimo; nunca identidad real)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.visitor_facts (
  id             TEXT PRIMARY KEY,               -- 'optica_v0001'
  business_id    TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  first_seen     TIMESTAMPTZ NOT NULL,
  last_seen      TIMESTAMPTZ NOT NULL,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  device         TEXT NOT NULL DEFAULT 'desktop',-- 'mobile' | 'desktop' | 'tablet'
  os             TEXT DEFAULT '',
  browser        TEXT DEFAULT '',
  language       TEXT DEFAULT 'es-EC',
  country        TEXT DEFAULT 'Ecuador',
  city           TEXT DEFAULT '',                -- ubicación APROXIMADA por IP
  source         TEXT DEFAULT 'directo',
  medium         TEXT DEFAULT '',
  campaign_id    TEXT REFERENCES analytic_pulso.campaigns(id) ON DELETE SET NULL,
  ad             TEXT,
  creative       TEXT,
  landing_page   TEXT DEFAULT '/',
  is_returning   BOOLEAN NOT NULL DEFAULT false,
  is_identified  BOOLEAN NOT NULL DEFAULT false,
  is_lead        BOOLEAN NOT NULL DEFAULT false,
  is_buyer       BOOLEAN NOT NULL DEFAULT false,
  revenue        NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visitor_facts_business ON analytic_pulso.visitor_facts(business_id);
CREATE INDEX IF NOT EXISTS idx_visitor_facts_last_seen ON analytic_pulso.visitor_facts(last_seen DESC);

-- ==============================================================================
-- 4. SESIONES (hechos agregados por sesión)
--    Los arrays JSONB contienen el detalle observado de navegación.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.session_facts (
  id              TEXT PRIMARY KEY,
  visitor_id      TEXT NOT NULL REFERENCES analytic_pulso.visitor_facts(id) ON DELETE CASCADE,
  business_id     TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL,
  ended_at        TIMESTAMPTZ,
  duration_s      INTEGER NOT NULL DEFAULT 0,
  source          TEXT DEFAULT 'directo',
  medium          TEXT DEFAULT '',
  campaign_id     TEXT REFERENCES analytic_pulso.campaigns(id) ON DELETE SET NULL,
  device          TEXT NOT NULL DEFAULT 'desktop',
  os              TEXT DEFAULT '',
  browser         TEXT DEFAULT '',
  landing_page    TEXT DEFAULT '/',
  pageviews       JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{path,label,scroll,clicks,seconds,ts}]
  page_count      INTEGER NOT NULL DEFAULT 0,
  scroll_avg      INTEGER NOT NULL DEFAULT 0,
  clicks          INTEGER NOT NULL DEFAULT 0,
  quiz_started    BOOLEAN NOT NULL DEFAULT false,
  quiz_completed  BOOLEAN NOT NULL DEFAULT false,
  quiz_steps      JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{question_id,question,step,viewed,answered,answer,time_ms,changed,skipped}]
  form_started    BOOLEAN NOT NULL DEFAULT false,
  form_submitted  BOOLEAN NOT NULL DEFAULT false,
  form_fields     JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{field,action,time_ms}]
  form_seconds    INTEGER NOT NULL DEFAULT 0,
  booked          BOOLEAN NOT NULL DEFAULT false,
  confirmed       BOOLEAN NOT NULL DEFAULT false,
  attended        BOOLEAN NOT NULL DEFAULT false,
  purchased       BOOLEAN NOT NULL DEFAULT false,
  quote           BOOLEAN NOT NULL DEFAULT false,
  lead_captured   BOOLEAN NOT NULL DEFAULT false,
  revenue         NUMERIC(12,2) NOT NULL DEFAULT 0,
  had_error       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_session_facts_business ON analytic_pulso.session_facts(business_id);
CREATE INDEX IF NOT EXISTS idx_session_facts_started ON analytic_pulso.session_facts(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_facts_visitor ON analytic_pulso.session_facts(visitor_id);
CREATE INDEX IF NOT EXISTS idx_session_facts_campaign ON analytic_pulso.session_facts(campaign_id);

-- ==============================================================================
-- 5. EVENTOS (registro atómico de comportamiento)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.events (
  id          BIGSERIAL PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL REFERENCES analytic_pulso.session_facts(id) ON DELETE CASCADE,
  visitor_id  TEXT NOT NULL,
  ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type  TEXT NOT NULL,                     -- 'page_view','click','scroll','quiz_step',...
  page        TEXT DEFAULT '/',
  label       TEXT DEFAULT '',
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb, -- coordenadas, scroll, códigos, etc.
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_session ON analytic_pulso.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_ts ON analytic_pulso.events(ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytic_pulso.events(event_type);

-- ==============================================================================
-- 6. CITAS Y ASISTENCIAS (registro del negocio)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.appointments (
  id              TEXT PRIMARY KEY,
  business_id     TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  visitor_id      TEXT NOT NULL,
  session_id      TEXT REFERENCES analytic_pulso.session_facts(id) ON DELETE SET NULL,
  campaign_id     TEXT REFERENCES analytic_pulso.campaigns(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_for   TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pendiente', -- pendiente|confirmada|atendida|no_asistio|cancelada|reagendada
  reminder        TEXT NOT NULL DEFAULT 'ninguno',   -- ninguno|24h|48h|24h+2h
  lead_time_hours NUMERIC(10,1) NOT NULL DEFAULT 0,
  source          TEXT DEFAULT 'directo'
);
CREATE INDEX IF NOT EXISTS idx_appointments_business ON analytic_pulso.appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON analytic_pulso.appointments(status);

-- ==============================================================================
-- 7. COMUNICACIONES Y SEGUIMIENTO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.communications (
  id               TEXT PRIMARY KEY,
  business_id      TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  visitor_id       TEXT NOT NULL,
  session_id       TEXT REFERENCES analytic_pulso.session_facts(id) ON DELETE SET NULL,
  channel          TEXT NOT NULL,                -- WhatsApp | Llamada | Email
  direction        TEXT NOT NULL DEFAULT 'saliente',
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  replied_at       TIMESTAMPTZ,
  responded        BOOLEAN NOT NULL DEFAULT false,
  status           TEXT NOT NULL DEFAULT 'enviado', -- pendiente|enviado|entregado|respondido|sin_respuesta
  outcome          TEXT NOT NULL DEFAULT 'pendiente', -- interesado|agendado|compro|no_interesado|sin_respuesta|pendiente
  first_contact    BOOLEAN NOT NULL DEFAULT false,
  minutes_to_reply INTEGER,
  notes            TEXT
);
CREATE INDEX IF NOT EXISTS idx_communications_business ON analytic_pulso.communications(business_id);

-- ==============================================================================
-- 8. VENTAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.sales (
  id             TEXT PRIMARY KEY,
  business_id    TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  visitor_id     TEXT NOT NULL,
  session_id     TEXT REFERENCES analytic_pulso.session_facts(id) ON DELETE SET NULL,
  campaign_id    TEXT REFERENCES analytic_pulso.campaigns(id) ON DELETE SET NULL,
  sold_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  product        TEXT NOT NULL,
  category       TEXT DEFAULT '',
  qty            INTEGER NOT NULL DEFAULT 1,
  price          NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  total          NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost           NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'Pagado total',
  seller         TEXT DEFAULT '',
  source         TEXT DEFAULT 'directo',
  first_touch_at TIMESTAMPTZ,
  days_to_close  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sales_business ON analytic_pulso.sales(business_id);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON analytic_pulso.sales(sold_at DESC);

-- ==============================================================================
-- 9. EXPERIMENTOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.experiments (
  id          TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  hypothesis  TEXT DEFAULT '',
  element     TEXT DEFAULT '',
  variants    JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{name,visitors,conversions}]
  metric      TEXT DEFAULT '',
  started_on  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_on    TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'borrador',   -- borrador|en_curso|finalizado
  result      TEXT DEFAULT '',
  confidence  INTEGER NOT NULL DEFAULT 0,
  decision    TEXT NOT NULL DEFAULT 'sin_decision', -- sin_decision|implementar|descartar|repetir
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_experiments_business ON analytic_pulso.experiments(business_id);

-- ==============================================================================
-- 10. SEGUIMIENTO DE MEJORAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.improvements (
  id             TEXT PRIMARY KEY,
  business_id    TEXT NOT NULL REFERENCES analytic_pulso.businesses(id) ON DELETE CASCADE,
  problem        TEXT NOT NULL,
  recommendation TEXT DEFAULT '',
  action         TEXT DEFAULT '',
  owner          TEXT DEFAULT '',
  implemented_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metric         TEXT DEFAULT '',
  before_value   NUMERIC(12,2) NOT NULL DEFAULT 0,
  after_value    NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit           TEXT NOT NULL DEFAULT '%',
  status         TEXT NOT NULL DEFAULT 'pendiente', -- pendiente|en_curso|implementada|evaluada
  conclusion     TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_improvements_business ON analytic_pulso.improvements(business_id);

-- ==============================================================================
-- 11. VISTAS DE ANÁLISIS GUARDADAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS analytic_pulso.saved_views (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_key  TEXT NOT NULL DEFAULT 'admin',      -- permite separar vistas por administrador
  name       TEXT NOT NULL,
  filters    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_saved_views_owner ON analytic_pulso.saved_views(owner_key);

-- ==============================================================================
-- 12. VISTAS DE LECTURA PARA DASHBOARDS
-- ==============================================================================
CREATE OR REPLACE VIEW analytic_pulso.v_daily_facts AS
SELECT
  s.business_id,
  date_trunc('day', s.started_at)::date AS day,
  count(*)                                        AS sessions,
  count(DISTINCT s.visitor_id)                    AS visitors,
  count(*) FILTER (WHERE s.lead_captured)         AS leads,
  count(*) FILTER (WHERE s.booked)                AS appointments,
  count(*) FILTER (WHERE s.attended)              AS attended,
  count(*) FILTER (WHERE s.purchased)             AS purchases,
  coalesce(sum(s.revenue) FILTER (WHERE s.purchased), 0) AS revenue
FROM analytic_pulso.session_facts s
GROUP BY 1, 2;

CREATE OR REPLACE VIEW analytic_pulso.v_campaign_facts AS
SELECT
  c.id                                            AS campaign_id,
  c.business_id,
  c.platform,
  c.name,
  c.spend                                         AS daily_spend,
  count(DISTINCT s.visitor_id)                    AS visitors,
  count(*) FILTER (WHERE s.lead_captured)         AS leads,
  count(*) FILTER (WHERE s.booked)                AS appointments,
  count(*) FILTER (WHERE s.purchased)             AS purchases,
  coalesce(sum(s.revenue) FILTER (WHERE s.purchased), 0) AS revenue
FROM analytic_pulso.campaigns c
LEFT JOIN analytic_pulso.session_facts s ON s.campaign_id = c.id
GROUP BY 1, 2, 3, 4, 5;

-- ==============================================================================
-- 13. SEGURIDAD — ROW LEVEL SECURITY
-- ------------------------------------------------------------------------------
-- Plataforma de administrador único: el rol anónimo (clave pública) solo LEE.
-- Toda escritura requiere rol `authenticated` o `service_role`.
-- Si en el futuro hay múltiples administradores, sustituir `true` por una
-- comprobación de pertenencia al negocio (auth.uid()).
-- ==============================================================================
ALTER TABLE analytic_pulso.businesses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.campaigns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.visitor_facts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.session_facts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.communications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.sales           ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.experiments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.improvements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytic_pulso.saved_views     ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'businesses','campaigns','visitor_facts','session_facts','events',
    'appointments','communications','sales','experiments','improvements','saved_views'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "read_analytics" ON analytic_pulso.%I', t);
    EXECUTE format('CREATE POLICY "read_analytics" ON analytic_pulso.%I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('DROP POLICY IF EXISTS "write_analytics" ON analytic_pulso.%I', t);
    EXECUTE format('CREATE POLICY "write_analytics" ON analytic_pulso.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- El rol anónimo nunca escribe
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytic_pulso FROM anon;

GRANT SELECT ON ALL TABLES IN SCHEMA analytic_pulso TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytic_pulso TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA analytic_pulso TO authenticated;

-- ==============================================================================
-- 14. SEED MÍNIMO — NEGOCIOS
-- ==============================================================================
INSERT INTO analytic_pulso.businesses (id, name, emoji, industry, has_local_crm, currency, accent, website)
VALUES
  ('optica', 'Óptica Johanna', '👁️', 'Salud Visual / Optometría', true,  'USD', '#38bdf8', 'optica-johanna.ec'),
  ('taller', 'Mecánica Luis',  '🔧', 'Taller Automotriz & Frenos', false, 'USD', '#f59e0b', 'mecanicaluis.ec')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  emoji = EXCLUDED.emoji,
  industry = EXCLUDED.industry,
  has_local_crm = EXCLUDED.has_local_crm,
  accent = EXCLUDED.accent,
  website = EXCLUDED.website;

-- ==============================================================================
-- 15. COMENTARIOS DE GOBERNANZA
-- ==============================================================================
COMMENT ON SCHEMA analytic_pulso IS 'Esquema analítico dedicado de Pulso Analytics. Separado del esquema operativo.';
COMMENT ON COLUMN analytic_pulso.visitor_facts.city IS 'Ubicación aproximada derivada de IP. Nunca GPS.';
COMMENT ON COLUMN analytic_pulso.visitor_facts.id IS 'Identificador seudónimo. No contiene datos personales.';
COMMENT ON COLUMN analytic_pulso.session_facts.quiz_steps IS 'Respuestas de evaluación. Puede contener datos de salud: acceso restringido.';
COMMENT ON COLUMN analytic_pulso.campaigns.spend IS 'Presupuesto DIARIO. El total del período se calcula multiplicando por los días.';
COMMENT ON COLUMN analytic_pulso.sales.total IS 'Importe de la venta. No equivale a utilidad ni a retorno publicitario.';
