import { createRouter, createWebHistory } from 'vue-router'
import AnalyticsLayout from '../analytics/components/AnalyticsLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/analytics/overview' },
    {
      path: '/analytics',
      component: AnalyticsLayout,
      children: [
        { path: '', redirect: '/analytics/overview' },
        { path: 'overview', name: 'analytics-overview', component: () => import('../analytics/views/OverviewView.vue') },
        { path: 'visitors', name: 'analytics-visitors', component: () => import('../analytics/views/VisitorsView.vue') },
        { path: 'live', name: 'analytics-live', component: () => import('../analytics/views/LiveActivityView.vue') },
        { path: 'acquisition', name: 'analytics-acquisition', component: () => import('../analytics/views/AcquisitionView.vue') },
        { path: 'behavior', name: 'analytics-behavior', component: () => import('../analytics/views/BehaviorView.vue') },
        { path: 'heatmaps', name: 'analytics-heatmaps', component: () => import('../analytics/views/HeatmapsView.vue') },
        { path: 'replay', name: 'analytics-replay', component: () => import('../analytics/views/ReplayView.vue') },
        { path: 'evaluations', name: 'analytics-evaluations', component: () => import('../analytics/views/EvaluationsView.vue') },
        { path: 'forms', name: 'analytics-forms', component: () => import('../analytics/views/FormsView.vue') },
        { path: 'funnels', name: 'analytics-funnels', component: () => import('../analytics/views/FunnelsView.vue') },
        { path: 'journeys', name: 'analytics-journeys', component: () => import('../analytics/views/JourneysView.vue') },
        { path: 'appointments', name: 'analytics-appointments', component: () => import('../analytics/views/AppointmentsView.vue') },
        { path: 'followup', name: 'analytics-followup', component: () => import('../analytics/views/FollowupView.vue') },
        { path: 'sales', name: 'analytics-sales', component: () => import('../analytics/views/SalesView.vue') },
        { path: 'segments', name: 'analytics-segments', component: () => import('../analytics/views/SegmentsView.vue') },
        { path: 'temporal', name: 'analytics-temporal', component: () => import('../analytics/views/TemporalView.vue') },
        { path: 'devices', name: 'analytics-devices', component: () => import('../analytics/views/DevicesView.vue') },
        { path: 'experiments', name: 'analytics-experiments', component: () => import('../analytics/views/ExperimentsView.vue') },
        { path: 'insights', name: 'analytics-insights', component: () => import('../analytics/views/InsightsView.vue') },
        { path: 'improvements', name: 'analytics-improvements', component: () => import('../analytics/views/ImprovementsView.vue') },
        { path: 'businesses', name: 'analytics-businesses', component: () => import('../analytics/views/BusinessesView.vue') },
        { path: 'settings', name: 'analytics-settings', component: () => import('../analytics/views/SettingsView.vue') },
      ],
    },

    // 🧪 Quiz interactivo para alimentar la analítica en tiempo real
    { path: '/quiz3', name: 'quiz3-fatiga', component: () => import('../views/QuizFatigaView.vue') },

    // Compatibilidad con la app Pulso original
    { path: '/site/:siteKey', name: 'legacy-dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/site/:siteKey/live', name: 'legacy-live', component: () => import('../views/LiveView.vue') },
    { path: '/site/:siteKey/leads', name: 'legacy-leads', component: () => import('../views/LeadsView.vue') },
    { path: '/:clientSlug/:quizSlug', name: 'client-quiz-dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/:clientSlug/:quizSlug/live', name: 'client-quiz-live', component: () => import('../views/LiveView.vue') },
    { path: '/:clientSlug/:quizSlug/leads', name: 'client-quiz-leads', component: () => import('../views/LeadsView.vue') },
    { path: '/:clientSlug', name: 'client-dashboard', redirect: (to) => `/${to.params.clientSlug}/quiz1` },
  ],
})

export default router
