-- ============================================================================
-- PULSO ANALYTICS — Tabla de resoluciones de insights (Fase 2)
-- Ejecutar en Supabase SQL Editor (schema: public)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.insight_resolutions (
  id                   BIGSERIAL PRIMARY KEY,
  insight_key          TEXT NOT NULL UNIQUE,        -- Corresponde a Insight.id
  status               TEXT NOT NULL DEFAULT 'watching'
                         CHECK (status IN ('watching', 'resolved', 'reopened')),
  resolved_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note                 TEXT,                         -- Nota opcional del usuario
  leads_at_resolution  INTEGER NOT NULL DEFAULT 0,  -- Leads totales al momento de marcar
  reopen_threshold     INTEGER NOT NULL DEFAULT 20, -- Leads a esperar para verificar
  metric_snapshot      TEXT NOT NULL DEFAULT '',    -- Valor de métrica al resolver
  reopened_at          TIMESTAMPTZ,
  reopen_reason        TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index para consultas por estado
CREATE INDEX IF NOT EXISTS idx_insight_resolutions_status
  ON public.insight_resolutions (status);

-- RLS: solo usuarios autenticados pueden leer/escribir
ALTER TABLE public.insight_resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados pueden leer resoluciones"
  ON public.insight_resolutions FOR SELECT
  USING (true);

CREATE POLICY "Autenticados pueden insertar resoluciones"
  ON public.insight_resolutions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Autenticados pueden actualizar resoluciones"
  ON public.insight_resolutions FOR UPDATE
  USING (true);

CREATE POLICY "Autenticados pueden eliminar resoluciones"
  ON public.insight_resolutions FOR DELETE
  USING (true);

-- Grants para anon y authenticated
GRANT ALL ON public.insight_resolutions TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.insight_resolutions_id_seq TO anon, authenticated;
