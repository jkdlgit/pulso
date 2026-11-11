# Pulso Analytics

Plataforma de inteligencia de marketing y comportamiento, construida sobre el mismo diseño y stack de **Pulso**, con un esquema de datos dedicado (**`analytic_pulso`**) y un área **Analytics** de 22 módulos.

---

## Requisitos

- Node.js 18 o superior
- Acceso al proyecto Supabase de Pulso (misma URL y clave pública)

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<clave-anon>
VITE_ANALYTICS_SCHEMA=analytic_pulso
```

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon). Solo lectura por RLS. |
| `VITE_ANALYTICS_SCHEMA` | Esquema analítico. Por defecto `analytic_pulso`. |

> La app **no necesita** `VITE_ANALYTICS_SCHEMA` si se usa el valor por defecto.

## Modos de datos

| Modo | Cuándo aparece | Comportamiento |
|---|---|---|
| **Live** | El esquema `analytic_pulso` existe y tiene sesiones. | Lee datos reales del negocio. |
| **Demo** | No hay configuración o no hay datos. | Genera un conjunto determinista y muestra el aviso `MODO DEMO`. |

El modo se indica en la barra lateral y en **Privacidad y datos**.

## Base de datos

El script está en:

```text
supabase/analytics_schema.sql
```

Pasos:

1. Abrir Supabase Dashboard → **SQL Editor** → **New query**.
2. Pegar el contenido completo de `analytics_schema.sql`.
3. Ejecutar (**RUN**).
4. Verificar que el esquema `analytic_pulso` y sus tablas aparezcan en el explorador.

El script:

- Crea el esquema `analytic_pulso` separado de `dev` / `pro`.
- Crea 11 tablas: negocios, campañas, visitantes, sesiones, eventos, citas, comunicaciones, ventas, experimentos, mejoras y vistas guardadas.
- Crea 2 vistas de lectura: `v_daily_facts` y `v_campaign_facts`.
- Activa Row Level Security: lectura para `anon`, escritura para `authenticated`.
- Siembra los negocios `optica` y `taller`.

> No modifica ni elimina datos de la aplicación Pulso original.

## Desarrollo

```bash
npm run dev
```

La raíz redirige a `/analytics/overview`.

## Build

```bash
npm run build
npm run preview
```

## Módulos

| # | Ruta | Módulo |
|---|---|---|
| 01 | `/analytics/overview` | Overview |
| 02 | `/analytics/visitors` | Visitantes |
| 03 | `/analytics/live` | Actividad en vivo |
| 04 | `/analytics/acquisition` | Campañas |
| 05 | `/analytics/behavior` | Comportamiento |
| 06 | `/analytics/heatmaps` | Mapas de calor |
| 07 | `/analytics/replay` | Session replay |
| 08 | `/analytics/evaluations` | Evaluaciones |
| 09 | `/analytics/forms` | Formularios y leads |
| 10 | `/analytics/funnels` | Embudos |
| 11 | `/analytics/journeys` | Recorridos |
| 12 | `/analytics/appointments` | Citas |
| 13 | `/analytics/followup` | Seguimiento |
| 14 | `/analytics/sales` | Ventas |
| 15 | `/analytics/segments` | Segmentos |
| 16 | `/analytics/temporal` | Análisis temporal |
| 17 | `/analytics/devices` | Dispositivos |
| 18 | `/analytics/experiments` | Experimentos |
| 19 | `/analytics/insights` | AI Insights |
| 20 | `/analytics/improvements` | Seguimiento de mejoras |
| 21 | `/analytics/businesses` | Negocios |
| 22 | `/analytics/settings` | Privacidad y datos |

## Documentación funcional

La especificación completa (Entregables 1–9) está en:

```text
docs/ESPECIFICACION_FUNCIONAL_PULSO_ANALYTICS.md
```

Incluye estructura funcional, catálogo de datos, catálogo de eventos, catálogo de análisis, catálogo de visualizaciones, centro de inteligencia, casos de uso (óptica y taller), priorización y requisitos de calidad y control.

## Rutas heredadas de Pulso

Se mantienen para compatibilidad:

- `/site/:siteKey`
- `/site/:siteKey/live`
- `/site/:siteKey/leads`
- `/:clientSlug/:quizSlug`

## Notas

- `node_modules` puede ser un enlace al proyecto Pulso original; si se instala en otra máquina, ejecutar `npm install`.
- El archivo `.env` no debe versionarse.
