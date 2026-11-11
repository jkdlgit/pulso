/**
 * 📡 PULSO TRACKER v0.5 — DEDUPLICATED TELEMETRY
 * Control estricto de conversión única por sesión:
 * Si el usuario presiona "Agendar Cita" Y luego "WhatsApp", solo cuenta como 1 Reserva.
 */

(function () {
  'use strict';

  var PULSO_API_URL = 'http://localhost:5174/api/event';
  var SUPABASE_URL = 'https://hghhanfwdskkddtasiij.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaGhhbmZ3ZHNra2RkdGFzaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzE5MDAsImV4cCI6MjA5NzMwNzkwMH0.GQJxQBhYDWtUWNNaAOH104HMD_L_Votr46voP1YlH_s';
  var SUPABASE_SCHEMA = 'dev';

  // 1. Obtener script tag y configuración de Cliente y Quiz
  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('tracker.js') !== -1) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  })();

  var rawSite = currentScript ? (currentScript.getAttribute('data-site') || '') : '';
  var clientKey = currentScript ? (currentScript.getAttribute('data-client') || '') : '';
  var quizKey = currentScript ? (currentScript.getAttribute('data-quiz') || '') : '';

  if (!clientKey && !quizKey && rawSite) {
    if (rawSite.includes('/')) {
      var parts = rawSite.split('/');
      clientKey = parts[0];
      quizKey = parts[1];
    } else if (rawSite.includes('_')) {
      var parts = rawSite.split('_');
      clientKey = parts[0];
      quizKey = parts[1];
    } else {
      clientKey = 'opticajohanna';
      quizKey = rawSite;
    }
  }

  if (!clientKey) clientKey = 'opticajohanna';
  if (!quizKey) quizKey = 'quiz1';

  var siteKey = clientKey + '_' + quizKey;

  // 2. Sesión única persistente en la pestaña por Cliente y Quiz
  var SESSION_KEY = '_pulso_sid_' + clientKey + '_' + quizKey;
  var sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'ps_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // 3. Capturar UTMs
  var urlParams = new URLSearchParams(window.location.search);
  var utmSource = urlParams.get('utm_source') || '';
  var utmMedium = urlParams.get('utm_medium') || '';
  var utmCampaign = urlParams.get('utm_campaign') || '';

  function getDeviceType() {
    var ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
  }

  // 4. Emisión de eventos telemétricos
  function emitEvent(eventType, eventName, metadata) {
    var payload = {
      client_key: clientKey,
      quiz_key: quizKey,
      site_key: clientKey + '_' + quizKey,
      session_id: sessionId,
      event_type: eventType,
      event_name: eventName,
      page_url: window.location.href,
      referrer: document.referrer || '',
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      device: getDeviceType(),
      country: 'EC',
      metadata: metadata || {},
      created_at: new Date().toISOString()
    };

    console.log(
      '%c📡 [PULSO TRACKER]',
      'background: #0f172a; color: #38bdf8; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #38bdf8;',
      '[' + clientKey + '/' + quizKey + ']',
      eventType.toUpperCase(),
      eventName
    );

    // Enviar a la API local de Pulso
    try {
      fetch(PULSO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        keepalive: true
      }).catch(function () {});
    } catch (e) {}

    // Enviar a Supabase dev.events
    try {
      fetch(SUPABASE_URL + '/rest/v1/events', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Content-Profile': SUPABASE_SCHEMA,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  // 5. API pública con deduplicación por sesión
  window.pulso = {
    get clientKey() { return clientKey; },
    get quizKey() { return quizKey; },
    get siteKey() { return clientKey + '_' + quizKey; },
    sessionId: sessionId,

    setClientAndQuiz: function (newClient, newQuiz) {
      if (newClient) clientKey = newClient;
      if (newQuiz) quizKey = newQuiz;
      siteKey = clientKey + '_' + quizKey;
      SESSION_KEY = '_pulso_sid_' + clientKey + '_' + quizKey;
      sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = 'ps_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
        sessionStorage.setItem(SESSION_KEY, sessionId);
      }
      this.sessionId = sessionId;
      console.log('📡 [PULSO] Contexto cambiado a:', clientKey, '/', quizKey);
      this.visit();
    },

    setSite: function (newKey) {
      if (!newKey) return;
      if (newKey.includes('/')) {
        var p = newKey.split('/');
        this.setClientAndQuiz(p[0], p[1]);
      } else if (newKey.includes('_')) {
        var p = newKey.split('_');
        this.setClientAndQuiz(p[0], p[1]);
      } else {
        this.setClientAndQuiz('opticajohanna', newKey);
      }
    },

    // Visita única al entrar
    visit: function () {
      var lock = '_pulso_lock_visita_' + siteKey + '_' + sessionId;
      if (sessionStorage.getItem(lock)) return;
      sessionStorage.setItem(lock, '1');
      emitEvent('visita', 'Ingreso a URL');
    },

    step: function (stepNum, meta) {
      var lock = '_pulso_lock_step_' + stepNum + '_' + siteKey + '_' + sessionId;
      if (sessionStorage.getItem(lock)) return;
      sessionStorage.setItem(lock, '1');
      emitEvent('paso_' + stepNum, 'Avanzó a Paso ' + stepNum, meta);
    },

    completed: function (meta) {
      var lock = '_pulso_lock_completed_' + siteKey + '_' + sessionId;
      if (sessionStorage.getItem(lock)) return;
      sessionStorage.setItem(lock, '1');
      emitEvent('completado', 'Quiz Finalizado', meta);
    },

    // ⚡ RESERVA ÚNICA: Solo marca 1 vez aunque el usuario presione Agendar Y WhatsApp
    booking: function (meta) {
      var lock = '_pulso_lock_booking_' + siteKey + '_' + sessionId;
      if (sessionStorage.getItem(lock)) {
        console.log('📡 [PULSO] Reserva ya contabilizada para esta persona/sesión. Omitiendo duplicado.');
        return;
      }
      sessionStorage.setItem(lock, '1');
      emitEvent('reserva', 'Reserva / Contacto WhatsApp', meta);
    },

    lead: function (leadData) {
      emitEvent('lead', 'Lead Guardado', leadData);
    },

    track: function (eventName, meta) {
      emitEvent('custom', eventName, meta);
    }
  };

  // 6. Al renderizar la página, registrar VISITA única
  window.pulso.visit();

})();
