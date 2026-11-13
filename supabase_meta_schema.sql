-- ============================================================================
-- PULSO ANALYTICS — Esquema de Métricas de Campañas y Audiencia de Meta Ads
-- Diseñado para almacenar métricas universales (independientes del formato)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pro.meta_campaign_insights (
    id BIGSERIAL PRIMARY KEY,
    campaign_id VARCHAR(64) NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    adset_name VARCHAR(255) DEFAULT 'Público Guayaquil',
    ad_name VARCHAR(255) DEFAULT 'Creativo Principal',
    quiz_target VARCHAR(32) NOT NULL, -- 'quiz1' | 'quiz2' | 'quiz3'
    date DATE NOT NULL,
    spend NUMERIC(10, 4) NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    reach INTEGER NOT NULL DEFAULT 0,
    frequency NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    cpm NUMERIC(10, 4) NOT NULL DEFAULT 0,
    inline_link_clicks INTEGER NOT NULL DEFAULT 0,
    cpc NUMERIC(10, 4) NOT NULL DEFAULT 0,
    ctr NUMERIC(5, 2) NOT NULL DEFAULT 0,
    landing_page_views INTEGER NOT NULL DEFAULT 0,
    cost_per_landing_page_view NUMERIC(10, 4) NOT NULL DEFAULT 0,
    post_engagements INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) DEFAULT 'Activo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_meta_camp_date UNIQUE (campaign_id, date)
);

CREATE TABLE IF NOT EXISTS pro.meta_demographic_insights (
    id BIGSERIAL PRIMARY KEY,
    campaign_id VARCHAR(64) NOT NULL,
    quiz_target VARCHAR(32) NOT NULL,
    date DATE NOT NULL,
    age_group VARCHAR(32) NOT NULL, -- '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
    gender VARCHAR(16) NOT NULL,    -- 'female', 'male'
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    spend NUMERIC(10, 4) NOT NULL DEFAULT 0,
    reach INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    landing_page_views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar permisos de lectura para el frontend de Pulso Analytics (rol anon)
GRANT SELECT ON pro.meta_campaign_insights TO anon, authenticated;
GRANT SELECT ON pro.meta_demographic_insights TO anon, authenticated;

-- ============================================================================
-- DATOS INICIALES REALES BASADOS EN TUS CAMPAÑAS ACTIVAS (Captura Facebook Ads)
-- ============================================================================

INSERT INTO pro.meta_campaign_insights 
(campaign_id, campaign_name, adset_name, ad_name, quiz_target, date, spend, impressions, reach, frequency, cpm, inline_link_clicks, cpc, ctr, landing_page_views, cost_per_landing_page_view, post_engagements, status)
VALUES 
(
    'camp_fb_quiz1_gye', 
    'Campaña Quiz 1 · Test Visual General', 
    'Público Guayaquil (+40 km)', 
    'Anuncio Quiz 1 Texto Negro', 
    'quiz1', 
    CURRENT_DATE, 
    1.40, 
    920, 
    876, 
    1.05, 
    1.52, 
    51, 
    0.027, 
    5.54, 
    50, 
    0.028, 
    438, 
    'Activo'
),
(
    'camp_fb_quiz2_gye', 
    'Campaña Quiz 2 · Agudeza Visual & Presbicia', 
    'Público Guayaquil (+40 km)', 
    'Anuncio Quiz 2 Amarillo', 
    'quiz2', 
    CURRENT_DATE, 
    1.56, 
    1340, 
    1260, 
    1.06, 
    1.16, 
    101, 
    0.015, 
    7.53, 
    87, 
    0.018, 
    753, 
    'Activo'
)
ON CONFLICT (campaign_id, date) DO UPDATE 
SET spend = EXCLUDED.spend,
    reach = EXCLUDED.reach,
    impressions = EXCLUDED.impressions,
    inline_link_clicks = EXCLUDED.inline_link_clicks,
    landing_page_views = EXCLUDED.landing_page_views;

-- Desglose demográfico real observado en tu anuncio:
-- Quiz 1 (56% Mujeres, 44% Hombres, distribución concentrada en 45-65+)
INSERT INTO pro.meta_demographic_insights (campaign_id, quiz_target, date, age_group, gender, percentage, spend, reach, impressions, clicks, landing_page_views)
VALUES
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '18-24', 'female', 1.5, 0.02, 13, 14, 1, 1),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '25-34', 'female', 3.0, 0.04, 26, 28, 2, 2),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '35-44', 'female', 4.5, 0.06, 39, 41, 3, 3),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '45-54', 'female', 11.0, 0.15, 96, 101, 6, 6),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '55-64', 'female', 16.0, 0.22, 140, 147, 9, 9),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '65+',   'female', 20.0, 0.28, 175, 184, 11, 11),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '18-24', 'male',   1.0, 0.01, 9, 9, 0, 0),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '25-34', 'male',   2.0, 0.03, 18, 18, 1, 1),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '35-44', 'male',   3.5, 0.05, 31, 32, 2, 2),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '45-54', 'male',   8.5, 0.12, 74, 78, 4, 4),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '55-64', 'male',   13.0, 0.18, 114, 120, 6, 6),
('camp_fb_quiz1_gye', 'quiz1', CURRENT_DATE, '65+',   'male',   16.0, 0.22, 140, 147, 7, 7),

-- Quiz 2 (61.6% Mujeres, 38.4% Hombres, distribución concentrada en 45-65+)
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '18-24', 'female', 1.0, 0.02, 13, 13, 1, 1),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '25-34', 'female', 2.5, 0.04, 32, 34, 3, 2),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '35-44', 'female', 4.5, 0.07, 57, 60, 5, 4),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '45-54', 'female', 10.5, 0.16, 132, 141, 11, 9),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '55-64', 'female', 18.0, 0.28, 227, 241, 19, 16),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '65+',   'female', 25.1, 0.39, 316, 336, 27, 23),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '18-24', 'male',   0.8, 0.01, 10, 11, 1, 1),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '25-34', 'male',   1.8, 0.03, 23, 24, 2, 1),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '35-44', 'male',   3.2, 0.05, 40, 43, 3, 3),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '45-54', 'male',   7.0, 0.11, 88, 94, 7, 6),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '55-64', 'male',   11.0, 0.17, 139, 147, 11, 10),
('camp_fb_quiz2_gye', 'quiz2', CURRENT_DATE, '65+',   'male',   14.6, 0.23, 184, 196, 11, 10);
