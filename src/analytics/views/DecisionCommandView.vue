<template>
  <PageHeader
    code="00 // EXECUTIVE COMMAND & DECISION AGENT"
    title="Centro de Mando de Optimización & Agente de Decisión"
    description="Auditoría forense integral que reconcilia la pauta de Meta Ads con la telemetría en vivo, los leads y las ventas reales en Óptica Johanna. Evalúa criticidades, detecta fugas de dinero y simula escenarios predictivos con IA."
  >
    <template #actions>
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="badge text-[9px] py-1 px-2.5 font-bold flex items-center gap-1.5"
          :class="commandData.healthScore >= 75 ? 'badge-green' : commandData.healthScore >= 55 ? 'badge-amber' : 'badge-rose'"
        >
          <span>PUNTAJE DE SALUD:</span>
          <strong class="text-xs">{{ commandData.healthScore }} / 100</strong>
        </span>

        <span
          class="badge text-[9px] py-1 px-2.5 flex items-center gap-1.5"
          :class="commandData.globalConfidence >= 75 ? 'badge-cyan' : 'badge-amber'"
        >
          <span>CONFIANZA ESTADÍSTICA:</span>
          <strong>{{ commandData.globalConfidence }}%</strong>
          <span class="text-[8px] opacity-75">({{ commandData.globalConfidence >= 75 ? 'ALTA' : 'EN RECOLECCIÓN' }})</span>
        </span>
      </div>
    </template>

    <!-- RESUMEN EJECUTIVO DE LA IA -->
    <div class="hud-card mb-4 border-l-2 border-l-cyan-400 bg-gradient-to-r from-cyan-950/20 via-pulso-void to-pulso-void">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-sm flex-shrink-0">
          🧠
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-tech text-xs tracking-wider uppercase text-cyan-200 font-bold">
              Diagnóstico Ejecutivo del Agente de Inteligencia
            </h4>
            <span class="text-[8px] font-mono text-slate-500">AUDITORÍA TIEMPO REAL · MATRIZ GUAYAQUIL</span>
          </div>
          <p class="text-[11px] font-mono text-slate-300 leading-relaxed">
            {{ commandData.executiveSummary }}
          </p>
        </div>
      </div>
    </div>

    <!-- 1. TABLERO DE RECONCILIACIÓN FORENSE (100% DINÁMICO POR CADA QUIZ) -->
    <div class="hud-card mb-4">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            1. Reconciliación de Embudo: Meta Ads ↔ Telemetría Web ↔ Pacientes en Clínica
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Detección automática de quizzes activos · Desglose comparativo de costos y conversiones unitarias
          </p>
        </div>
        <span class="badge badge-cyan text-[9px]">{{ commandData.reconciliations.length }} QUIZZES DETECTADOS</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left font-mono text-[10px] border-collapse">
          <thead>
            <tr class="border-b border-pulso-border/70 text-slate-500 uppercase tracking-wider text-[8px] bg-pulso-void/50">
              <th class="py-2 px-2.5">Variante / Quiz</th>
              <th class="py-2 px-2 text-right">Inversión Meta</th>
              <th class="py-2 px-2 text-right">Clics</th>
              <th class="py-2 px-2 text-right">Llegada Web</th>
              <th class="py-2 px-2 text-right">Inicios</th>
              <th class="py-2 px-2 text-right">Completados</th>
              <th class="py-2 px-2 text-right">Leads</th>
              <th class="py-2 px-2 text-right">CPL Real</th>
              <th class="py-2 px-2 text-right">Citas</th>
              <th class="py-2 px-2 text-right">Costo Cita</th>
              <th class="py-2 px-2 text-right">Ventas</th>
              <th class="py-2 px-2 text-right">ROAS</th>
              <th class="py-2 px-2 text-center">Confianza</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-pulso-border/30">
            <tr
              v-for="r in commandData.reconciliations"
              :key="r.quizKey"
              class="hover:bg-pulso-void/40 transition-colors"
            >
              <td class="py-2.5 px-2.5 font-bold text-slate-200">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full" :class="r.quizKey === 'quiz2' ? 'bg-violet-400' : 'bg-cyan-400'"></span>
                  <span>{{ r.quizName }}</span>
                </div>
              </td>
              <td class="py-2.5 px-2 text-right text-rose-300 font-bold">{{ currency(r.metaSpend) }}</td>
              <td class="py-2.5 px-2 text-right text-slate-300">{{ number(r.metaClicks) }}</td>
              <td class="py-2.5 px-2 text-right">
                <span class="font-bold" :class="r.arrivalEfficiency >= 90 ? 'text-emerald-300' : 'text-amber-300'">
                  {{ r.webSessions }} <span class="text-[8px] font-normal">({{ r.arrivalEfficiency }}%)</span>
                </span>
              </td>
              <td class="py-2.5 px-2 text-right text-slate-300">
                {{ r.quizStarts }} <span class="text-[8px] text-slate-500">({{ r.startRate }}%)</span>
              </td>
              <td class="py-2.5 px-2 text-right text-slate-300">
                {{ r.quizCompletes }} <span class="text-[8px] text-slate-500">({{ r.completionRate }}%)</span>
              </td>
              <td class="py-2.5 px-2 text-right text-emerald-300 font-bold">{{ r.leads }}</td>
              <td class="py-2.5 px-2 text-right font-bold" :class="r.cplReal > 0 && r.cplReal < 1 ? 'text-emerald-300' : 'text-amber-300'">
                {{ r.cplReal > 0 ? currency(r.cplReal) : '—' }}
              </td>
              <td class="py-2.5 px-2 text-right text-cyan-300 font-bold">{{ r.appointments }}</td>
              <td class="py-2.5 px-2 text-right font-bold text-slate-300">
                {{ r.costPerAppointment > 0 ? currency(r.costPerAppointment) : '—' }}
              </td>
              <td class="py-2.5 px-2 text-right text-slate-200 font-bold">{{ r.sales }}</td>
              <td class="py-2.5 px-2 text-right font-bold" :class="r.roasReal >= 1 ? 'text-emerald-300' : 'text-rose-300'">
                {{ r.roasReal > 0 ? `${r.roasReal}x` : '—' }}
              </td>
              <td class="py-2.5 px-2 text-center">
                <span
                  class="badge text-[8px] py-0 px-1.5"
                  :class="r.confidenceStatus === 'alta' ? 'badge-green' : r.confidenceStatus === 'media' ? 'badge-cyan' : 'badge-amber'"
                >
                  {{ r.confidenceLevel }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. RADAR DE BRECHAS Y FUGAS (DISCREPANCY GAPS) -->
    <div class="hud-card mb-4">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            2. Radar Forense de Discrepancias y Fugas de Dinero
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Diferencia entre lo que cobra la plataforma y lo que realmente llega al negocio
          </p>
        </div>
        <span class="text-[9px] font-mono text-slate-500">{{ commandData.gaps.length }} BRECHAS AUDITADAS</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          v-for="gap in commandData.gaps"
          :key="gap.id"
          class="p-3 rounded-lg bg-pulso-void/70 border border-pulso-border/70 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[8px] font-mono uppercase text-slate-500 tracking-wider">{{ gap.stage }}</span>
              <span class="badge text-[8px] py-0 px-1.5" :class="gap.severity === 'alta' ? 'badge-rose' : 'badge-amber'">
                -{{ gap.gapPct }}% FUGA
              </span>
            </div>
            <p class="text-[10px] font-mono font-bold text-slate-200 mb-1 leading-snug">
              {{ gap.impactSummary }}
            </p>
            <p class="text-[9px] font-mono text-slate-400 leading-relaxed mb-2">
              <strong class="text-slate-500">Causa:</strong> {{ gap.rootCause }}
            </p>
          </div>

          <div class="pt-2 border-t border-pulso-border/40">
            <button
              @click="toggleGapWhy(gap.id)"
              class="text-[9px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center justify-between w-full transition-colors"
            >
              <span>{{ activeGapId === gap.id ? 'OCULTAR EXPLICACIÓN IA ▲' : '¿POR QUÉ OCURRE ESTO? ▼' }}</span>
              <span>🤖</span>
            </button>
            <div
              v-if="activeGapId === gap.id"
              class="mt-2 p-2 rounded bg-pulso-surface/80 border border-cyan-500/30 text-[9px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap animate-fade-in"
            >
              {{ gap.whyExplanation }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. SEMÁFORO DE CRITICIDAD (P1 / P2 / P3) -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <!-- Columna P1 Urgente -->
      <div class="hud-card border-t-2 border-t-rose-500">
        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-pulso-border/50">
          <span class="font-tech text-xs font-bold text-rose-300 flex items-center gap-1.5">
            <span>🚨</span> P1 · REQUERIDO URGENTE
          </span>
          <span class="badge badge-rose text-[8px]">ACCIÓN HOY</span>
        </div>
        <div class="space-y-2.5">
          <div
            v-for="item in p1Items"
            :key="item.id"
            class="p-2.5 rounded bg-pulso-void/70 border border-rose-500/30 text-[9px] font-mono leading-relaxed"
          >
            <p class="font-bold text-rose-200 mb-1">{{ item.title }}</p>
            <p class="text-slate-400 mb-1.5">{{ item.evidence }}</p>
            <div class="p-1.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 mb-1.5">
              <strong>Impacto:</strong> {{ item.dollarImpactEstimate }}
            </div>
            <p class="text-slate-300"><strong class="text-cyan-400">Solución:</strong> {{ item.recommendation }}</p>
          </div>
          <div v-if="p1Items.length === 0" class="text-[9px] font-mono text-slate-500 italic py-2 text-center">
            Sin alertas críticas P1 en este momento.
          </div>
        </div>
      </div>

      <!-- Columna P2 Alerta -->
      <div class="hud-card border-t-2 border-t-amber-500">
        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-pulso-border/50">
          <span class="font-tech text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <span>⚠️</span> P2 · ALERTA & CONVERSIÓN
          </span>
          <span class="badge badge-amber text-[8px]">ESTANCADO</span>
        </div>
        <div class="space-y-2.5">
          <div
            v-for="item in p2Items"
            :key="item.id"
            class="p-2.5 rounded bg-pulso-void/70 border border-amber-500/30 text-[9px] font-mono leading-relaxed"
          >
            <p class="font-bold text-amber-200 mb-1">{{ item.title }}</p>
            <p class="text-slate-400 mb-1.5">{{ item.evidence }}</p>
            <div class="p-1.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-1.5">
              <strong>Impacto:</strong> {{ item.dollarImpactEstimate }}
            </div>
            <p class="text-slate-300"><strong class="text-cyan-400">Solución:</strong> {{ item.recommendation }}</p>
          </div>
          <div v-if="p2Items.length === 0" class="text-[9px] font-mono text-slate-500 italic py-2 text-center">
            Sin estancamientos P2 detectados.
          </div>
        </div>
      </div>

      <!-- Columna P3 Oportunidad / Positivo -->
      <div class="hud-card border-t-2 border-t-emerald-500">
        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-pulso-border/50">
          <span class="font-tech text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <span>✅</span> P3 · LO QUE ESTÁ FUNCIONANDO
          </span>
          <span class="badge badge-green text-[8px]">PROTEGER</span>
        </div>
        <div class="space-y-2.5">
          <div
            v-for="item in p3Items"
            :key="item.id"
            class="p-2.5 rounded bg-pulso-void/70 border border-emerald-500/30 text-[9px] font-mono leading-relaxed"
          >
            <p class="font-bold text-emerald-200 mb-1">{{ item.title }}</p>
            <p class="text-slate-400 mb-1.5">{{ item.evidence }}</p>
            <div class="p-1.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-1.5">
              <strong>Beneficio:</strong> {{ item.dollarImpactEstimate }}
            </div>
            <p class="text-slate-300"><strong class="text-cyan-400">Instrucción:</strong> {{ item.recommendation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. SIMULADOR PREDICTIVO INTERACTIVO ("¿QUÉ PASARÍA SI...?") -->
    <div class="hud-card mb-4">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            4. Simulador Predictivo con IA: Proyección de Resultados por Optimización
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Cálculo matemático de cuánto aumentan tus citas y facturación si eliminamos puntos de fricción
          </p>
        </div>
        <span class="badge badge-violet text-[9px]">MOTOR PREDICTIVO</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="sim in commandData.simulations"
          :key="sim.id"
          class="p-3 rounded-lg bg-pulso-void/70 border border-pulso-border/80 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-xs text-slate-200">{{ sim.title }}</span>
              <span class="badge badge-cyan text-[8px]">{{ sim.quizKey.toUpperCase() }}</span>
            </div>
            <p class="text-[9px] font-mono text-violet-300 mb-3">
              🎯 Palanca: {{ sim.lever }}
            </p>

            <div class="grid grid-cols-3 gap-2 text-center font-mono my-2">
              <div class="p-2 rounded bg-pulso-void border border-pulso-border/40">
                <span class="text-[8px] text-slate-500 block uppercase">Leads Proyectados</span>
                <span class="text-sm font-bold text-emerald-300">+{{ sim.projectedLeads }}</span>
              </div>
              <div class="p-2 rounded bg-pulso-void border border-pulso-border/40">
                <span class="text-[8px] text-slate-500 block uppercase">Citas Nuevas</span>
                <span class="text-sm font-bold text-cyan-300">+{{ sim.projectedAppointments }} citas</span>
              </div>
              <div class="p-2 rounded bg-pulso-void border border-pulso-border/40">
                <span class="text-[8px] text-slate-500 block uppercase">Ingreso Extra Estimado</span>
                <span class="text-sm font-bold text-amber-300">{{ currency(sim.projectedRevenue) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-pulso-border/40 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>Nuevo CPL Proyectado: <strong class="text-emerald-300">{{ currency(sim.projectedCpl) }}</strong></span>
            <span class="text-slate-500">Ticket promedio base: $120</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. NUEVO MÓDULO: MOTOR DE INTELIGENCIA DE PRODUCTO & BENCHMARKING DE MERCADO CON IA -->
    <div class="hud-card mb-4 border-l-2 border-l-violet-400">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            5. Configuración de Producto & Motor de Crecimiento Estratégico (IA)
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Ingresa el producto/servicio que estás impulsando. La IA cruzará sus características con la data real de Guayaquil y generará un plan 360°.
          </p>
        </div>
        <span class="badge badge-violet text-[9px]">PERSISTENTE</span>
      </div>

      <!-- Plantillas rápidas -->
      <div class="mb-3 flex items-center gap-2 flex-wrap">
        <span class="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Cargar plantilla:</span>
        <button
          @click="loadPreset('progresivos')"
          class="px-2.5 py-1 rounded bg-violet-500/10 border border-violet-500/30 text-[9px] font-mono text-violet-300 hover:bg-violet-500/20 transition-colors"
        >
          👓 Lentes Progresivos / Presbicia (+45 años)
        </button>
        <button
          @click="loadPreset('luz_azul')"
          class="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 hover:bg-cyan-500/20 transition-colors"
        >
          💻 Lentes con Filtro Luz Azul / Pantallas
        </button>
        <button
          @click="loadPreset('examen')"
          class="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 hover:bg-emerald-500/20 transition-colors"
        >
          🔬 Examen Visual Computarizado + Aros
        </button>
      </div>

      <!-- Formulario de Configuración de Producto -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3 text-[10px] font-mono">
        <div>
          <label class="text-[8px] text-slate-500 uppercase block mb-1">Producto o Servicio Promovido</label>
          <input
            v-model="productForm.productName"
            @change="saveProductForm"
            placeholder="Ej: Lentes Progresivos Digitales..."
            class="w-full bg-pulso-void border border-pulso-border rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-400 placeholder-slate-600"
          />
        </div>

        <div>
          <label class="text-[8px] text-slate-500 uppercase block mb-1">Público / Síntoma Objetivo</label>
          <input
            v-model="productForm.targetAudience"
            @change="saveProductForm"
            placeholder="Ej: Adultos 45-65 años con vista cansada..."
            class="w-full bg-pulso-void border border-pulso-border rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-400 placeholder-slate-600"
          />
        </div>

        <div>
          <label class="text-[8px] text-slate-500 uppercase block mb-1">Oferta / Paquete / Gancho Comercial</label>
          <input
            v-model="productForm.priceOrOffer"
            @change="saveProductForm"
            placeholder="Ej: Aros + Lunas con examen gratis..."
            class="w-full bg-pulso-void border border-pulso-border rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-400 placeholder-slate-600"
          />
        </div>

        <div>
          <label class="text-[8px] text-slate-500 uppercase block mb-1">Objetivo Primario</label>
          <select
            v-model="productForm.primaryGoal"
            @change="saveProductForm"
            class="w-full bg-pulso-void border border-pulso-border rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-400"
          >
            <option value="citas">Agendar Citas en Consultorio</option>
            <option value="leads">Captar Leads Cualificados</option>
            <option value="ventas">Ventas de Ticket Alto ($100+)</option>
          </select>
        </div>
      </div>

      <!-- Botón de Ejecución de Estrategia con IA -->
      <div class="flex items-center justify-between pt-2 border-t border-pulso-border/50">
        <span class="text-[8px] font-mono text-slate-500">
          Estado: {{ productForm.productName ? 'Configuración guardada en navegador' : 'Sin configurar' }}
        </span>
        <button
          @click="runStrategyAudit"
          :disabled="strategyLoading || !productForm.productName"
          class="btn-hud text-[10px] py-2 px-4 flex items-center gap-2 disabled:opacity-40"
        >
          <span>{{ strategyLoading ? 'INVESTIGANDO CON IA...' : 'GENERAR ESTRATEGIA Y MEJORAS CON IA ⚡' }}</span>
        </button>
      </div>

      <!-- RESULTADOS DEL ANÁLISIS ESTRATÉGICO 360° -->
      <div v-if="strategyResult" class="mt-4 pt-3 border-t border-pulso-border/60 animate-fade-in">
        <!-- Pestañas de Navegación del Plan -->
        <div class="flex items-center gap-2 mb-3 border-b border-pulso-border/50 pb-2">
          <button
            @click="activeStrategyTab = 'segmentacion'"
            class="px-2.5 py-1 rounded text-[9px] font-mono transition-colors"
            :class="activeStrategyTab === 'segmentacion' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'"
          >
            🎯 1. PÚBLICO & META ADS
          </button>
          <button
            @click="activeStrategyTab = 'copywriting'"
            class="px-2.5 py-1 rounded text-[9px] font-mono transition-colors"
            :class="activeStrategyTab === 'copywriting' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'"
          >
            ✍️ 2. MEJORAS EN EL QUIZ
          </button>
          <button
            @click="activeStrategyTab = 'oferta'"
            class="px-2.5 py-1 rounded text-[9px] font-mono transition-colors"
            :class="activeStrategyTab === 'oferta' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'"
          >
            🎁 3. INGENIERÍA DE OFERTA
          </button>
          <button
            @click="activeStrategyTab = 'whatsapp'"
            class="px-2.5 py-1 rounded text-[9px] font-mono transition-colors"
            :class="activeStrategyTab === 'whatsapp' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'"
          >
            💬 4. GUION WHATSAPP
          </button>
        </div>

        <!-- Contenido 1: Segmentación Meta Ads -->
        <div v-if="activeStrategyTab === 'segmentacion'" class="space-y-2.5 text-[10px] font-mono">
          <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
            <span class="text-[8px] text-cyan-400 uppercase tracking-wider block mb-1">Edades & Género Recomendados</span>
            <p class="text-slate-200 font-bold">{{ strategyResult.metaAudienceStrategy.recommendedAges }}</p>
            <p class="text-slate-400 mt-0.5">{{ strategyResult.metaAudienceStrategy.genderFocus }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
              <span class="text-[8px] text-emerald-400 uppercase tracking-wider block mb-1">Intereses Clave en Meta Ads</span>
              <ul class="list-disc list-inside space-y-0.5 text-slate-300">
                <li v-for="it in strategyResult.metaAudienceStrategy.interests" :key="it">{{ it }}</li>
              </ul>
            </div>
            <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
              <span class="text-[8px] text-rose-400 uppercase tracking-wider block mb-1">Exclusiones & Ubicaciones</span>
              <ul class="list-disc list-inside space-y-0.5 text-slate-300">
                <li v-for="ex in strategyResult.metaAudienceStrategy.exclusions" :key="ex">{{ ex }}</li>
              </ul>
            </div>
          </div>
          <p class="text-[9px] text-slate-400 italic bg-pulso-void/40 p-2 rounded border border-pulso-border/30">
            💡 Fundamento con tu data real: {{ strategyResult.metaAudienceStrategy.rationale }}
          </p>
        </div>

        <!-- Contenido 2: Mejoras en el Quiz -->
        <div v-if="activeStrategyTab === 'copywriting'" class="space-y-2.5 text-[10px] font-mono">
          <div class="p-2.5 rounded bg-cyan-500/10 border border-cyan-500/30">
            <span class="text-[8px] text-cyan-400 uppercase tracking-wider block mb-1">Titular Ganador para la Portada</span>
            <p class="text-xs font-bold text-slate-100">"{{ strategyResult.quizOptimization.winningHeadline }}"</p>
            <p class="text-[9px] text-slate-400 mt-1">{{ strategyResult.quizOptimization.subheadline }}</p>
          </div>
          <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
            <span class="text-[8px] text-cyan-400 uppercase tracking-wider block mb-1.5">3 Preguntas de Síntoma de Alta Conversión</span>
            <div class="space-y-1.5">
              <div v-for="(q, idx) in strategyResult.quizOptimization.diagnosticQuestions" :key="idx" class="p-1.5 rounded bg-pulso-void border border-pulso-border/40 text-slate-300">
                {{ q }}
              </div>
            </div>
          </div>
          <p class="text-[9px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
            ⚡ Ajuste de Fricción: {{ strategyResult.quizOptimization.frictionFix }}
          </p>
        </div>

        <!-- Contenido 3: Ingeniería de Oferta -->
        <div v-if="activeStrategyTab === 'oferta'" class="space-y-2.5 text-[10px] font-mono">
          <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
            <span class="text-[8px] text-amber-400 uppercase tracking-wider block mb-1">Estructura del Combo / Oferta</span>
            <p class="text-slate-200 leading-relaxed font-bold">{{ strategyResult.offerEngineering.bundleOffer }}</p>
          </div>
          <div class="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            <span class="text-[8px] text-emerald-400 uppercase tracking-wider block mb-1">Eliminación de Riesgo (Garantía de Adaptación)</span>
            <p class="text-emerald-200 leading-relaxed">{{ strategyResult.offerEngineering.riskReversal }}</p>
          </div>
          <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
            <span class="text-[8px] text-violet-400 uppercase tracking-wider block mb-1">Gancho de Urgencia en Consultorio</span>
            <p class="text-slate-300 leading-relaxed">{{ strategyResult.offerEngineering.urgencyHook }}</p>
          </div>
        </div>

        <!-- Contenido 4: Guion WhatsApp -->
        <div v-if="activeStrategyTab === 'whatsapp'" class="space-y-2.5 text-[10px] font-mono">
          <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[8px] text-emerald-400 uppercase tracking-wider">Primer Mensaje (Dentro de los primeros 5 minutos)</span>
              <button
                @click="copyScript(strategyResult.whatsappClosingScript.firstMessageTemplate)"
                class="badge badge-cyan text-[8px] cursor-pointer"
              >
                {{ copySuccess ? '¡COPIADO!' : 'COPIAR MENSAJE' }}
              </button>
            </div>
            <pre class="bg-pulso-void p-2.5 rounded border border-pulso-border/40 text-[9px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{{ strategyResult.whatsappClosingScript.firstMessageTemplate }}</pre>
          </div>
          <div class="p-2.5 rounded bg-pulso-void/70 border border-pulso-border/60">
            <span class="text-[8px] text-slate-400 uppercase tracking-wider block mb-1">Mensaje de Recordatorio / Seguimiento (24 Horas)</span>
            <pre class="bg-pulso-void p-2.5 rounded border border-pulso-border/40 text-[9px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed">{{ strategyResult.whatsappClosingScript.followupReminder }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. AGENTE DE DECISIÓN IA INTERACTIVO (CONSULTOR ESTRATÉGICO) -->
    <div class="hud-card">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-pulso-border/50">
        <div>
          <h3 class="font-tech text-xs tracking-wider uppercase text-slate-200 font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
            6. Agente Consultor de Decisiones Estratégicas (Interrogatorio IA)
          </h3>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">
            Pregunta al agente sobre distribución de presupuesto, experimentos A/B o cómo duplicar pacientes
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="showApiKeyModal = !showApiKeyModal"
            class="px-2.5 py-1 rounded border border-pulso-border/70 hover:border-violet-400 text-[8px] font-mono text-slate-300 hover:text-violet-200 flex items-center gap-1.5 transition-colors bg-pulso-void"
            title="Conectar API Key de Gemini o modelo de IA externa"
          >
            <span>⚙️</span>
            <span>{{ hasCustomApiKey ? 'GEMINI 1.5 (CLOUD)' : 'MOTOR FORENSE (LOCAL)' }}</span>
          </button>
          <span class="badge badge-violet text-[9px]">ONLINE</span>
        </div>
      </div>

      <!-- Panel de Configuración de API Key de IA -->
      <div v-if="showApiKeyModal" class="mb-3 p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-mono font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔑</span> Conectar Modelo de IA en la Nube (Google Gemini)
          </span>
          <button @click="showApiKeyModal = false" class="text-slate-500 hover:text-slate-300 text-[10px]">✕</button>
        </div>
        <p class="text-[9px] font-mono text-slate-400 mb-2.5 leading-relaxed">
          Ingresa tu <strong>Google Gemini API Key</strong> (gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-cyan-400 underline hover:text-cyan-300 font-bold">Google AI Studio</a> en 30 segundos). Si la conectas, el Agente responderá con Gemini 1.5 en tiempo real. Si no tienes una, el sistema responde con el <strong>Motor Forense Analítico Local</strong>.
        </p>
        <div class="flex flex-wrap gap-2 mb-2">
          <input
            v-model="apiKeyInput"
            type="password"
            placeholder="Pega tu Gemini API Key (ej: AIzaSy...)"
            class="flex-1 min-w-[200px] bg-pulso-void border border-pulso-border rounded px-2.5 py-1.5 text-[9px] font-mono text-slate-200 focus:outline-none focus:border-violet-400"
          />
          <button
            @click="handleTestKey"
            :disabled="testLoading || !apiKeyInput.trim()"
            class="px-2.5 py-1 rounded bg-pulso-void border border-pulso-border hover:border-violet-400 text-slate-300 hover:text-violet-200 text-[9px] font-mono transition-colors disabled:opacity-40"
          >
            {{ testLoading ? 'PROBANDO...' : 'PROBAR CONEXIÓN' }}
          </button>
          <button @click="saveApiKey" class="btn-hud text-[9px] py-1.5 px-3">
            GUARDAR
          </button>
          <button v-if="hasCustomApiKey" @click="clearApiKey" class="text-[9px] font-mono px-2 py-1 text-rose-400 hover:text-rose-200">
            DESCONECTAR
          </button>
        </div>
        <div v-if="testResultMsg" class="text-[9px] font-mono p-2 rounded" :class="testSuccess ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'">
          {{ testResultMsg }}
        </div>
      </div>

      <!-- Historial de Conversación -->
      <div ref="chatScrollRef" class="max-h-80 overflow-y-auto space-y-2.5 pr-2 mb-3">
        <div v-if="chatMessages.length === 0" class="text-[10px] font-mono text-slate-500 italic py-4 text-center">
          💡 Sugerencias de consulta rápida:
          <div class="flex flex-wrap justify-center gap-2 mt-2">
            <button
              v-for="prompt in suggestedPrompts"
              :key="prompt"
              @click="askQuick(prompt)"
              class="px-2.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 text-[9px] font-mono transition-colors"
            >
              "{{ prompt }}"
            </button>
          </div>
        </div>

        <div v-for="msg in chatMessages" :key="msg.id" class="text-[10px] font-mono leading-relaxed">
          <div v-if="msg.role === 'user'" class="flex justify-end">
            <span class="inline-block bg-violet-500/20 border border-violet-500/30 rounded-lg px-3 py-1.5 text-violet-200 max-w-[85%]">
              {{ msg.content }}
            </span>
          </div>
          <div v-else class="flex justify-start">
            <div
              class="bg-pulso-void/95 border border-pulso-border/80 rounded-lg p-3.5 text-slate-200 max-w-[98%] text-[10px] leading-relaxed shadow-lg overflow-x-auto space-y-1.5 font-sans"
              v-html="renderMarkdown(msg.content)"
            ></div>
          </div>
        </div>

        <div v-if="aiLoading" class="text-[10px] font-mono text-violet-400 animate-pulse flex items-center gap-2">
          <span>🤖</span><span>El Agente de Decisión está calculando la respuesta con datos reales...</span>
        </div>
      </div>

      <!-- Input de Chat -->
      <div class="flex gap-2">
        <input
          v-model="chatInput"
          @keyup.enter="handleSendChat"
          :disabled="aiLoading"
          placeholder="Pregunta algo al Agente (ej: ¿En qué quiz debo invertir más presupuesto hoy?)..."
          class="flex-1 bg-pulso-void border border-pulso-border rounded-lg px-3 py-2 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-violet-400 placeholder-slate-600 disabled:opacity-50"
        />
        <button
          @click="handleSendChat"
          :disabled="aiLoading || !chatInput.trim()"
          class="btn-hud text-[10px] py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CONSULTAR →
        </button>
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import { useAnalytics } from '../store'
import { computeOptimizationCommandCenter, currency, number } from '../engine'
import {
  askDecisionAdvisor,
  generateProductStrategyPlan,
  testGeminiApiKey,
  type ChatMessage,
  type ProductStrategyConfig,
  type StrategicAuditResult,
} from '../aiAdvisor'

const { dataset, filtered } = useAnalytics()

// Motor del Centro de Mando Dinámico
const commandData = computed(() => computeOptimizationCommandCenter(dataset.value, filtered.value))

const p1Items = computed(() => commandData.value.criticalities.filter(c => c.level === 'P1'))
const p2Items = computed(() => commandData.value.criticalities.filter(c => c.level === 'P2'))
const p3Items = computed(() => commandData.value.criticalities.filter(c => c.level === 'P3'))

// Toggle de explicación forense
const activeGapId = ref<string | null>(null)
function toggleGapWhy(id: string) {
  activeGapId.value = activeGapId.value === id ? null : id
}

// --- Módulo de Estrategia de Producto Persistente ---
const PRODUCT_STORAGE_KEY = 'pulso_product_strategy_v1'
const productForm = ref<ProductStrategyConfig>({
  productName: 'Lentes Progresivos Digitales Premium',
  category: 'Presbicia & Salud Visual',
  targetAudience: 'Adultos de 45 a 65+ años en Guayaquil con dificultad para leer de cerca',
  priceOrOffer: 'Aros seleccionados + Lunas Progresivas con Examen Computarizado gratis',
  primaryGoal: 'citas',
})

const strategyLoading = ref(false)
const strategyResult = ref<StrategicAuditResult | null>(null)
const activeStrategyTab = ref<'segmentacion' | 'copywriting' | 'oferta' | 'whatsapp'>('segmentacion')
const copySuccess = ref(false)

onMounted(() => {
  try {
    const saved = localStorage.getItem(PRODUCT_STORAGE_KEY)
    if (saved) {
      productForm.value = JSON.parse(saved)
    }
    // Generar plan inicial automáticamente con la data actual
    runStrategyAudit()
  } catch { /* noop */ }
})

function saveProductForm() {
  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(productForm.value))
  } catch { /* noop */ }
}

function loadPreset(type: 'progresivos' | 'luz_azul' | 'examen') {
  if (type === 'progresivos') {
    productForm.value = {
      productName: 'Lentes Progresivos Digitales Premium',
      category: 'Presbicia & Visión Cerca/Lejos',
      targetAudience: 'Adultos mayores de 45 años en Guayaquil que alejan el celular para leer',
      priceOrOffer: 'Aros italianos + Lunas Progresivas HD + Examen Visual Computarizado gratis',
      primaryGoal: 'citas',
    }
  } else if (type === 'luz_azul') {
    productForm.value = {
      productName: 'Lentes con Filtro Luz Azul Blue Block',
      category: 'Fatiga Visual Digital & Ofimática',
      targetAudience: 'Personas de 20 a 45 años que pasan más de 5 horas frente a pantallas',
      priceOrOffer: 'Montura ultraliviana + Lunas Blue Block certificadas desde $55',
      primaryGoal: 'leads',
    }
  } else {
    productForm.value = {
      productName: 'Examen Visual Computarizado + Renovación de Aros',
      category: 'Salud Visual General',
      targetAudience: 'Familias y pacientes que no se revisan la vista hace más de 1 año',
      priceOrOffer: 'Examen completo de agudeza visual y fondo de ojo con 50% de descuento en monturas',
      primaryGoal: 'citas',
    }
  }
  saveProductForm()
  runStrategyAudit()
}

async function runStrategyAudit() {
  if (!productForm.value.productName) return
  strategyLoading.value = true
  try {
    strategyResult.value = await generateProductStrategyPlan(productForm.value, commandData.value)
  } finally {
    strategyLoading.value = false
  }
}

function copyScript(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  }
}

// --- Chat del Agente de Decisión ---
const chatInput = ref('')
const aiLoading = ref(false)
const chatMessages = ref<ChatMessage[]>([])
const chatScrollRef = ref<HTMLElement | null>(null)

// --- API Key de IA (Gemini / Cloud) ---
const showApiKeyModal = ref(false)
const apiKeyInput = ref(typeof window !== 'undefined' ? (localStorage.getItem('pulso_gemini_api_key') || localStorage.getItem('pulso_ai_api_key') || '') : '')
const hasCustomApiKey = computed(() => !!apiKeyInput.value.trim())
const testLoading = ref(false)
const testResultMsg = ref('')
const testSuccess = ref<boolean | null>(null)

async function handleTestKey() {
  if (!apiKeyInput.value.trim()) return
  testLoading.value = true
  testResultMsg.value = ''
  testSuccess.value = null
  try {
    const res = await testGeminiApiKey(apiKeyInput.value)
    testSuccess.value = res.ok
    testResultMsg.value = res.message
  } finally {
    testLoading.value = false
  }
}

function saveApiKey() {
  if (apiKeyInput.value.trim()) {
    localStorage.setItem('pulso_gemini_api_key', apiKeyInput.value.trim())
  } else {
    localStorage.removeItem('pulso_gemini_api_key')
    localStorage.removeItem('pulso_ai_api_key')
  }
  showApiKeyModal.value = false
}

function clearApiKey() {
  apiKeyInput.value = ''
  localStorage.removeItem('pulso_gemini_api_key')
  localStorage.removeItem('pulso_ai_api_key')
  testResultMsg.value = ''
  testSuccess.value = null
  showApiKeyModal.value = false
}

const suggestedPrompts = [
  '¿Cuál sería el mejor público para ajustar la campaña?',
  '¿Qué oferta o paquete comercial ofrecer para lentes progresivos?',
  '¿Cómo aumentar la asistencia de citas de WhatsApp al consultorio?',
  '¿Por qué se pierden personas entre Meta y la web?',
  '¿En qué quiz debo invertir más presupuesto hoy?',
  '¿Qué cambios hacer para el público mayor de 50 años en Guayaquil?',
]

function askQuick(p: string) {
  chatInput.value = p
  handleSendChat()
}

function renderMarkdown(raw: string): string {
  if (!raw) return ''

  let html = raw

  // 1. Escapar tags HTML peligrosos
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. Tablas Markdown (| ... |)
  const tableRegex = /((?:\|[^\n]+\|\r?\n)+)/g
  html = html.replace(tableRegex, (match) => {
    const lines = match.trim().split(/\r?\n/)
    if (lines.length < 2) return match
    
    // Header
    const headerCols = lines[0].split('|').slice(1, -1).map(c => c.trim())
    // Skip separator line lines[1]
    const bodyLines = lines.slice(2)
    
    let tableHtml = '<div class="overflow-x-auto my-2 rounded border border-pulso-border/60 shadow"><table class="w-full text-left font-mono text-[9px] border-collapse bg-pulso-void/70">'
    tableHtml += '<thead class="bg-pulso-void border-b border-pulso-border text-cyan-300 uppercase tracking-wider text-[8px]"><tr>'
    for (const h of headerCols) {
      tableHtml += `<th class="py-2 px-2.5 font-bold">${h}</th>`
    }
    tableHtml += '</tr></thead><tbody class="divide-y divide-pulso-border/30">'
    for (const line of bodyLines) {
      const cols = line.split('|').slice(1, -1).map(c => c.trim())
      if (cols.length === 0) continue
      tableHtml += '<tr class="hover:bg-pulso-void/90 transition-colors">'
      for (const col of cols) {
        tableHtml += `<td class="py-1.5 px-2.5 text-slate-200">${col}</td>`
      }
      tableHtml += '</tr>'
    }
    tableHtml += '</tbody></table></div>'
    return tableHtml
  })

  // 3. Encabezados (###, ####, #####)
  html = html.replace(/^### (.*$)/gim, '<h4 class="text-cyan-300 font-bold text-xs mt-3 mb-1 flex items-center gap-1.5 border-b border-pulso-border/40 pb-1">$1</h4>')
  html = html.replace(/^#### (.*$)/gim, '<h5 class="text-violet-300 font-bold text-[11px] mt-2 mb-1">$1</h5>')
  html = html.replace(/^##### (.*$)/gim, '<h6 class="text-slate-200 font-bold text-[10px] mt-1.5 mb-0.5">$1</h6>')

  // 4. Blockquotes (> ...)
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-2 border-cyan-400 pl-2.5 py-1.5 my-1.5 bg-cyan-950/20 text-cyan-200 text-[10px] rounded-r italic">$1</blockquote>')

  // 5. Negrita (**texto**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-bold">$1</strong>')

  // 6. Cursiva (*texto*)
  html = html.replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')

  // 7. Código (`código`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-pulso-void px-1.5 py-0.5 rounded text-cyan-300 border border-pulso-border text-[9px] font-mono">$1</code>')

  // 8. Separadores (---)
  html = html.replace(/^---$/gim, '<hr class="border-pulso-border/40 my-2" />')

  // 9. Listas no ordenadas (* o -)
  html = html.replace(/^[\*\-] (.*$)/gim, '<div class="flex items-start gap-1.5 my-0.5 ml-1"><span class="text-cyan-400 text-[8px] mt-1">•</span><span class="text-slate-200 text-[10px] leading-relaxed">$1</span></div>')

  // 10. Listas numeradas (1. ...)
  html = html.replace(/^(\d+)\. (.*$)/gim, '<div class="flex items-start gap-1.5 my-1 ml-1"><span class="text-violet-400 font-bold text-[9px] mt-0.5">$1.</span><span class="text-slate-200 text-[10px] leading-relaxed">$2</span></div>')

  // 11. Espaciado entre bloques
  html = html.replace(/\n\n+/g, '<div class="h-1.5"></div>')

  return html
}

async function handleSendChat() {
  const q = chatInput.value.trim()
  if (!q || aiLoading.value) return
  chatInput.value = ''

  chatMessages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: q,
    timestamp: new Date().toISOString(),
  })

  aiLoading.value = true
  await nextTick()
  scrollChat()

  try {
    const answer = await askDecisionAdvisor(commandData.value, q, chatMessages.value)
    chatMessages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[AI-ADVISOR] Error en chat:', err)
    chatMessages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `⚠️ Disculpa, ocurrió un error temporal al procesar tu consulta: ${err?.message || 'Error interno'}. Por favor intenta nuevamente.`,
      timestamp: new Date().toISOString(),
    })
  } finally {
    aiLoading.value = false
    await nextTick()
    scrollChat()
  }
}

function scrollChat() {
  if (chatScrollRef.value) {
    chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
  }
}
</script>
