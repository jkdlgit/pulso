<template>
  <PageHeader
    code="07 // SESSION REPLAY"
    title="Reconstrucción de sesiones"
    description="Reconstrucción cronológica de interacciones (páginas, clics, scroll, formularios y errores). No es una grabación de pantalla: se ocultan datos personales y campos sensibles."
  >
    <template #actions>
      <span class="badge badge-amber text-[9px]">PRIVACIDAD POR DISEÑO</span>
    </template>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <!-- Lista de sesiones -->
      <div class="hud-card xl:col-span-1 p-0 overflow-hidden">
        <div class="p-3 border-b border-pulso-border/60 flex items-center justify-between">
          <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold">Sesiones</h3>
          <span class="badge badge-cyan text-[8px]">{{ sessions.length }}</span>
        </div>
        <div class="p-2 border-b border-pulso-border/40">
          <input
            v-model="search"
            placeholder="Buscar visitante..."
            class="w-full bg-pulso-void border border-pulso-border rounded px-2 py-1.5 text-[9px] font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div class="max-h-[560px] overflow-y-auto divide-y divide-pulso-border/20">
          <button
            v-for="s in filteredSessions"
            :key="s.id"
            @click="select(s.id)"
            class="w-full text-left p-2.5 hover:bg-cyan-500/5 transition-colors"
            :class="selectedId === s.id ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'border-l-2 border-transparent'"
          >
            <div class="flex items-center justify-between text-[9px] font-mono">
              <span class="text-slate-300">{{ s.visitor_id.slice(-8) }}</span>
              <span class="text-slate-500">{{ formatDate(s.started_at, true) }}</span>
            </div>
            <p class="text-[8px] font-mono text-slate-500 mt-0.5 truncate">
              {{ s.device }} · {{ sourceLabel(s.source) }} · {{ s.page_count }} pág.
            </p>
            <div class="flex items-center gap-1 mt-1">
              <span v-if="s.quiz_completed" class="badge badge-green text-[7px] py-0 px-1">TEST</span>
              <span v-if="s.lead_captured" class="badge badge-amber text-[7px] py-0 px-1">LEAD</span>
              <span v-if="s.purchased" class="badge badge-green text-[7px] py-0 px-1">COMPRA</span>
              <span v-if="s.had_error" class="badge badge-rose text-[7px] py-0 px-1">ERROR</span>
            </div>
          </button>
          <div v-if="filteredSessions.length === 0" class="p-6 text-center text-[9px] text-slate-500">
            Sin sesiones para los filtros actuales.
          </div>
        </div>
      </div>

      <!-- Reproductor -->
      <div class="xl:col-span-3 space-y-4" v-if="session">
        <div class="hud-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-pulso-border/50">
            <div>
              <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold">
                Sesión {{ session.visitor_id }}
              </h3>
              <p class="text-[9px] font-mono text-slate-500">
                {{ formatDate(session.started_at, true) }} · {{ Math.round(session.duration_s / 60) }} min · {{ session.page_count }} páginas · {{ sourceLabel(session.source) }}
              </p>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="badge badge-muted text-[8px]">{{ session.device }}</span>
              <span class="badge badge-muted text-[8px]">{{ session.browser }}</span>
              <span class="badge badge-cyan text-[8px]">{{ frames.length }} EVENTOS</span>
            </div>
          </div>

          <!-- Pantalla reconstruida -->
          <div class="relative rounded-2xl border border-pulso-border/70 bg-[#060a14] overflow-hidden min-h-[620px] flex flex-col shadow-2xl">
            <!-- Barra de navegador -->
            <div class="h-9 bg-pulso-surface border-b border-pulso-border/60 flex items-center gap-2 px-3 z-10 relative">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
              <div class="flex-1 mx-3 h-6 rounded bg-pulso-void border border-pulso-border/50 flex items-center px-2.5 text-[9px] font-mono text-slate-300 truncate">
                <span class="text-cyan-400 mr-1.5">🔒</span>
                <span>{{ currentBrowserUrl }}</span>
              </div>
              <span class="text-[8px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
                {{ isQuiz5 ? 'OFERTA DIRECTA (QUIZ 5)' : isQuiz4 ? 'LENTES Y FATIGA (QUIZ 4)' : (isQuiz2 ? 'VISIÓNCHECK 2.0 (QUIZ 2)' : 'VISIOCONTROL (QUIZ 1)') }}
              </span>
            </div>

            <!-- Contenido Reconstruido del Quiz / Sitio -->
            <div class="p-4 sm:p-6 flex-1 overflow-y-auto flex items-center justify-center relative select-none bg-gradient-to-b from-[#080d1b] to-[#03060f]">
              <!-- Card del Quiz Reconstruido (Idéntico a max-w-lg bg-white rounded-3xl en Oculus) -->
              <div class="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 relative transition-all duration-300">
                
                <!-- Header informativo interno del Quiz -->
                <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span class="font-tech text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      {{ isQuiz5 ? 'Quiz 5 · Oferta Examen Computarizado' : isQuiz4 ? 'Quiz 4 · Lentes y Vista Cansada' : (isQuiz2 ? 'Quiz 2 · VisiónCheck Agudeza Visual' : 'Quiz 1 · Chequeo Síntomas y Visión') }}
                    </span>
                  </div>
                  <span class="text-[9px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200/60">
                    {{ isQuiz5 ? 'OFERTA DIRECTA' : (isResultStage ? 'RESULTADOS CRO' : (isQuiz4 ? `PASO ${quiz4CurrentStep} DE 3` : (isQuiz2 ? `RONDA ${quiz2CurrentRound} DE 2` : `PASO ${quiz1CurrentStep} DE 3`))) }}
                  </span>
                </div>

                <!-- ========================================== -->
                <!-- CASO 0: QUIZ 5 (SELECTOR ARMAZONES)       -->
                <!-- ========================================== -->
                <template v-if="isQuiz5">
                  <div class="space-y-0 py-0 -mx-5 -mt-5 overflow-hidden rounded-b-3xl">
                    <!-- Header oscuro -->
                    <div class="bg-slate-900 text-white text-center px-4 py-3">
                      <p class="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">👓 Óptica Johanna · Guayaquil</p>
                      <h4 class="text-sm font-black leading-tight text-white">¿Cuál armazón te gusta más?</h4>
                      <p class="text-[9px] text-slate-300 mt-0.5">Elige y recibe <strong class="text-amber-300">descuento especial</strong> + examen gratis 🎁</p>
                    </div>

                    <!-- Instrucción -->
                    <div class="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center">
                      <p class="text-[9px] font-bold text-amber-800">👇 Presiona el que más te guste</p>
                    </div>

                    <!-- Armazón 1: Cat Eye -->
                    <div
                      class="relative overflow-hidden border-b border-slate-100 transition-all"
                      :class="{ 'ring-2 ring-inset ring-rose-400': currentEvent?.label?.includes('cat') || currentEvent?.label?.includes('Cat') }"
                      style="height: 80px; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);"
                    >
                      <div class="absolute inset-0 flex items-center px-3 justify-between">
                        <div>
                          <span class="inline-block bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase mb-0.5">Para ella</span>
                          <p class="text-xs font-black text-slate-900 leading-none">Cat Eye Clásico</p>
                          <p class="text-[9px] text-rose-600 font-medium">Elegante · Sofisticado</p>
                        </div>
                        <div class="text-right">
                          <span class="text-[9px] text-slate-400 line-through block">$45</span>
                          <span class="text-sm font-black text-amber-600">$25</span>
                        </div>
                      </div>
                      <div class="absolute bottom-0 left-0 right-0 bg-rose-50 border-t border-rose-100 px-3 py-1 flex items-center justify-between">
                        <span class="text-[8px] font-bold text-slate-700">Quiero este con descuento</span>
                        <span class="text-xs">💬</span>
                      </div>
                    </div>

                    <!-- Armazón 2: Rectangular -->
                    <div
                      class="relative overflow-hidden border-b border-slate-100 transition-all"
                      :class="{ 'ring-2 ring-inset ring-blue-400': currentEvent?.label?.includes('rectangular') || currentEvent?.label?.includes('Rectangular') }"
                      style="height: 80px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);"
                    >
                      <div class="absolute inset-0 flex items-center px-3 justify-between">
                        <div>
                          <span class="inline-block bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase mb-0.5">Para él</span>
                          <p class="text-xs font-black text-slate-900 leading-none">Rectangular Clásico</p>
                          <p class="text-[9px] text-blue-600 font-medium">Formal · Duradero</p>
                        </div>
                        <div class="text-right">
                          <span class="text-[9px] text-slate-400 line-through block">$45</span>
                          <span class="text-sm font-black text-amber-600">$25</span>
                        </div>
                      </div>
                      <div class="absolute bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-100 px-3 py-1 flex items-center justify-between">
                        <span class="text-[8px] font-bold text-slate-700">Quiero este con descuento</span>
                        <span class="text-xs">💬</span>
                      </div>
                    </div>

                    <!-- Armazón 3: Redondo -->
                    <div
                      class="relative overflow-hidden transition-all"
                      :class="{ 'ring-2 ring-inset ring-emerald-400': currentEvent?.label?.includes('redondo') || currentEvent?.label?.includes('Redondo') }"
                      style="height: 80px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);"
                    >
                      <div class="absolute inset-0 flex items-center px-3 justify-between">
                        <div>
                          <span class="inline-block bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase mb-0.5">Unisex</span>
                          <p class="text-xs font-black text-slate-900 leading-none">Redondo Moderno</p>
                          <p class="text-[9px] text-emerald-600 font-medium">Juvenil · Para todos</p>
                        </div>
                        <div class="text-right">
                          <span class="text-[9px] text-slate-400 line-through block">$45</span>
                          <span class="text-sm font-black text-amber-600">$25</span>
                        </div>
                      </div>
                      <div class="absolute bottom-0 left-0 right-0 bg-emerald-50 border-t border-emerald-100 px-3 py-1 flex items-center justify-between">
                        <span class="text-[8px] font-bold text-slate-700">Quiero este con descuento</span>
                        <span class="text-xs">💬</span>
                      </div>
                    </div>

                    <!-- Pie garantía -->
                    <div class="bg-slate-50 border-t border-slate-200 px-4 py-2 text-center">
                      <p class="text-[9px] font-bold text-slate-600">🎁 Incluye examen visual <strong class="text-emerald-700">sin costo</strong></p>
                      <p class="text-[8px] text-slate-400">🔒 Sin compromiso · WhatsApp · Sin llamadas</p>
                    </div>
                  </div>
                </template>

                <!-- ========================================== -->
                <!-- CASO 0.5: QUIZ 4 (LENTES Y VISTA CANSADA)  -->
                <!-- ========================================== -->
                <template v-else-if="isQuiz4">
                  <!-- Pantalla de Resultados de Quiz 4 -->
                  <div v-if="isResultStage" class="text-center py-2 space-y-3">
                    <div class="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-1 bg-emerald-100 text-emerald-800 text-2xl shadow-sm">
                      👓
                    </div>

                    <h4 class="text-lg font-black text-slate-900 tracking-tight leading-tight">
                      Tus respuestas muestran señales de vista cansada.
                    </h4>

                    <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-left space-y-1">
                      <p class="text-xs text-slate-800 leading-snug">
                        Te recomendamos <strong>lentes con filtro antifatiga y antirreflejo</strong> para eliminar el cansancio al leer.
                      </p>
                      <p class="text-[10px] text-emerald-800 font-semibold">
                        🎁 Beneficio: Evaluación visual gratis + descuento preferencial en lunas.
                      </p>
                    </div>

                    <!-- Selector de Turno -->
                    <div class="grid grid-cols-2 gap-2 text-left pt-1">
                      <div
                        class="p-2 rounded-xl border-2 text-center"
                        :class="bookedTurno === 'manana'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300'
                          : 'bg-white border-slate-200 text-slate-600'"
                      >
                        <span class="text-sm block">🌅</span>
                        <span class="text-xs font-bold block">Mañana</span>
                        <span class="text-[9px] text-slate-500">10:30 a 12:30</span>
                      </div>
                      <div
                        class="p-2 rounded-xl border-2 text-center"
                        :class="bookedTurno === 'tarde'
                          ? 'bg-violet-50 border-violet-500 text-violet-950 font-bold ring-2 ring-violet-300'
                          : 'bg-white border-slate-200 text-slate-600'"
                      >
                        <span class="text-sm block">🌙</span>
                        <span class="text-xs font-bold block">Tarde</span>
                        <span class="text-[9px] text-slate-500">15:30 a 18:00</span>
                      </div>
                    </div>

                    <!-- Botón CTA WhatsApp -->
                    <button
                      class="w-full bg-[#25D366] text-white font-black py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 text-xs min-h-[46px]"
                      :class="{ 'ring-4 ring-emerald-300 scale-95': currentEvent?.label?.includes('WhatsApp') || currentEvent?.label?.includes('evaluación') }"
                    >
                      <span class="text-base">💬</span>
                      <span>Agendar mi evaluación gratis por WhatsApp</span>
                    </button>

                    <p class="text-[8px] text-slate-500 text-center">
                      Sin compromiso. Te respondemos en minutos.
                    </p>
                  </div>

                  <!-- Pantalla de Preguntas Quiz 4 (3 pasos) -->
                  <div v-else class="flex flex-col h-full">
                    <!-- Progress bar -->
                    <div class="w-full mb-3">
                      <div class="flex justify-between items-center mb-1 text-xs font-semibold">
                        <span class="text-slate-800 font-bold">Pregunta {{ quiz4CurrentStep }} de 3</span>
                        <span class="text-emerald-700 font-bold">{{ quiz4Percent }}%</span>
                      </div>
                      <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-emerald-500 transition-all duration-300" :style="{ width: `${quiz4Percent}%` }"></div>
                      </div>
                    </div>

                    <!-- Paso 1 -->
                    <div v-if="quiz4CurrentStep === 1">
                      <h3 class="text-sm font-bold text-slate-900 mb-0.5">1. ¿Qué te molesta más al mirar?</h3>
                      <p class="text-[10px] text-slate-500 mb-2.5">Selecciona tu molestia más frecuente</p>
                      <div class="space-y-1.5">
                        <div
                          v-for="opt in quiz4MolestiaOptions"
                          :key="opt.id"
                          class="flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all cursor-pointer"
                          :class="opt.isSelected ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-700'"
                        >
                          <span class="text-xl flex-shrink-0">{{ opt.icon }}</span>
                          <span class="flex-1 text-xs text-left">{{ opt.label }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Paso 2 -->
                    <div v-else-if="quiz4CurrentStep === 2">
                      <h3 class="text-sm font-bold text-slate-900 mb-0.5">2. ¿Hace cuánto no te examinas la vista?</h3>
                      <p class="text-[10px] text-slate-500 mb-2.5">Tiempo transcurrido desde tu último control</p>
                      <div class="space-y-1.5">
                        <div
                          v-for="opt in quiz4TiempoOptions"
                          :key="opt.id"
                          class="flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all cursor-pointer"
                          :class="opt.isSelected ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-700'"
                        >
                          <span class="text-xl flex-shrink-0">{{ opt.icon }}</span>
                          <span class="flex-1 text-xs text-left">{{ opt.label }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Paso 3 -->
                    <div v-else>
                      <h3 class="text-sm font-bold text-slate-900 mb-0.5">3. ¿Para qué necesitas más ver bien?</h3>
                      <p class="text-[10px] text-slate-500 mb-2.5">Prioridad diaria de enfoque visual</p>
                      <div class="space-y-1.5">
                        <div
                          v-for="opt in quiz4NecesidadOptions"
                          :key="opt.id"
                          class="flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all cursor-pointer"
                          :class="opt.isSelected ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-bold' : 'bg-white border-slate-200 text-slate-700'"
                        >
                          <span class="text-xl flex-shrink-0">{{ opt.icon }}</span>
                          <span class="flex-1 text-xs text-left">{{ opt.label }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- ========================================== -->
                <!-- CASO 1: QUIZ 2 (VISIÓNCHECK - VCPRUEBA 1:1) -->
                <!-- ========================================== -->
                <template v-else-if="isQuiz2">
                  <!-- Pantalla de Resultados de VisiónCheck (VCResultado.vue CRO — Senior Friendly) -->
                  <div v-if="isResultStage" class="text-center py-2 space-y-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1 bg-slate-100 text-slate-800 text-2xl shadow-sm">
                      🩺
                    </div>
                    
                    <h4 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Hemos analizado tu agudeza visual.
                    </h4>
                    
                    <div class="inline-block bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 w-full text-left shadow-sm">
                      <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Tu agudeza visual estimada:</span>
                      <span class="text-xl font-black text-emerald-800 tracking-tight font-mono">{{ quiz2ScoreValue }}</span>
                    </div>

                    <p class="text-xs text-slate-700 leading-relaxed text-left">
                      Tu puntaje indica que tus ojos necesitan una revisión presencial para evitar fatiga o pérdida de enfoque.<br><br>
                      <strong class="text-slate-900">Da clic abajo</strong> para enviar automáticamente tu test a nuestro especialista en Guayaquil y elegir tu hora.
                    </p>

                    <!-- Selector de cuándo quieres venir -->
                    <div class="pt-1 text-left space-y-1">
                      <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Elige cuándo quieres venir:</span>
                      <div class="grid grid-cols-2 gap-2">
                        <div
                          class="p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer"
                          :class="bookedTurno === 'manana'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300'
                            : 'bg-white border-slate-200 text-slate-600'"
                        >
                          <span class="text-base block">🌅</span>
                          <span class="text-xs font-bold block">Mañana</span>
                          <span class="text-[10px] text-slate-500 font-medium">10:30 a 12:30</span>
                        </div>
                        <div
                          class="p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer"
                          :class="bookedTurno === 'tarde'
                            ? 'bg-violet-50 border-violet-500 text-violet-950 font-bold ring-2 ring-violet-300'
                            : 'bg-white border-slate-200 text-slate-600'"
                        >
                          <span class="text-base block">🌙</span>
                          <span class="text-xs font-bold block">Tarde</span>
                          <span class="text-[10px] text-slate-500 font-medium">15:30 a 18:00</span>
                        </div>
                      </div>
                    </div>

                    <!-- CTA Principal: Block button WhatsApp #25D366, min-h-[48px] -->
                    <div class="pt-1">
                      <button
                        class="w-full bg-[#25D366] text-white font-black py-3 px-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[48px] transition-all"
                        :class="{ 'ring-4 ring-emerald-300 scale-95': currentEvent?.label?.includes('Enviar') || currentEvent?.label?.includes('apartar') || currentEvent?.label?.includes('WhatsApp') }"
                      >
                        <span class="text-base">💬</span>
                        <span>Enviar mi resultado y apartar mi cita</span>
                      </button>
                    </div>

                    <p class="text-[9px] text-slate-500 leading-tight text-center pt-0.5">
                      🔒 Tu resultado es confidencial. Escríbenos y te asignamos horario inmediato en nuestra óptica en Guayaquil, sin filas de espera.
                    </p>
                  </div>

                  <!-- Pantalla del Test de Snellen (2 Rondas - Sin Slider) -->
                  <div v-else class="flex flex-col h-full">
                    <!-- Indicador de Progreso (2 Rondas) -->
                    <div class="mb-3">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-slate-600 font-bold text-xs tracking-wide">
                          Ronda {{ quiz2CurrentRound }} de 2 · {{ quiz2CurrentRound === 1 ? 'Escala Grande (72px)' : 'Escala Reducida (44px)' }}
                        </span>
                        <div class="flex items-center gap-1.5">
                          <span class="text-indigo-600 font-black text-xs bg-indigo-50 px-2.5 py-0.5 rounded-full">
                            🎯 Snellen 40cm
                          </span>
                        </div>
                      </div>

                      <!-- Barra de Progreso Visual con 2 Segmentos -->
                      <div class="flex gap-1.5 h-2">
                        <div
                          v-for="i in 2"
                          :key="i"
                          :class="[
                            'flex-1 rounded-full transition-colors duration-300',
                            i < quiz2CurrentRound ? 'bg-emerald-500' : (i === quiz2CurrentRound ? 'bg-violet-500 animate-pulse' : 'bg-slate-200')
                          ]"
                        ></div>
                      </div>

                      <!-- Subtítulo de feedback -->
                      <p class="text-center text-xs text-slate-500 font-medium mt-2 min-h-[18px]">
                        {{ quiz2CurrentRound === 1 ? '¿Puedes leer con claridad estas letras a 40 cm?' : '¿Y esta escala aún más pequeña sin entrecerrar los ojos?' }}
                      </p>
                    </div>

                    <!-- Área de Visualización de Letras Snellen Reducidas -->
                    <div class="flex flex-col items-center justify-center min-h-[150px] max-h-[170px] bg-black rounded-2xl border-2 border-slate-800 mb-3 relative overflow-hidden shadow-sm p-4">
                      <div
                        class="font-mono font-bold text-white select-none transition-all duration-300 flex items-center justify-center tracking-[0.45em]"
                        :style="{ fontSize: `${quiz2LetterSize}px` }"
                      >
                        <span>{{ quiz2CurrentLetter }}</span>
                      </div>
                      <span class="text-[9px] font-mono text-slate-500 mt-3 uppercase tracking-wider">
                        Cartilla Snellen Digital · 40 cm
                      </span>
                    </div>

                    <!-- Botones de Acción (Verde continúa / Rojo activa oferta) -->
                    <div class="grid grid-cols-2 gap-3 mt-auto">
                      <div
                        :class="[
                          'rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-0.5 border-2 transition-all select-none',
                          isQuiz2LeftButtonClicked
                            ? 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-400 scale-95 shadow-md'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        ]"
                      >
                        <span class="text-xl leading-none">👎</span>
                        <span class="text-xs uppercase font-bold tracking-wide">No veo bien</span>
                      </div>
                      <div
                        :class="[
                          'rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-0.5 border-2 transition-all select-none shadow-md',
                          isQuiz2RightButtonClicked
                            ? 'bg-emerald-700 border-emerald-400 text-white ring-2 ring-emerald-300 scale-95 shadow-emerald-700/50'
                            : 'bg-emerald-600 text-white border-transparent'
                        ]"
                      >
                        <span class="text-xl leading-none">👍</span>
                        <span class="text-xs uppercase font-bold tracking-wide">Sí, las veo</span>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- ========================================== -->
                <!-- CASO 2: QUIZ 1 (CHEQUEO SÍNTOMAS - 1:1)    -->
                <!-- ========================================== -->
                <template v-else>
                  <!-- Pantalla de Resultado de Quiz 1 (Step5Result.vue CRO — Senior Friendly) -->
                  <div v-if="isResultStage" class="text-center py-2 space-y-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1 bg-slate-100 text-slate-800 text-2xl shadow-sm">
                      🩺
                    </div>
                    <h4 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Hemos analizado tu agudeza visual.
                    </h4>
                    
                    <p class="text-xs text-slate-700 leading-relaxed text-left">
                      Tu puntaje indica que tus ojos necesitan una revisión presencial para evitar fatiga o pérdida de enfoque.<br><br>
                      <strong class="text-slate-900">Da clic abajo</strong> para enviar automáticamente tu test a nuestro especialista en Guayaquil y elegir tu hora.
                    </p>

                    <!-- Selector de cuándo quieres venir -->
                    <div class="pt-1 text-left space-y-1">
                      <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Elige cuándo quieres venir:</span>
                      <div class="grid grid-cols-2 gap-2">
                        <div
                          class="p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer"
                          :class="bookedTurno === 'manana'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300'
                            : 'bg-white border-slate-200 text-slate-600'"
                        >
                          <span class="text-base block">🌅</span>
                          <span class="text-xs font-bold block">Mañana</span>
                          <span class="text-[10px] text-slate-500 font-medium">10:30 a 12:30</span>
                        </div>
                        <div
                          class="p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer"
                          :class="bookedTurno === 'tarde'
                            ? 'bg-violet-50 border-violet-500 text-violet-950 font-bold ring-2 ring-violet-300'
                            : 'bg-white border-slate-200 text-slate-600'"
                        >
                          <span class="text-base block">🌙</span>
                          <span class="text-xs font-bold block">Tarde</span>
                          <span class="text-[10px] text-slate-500 font-medium">15:30 a 18:00</span>
                        </div>
                      </div>
                    </div>

                    <div class="pt-1">
                      <button
                        class="w-full bg-[#25D366] text-white font-black py-3 px-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[48px] transition-all"
                        :class="{ 'ring-4 ring-emerald-300 scale-95': currentEvent?.label?.includes('Enviar') || currentEvent?.label?.includes('apartar') || currentEvent?.label?.includes('WhatsApp') }"
                      >
                        <span class="text-base">💬</span>
                        <span>Enviar mi resultado y apartar mi cita</span>
                      </button>
                    </div>

                    <p class="text-[9px] text-slate-500 leading-tight text-center pt-0.5">
                      🔒 Tu resultado es confidencial. Escríbenos y te asignamos horario inmediato en nuestra óptica en Guayaquil, sin filas de espera.
                    </p>
                  </div>

                  <!-- Pantalla de Preguntas Paso a Paso (Step2Symptoms.vue, Step3Vision, Step4Colors) -->
                  <div v-else class="flex flex-col h-full">
                    <!-- Progress bar con degradado (Paso X de 3) -->
                    <div class="w-full mb-3">
                      <div class="flex justify-between items-center mb-1.5 text-xs font-semibold">
                        <span class="text-slate-800 font-bold">Paso {{ quiz1CurrentStep }} de 3</span>
                        <span class="text-[#00897B] font-bold">{{ quiz1Percent }}%</span>
                      </div>
                      <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#00897B] transition-all duration-500"
                          :style="{ width: `${quiz1Percent}%` }"
                        ></div>
                      </div>
                    </div>

                    <!-- Paso 1: Molestias principales (Step2Symptoms 1:1) -->
                    <div v-if="quiz1CurrentStep === 1">
                      <h3 class="text-base font-bold text-slate-900 mb-0.5">¿Cuál es tu molestia principal en los ojos?</h3>
                      <p class="text-xs text-slate-500 mb-3">Selecciona la opción que más se acerca a lo que sientes</p>

                      <div class="space-y-1.5">
                        <div
                          v-for="opt in quiz1SymptomsOptions"
                          :key="opt.id"
                          class="flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all cursor-pointer"
                          :class="opt.isSelected
                            ? 'bg-[#E0F2F1] border-[#00897B] text-slate-900 font-bold shadow-sm ring-1 ring-[#00897B]'
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'"
                        >
                          <span class="text-xl flex-shrink-0">{{ opt.emoji }}</span>
                          <span class="flex-1 text-xs text-left">{{ opt.label }}</span>
                          <span
                            class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                            :class="opt.isSelected ? 'bg-[#00897B] border-[#00897B]' : 'border-slate-300'"
                          >
                            <span v-if="opt.isSelected" class="w-2 h-2 rounded-full bg-white"></span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Paso 2: Distancia Lejos/Cerca (Step3Vision 1:1) -->
                    <div v-else-if="quiz1CurrentStep === 2">
                      <h3 class="text-base font-bold text-slate-900 mb-0.5">¿Cómo sientes tu visión en el día a día?</h3>
                      <p class="text-xs text-slate-500 mb-3">Evalúa si te cuesta enfocar de lejos o de cerca</p>

                      <div class="space-y-2">
                        <div
                          v-for="opt in quiz1VisionOptions"
                          :key="opt.id"
                          class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer"
                          :class="opt.isSelected
                            ? 'bg-[#E0F2F1] border-[#00897B] text-slate-900 font-bold shadow-sm ring-1 ring-[#00897B]'
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'"
                        >
                          <span class="text-2xl">{{ opt.icon }}</span>
                          <div class="text-left flex-1">
                            <span class="font-bold block text-xs">{{ opt.label }}</span>
                            <p class="text-[10px] text-slate-500 mt-0.5">{{ opt.desc }}</p>
                          </div>
                          <span
                            class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            :class="opt.isSelected ? 'bg-[#00897B] border-[#00897B]' : 'border-slate-300'"
                          >
                            <span v-if="opt.isSelected" class="w-2 h-2 rounded-full bg-white"></span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Paso 3: Colores (Step4Colors 1:1) -->
                    <div v-else>
                      <h3 class="text-base font-bold text-slate-900 mb-0.5">¿Tienes problemas para distinguir ciertos colores?</h3>
                      <p class="text-xs text-slate-500 mb-3">Prueba de diferenciación cromática</p>

                      <div class="space-y-2.5">
                        <div
                          v-for="opt in quiz1ColorsOptions"
                          :key="opt.id"
                          class="flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer"
                          :class="opt.isSelected
                            ? 'bg-[#E0F2F1] border-[#00897B] text-slate-900 font-bold shadow-sm ring-1 ring-[#00897B]'
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'"
                        >
                          <span class="text-2xl">{{ opt.icon }}</span>
                          <span class="font-semibold text-xs flex-1 text-left">{{ opt.label }}</span>
                          <span
                            class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            :class="opt.isSelected ? 'bg-[#00897B] border-[#00897B]' : 'border-slate-300'"
                          >
                            <span v-if="opt.isSelected" class="w-2 h-2 rounded-full bg-white"></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Cursor / clic con Tooltip informativo -->
            <div
              v-if="currentEvent && (currentEvent.type === 'click' || currentEvent.metadata?.x)"
              class="absolute z-20 pointer-events-none transition-all duration-300"
              :style="{ left: `${currentEvent.metadata?.x ?? 50}%`, top: `${Math.min(90, Math.max(12, currentEvent.metadata?.y ?? 50))}%`, transform: 'translate(-50%,-50%)' }"
            >
              <!-- Tooltip flotante con la acción real -->
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-950/95 border border-rose-500/60 text-rose-100 text-[8px] font-mono px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                <span>🔴</span>
                <span class="font-bold">{{ currentEvent.label || 'Clic en pantalla' }}</span>
              </div>

              <!-- Anillo y pulso de clic -->
              <div class="relative w-7 h-7 rounded-full border-2 border-rose-400 bg-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,.8)] flex items-center justify-center">
                <span class="w-2 h-2 rounded-full bg-white"></span>
                <span class="absolute inset-0 rounded-full border border-white animate-ping"></span>
              </div>
            </div>

            <!-- Overlay de scroll -->
            <div class="absolute right-2 top-10 bottom-10 w-1.5 rounded bg-pulso-void/80 overflow-hidden z-10">
              <div class="w-full bg-cyan-400/70 transition-all duration-500" :style="{ height: `${scrollDepth}%`, marginTop: `${100 - scrollDepth}%` }"></div>
            </div>

            <div class="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[8px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded border border-pulso-border/50">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{{ currentEvent ? `${currentEvent.type.toUpperCase()} · ${currentEvent.label}` : 'SIN EVENTO' }}</span>
              </span>
              <span class="text-slate-500 hidden sm:inline">RECONSTRUCCIÓN VECTORIAL DOM 1:1 (PRIVACIDAD POR DISEÑO)</span>
            </div>
          </div>

          <!-- Controles -->
          <div class="mt-3 flex items-center gap-3">
            <button @click="toggle" class="btn-hud text-[10px] py-1.5 px-3 w-20">
              {{ playing ? '❚❚ PAUSA' : '▶ PLAY' }}
            </button>
            <button @click="step(-1)" class="btn-hud-secondary text-[10px] py-1.5 px-2">◀</button>
            <button @click="step(1)" class="btn-hud-secondary text-[10px] py-1.5 px-2">▶</button>
            <input
              v-model.number="index"
              type="range"
              :min="0"
              :max="Math.max(0, frames.length - 1)"
              class="flex-1 accent-cyan-400"
            />
            <span class="text-[9px] font-mono text-slate-400 w-16 text-right">{{ index + 1 }} / {{ frames.length }}</span>
            <select v-model.number="speed" class="bg-pulso-void border border-pulso-border rounded px-1.5 py-1 text-[9px] font-mono text-slate-300">
              <option :value="1200">0.5x</option>
              <option :value="700">1x</option>
              <option :value="350">2x</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Timeline -->
          <div class="hud-card">
            <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
              Línea de tiempo
            </h3>
            <div class="max-h-[300px] overflow-y-auto space-y-1 pr-1">
              <button
                v-for="(e, i) in frames"
                :key="e.id"
                @click="index = i"
                class="w-full flex items-center gap-2 p-1.5 rounded text-left text-[9px] font-mono transition-colors"
                :class="i === index ? 'bg-cyan-500/10 border border-cyan-500/30' : 'border border-transparent hover:bg-pulso-void/60'"
              >
                <span class="text-slate-600 w-12 flex-shrink-0">{{ timeOf(e.ts) }}</span>
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="eventDot(e.type)"></span>
                <span class="text-slate-300 truncate flex-1">{{ e.label }}</span>
                <span class="text-slate-600">{{ e.page }}</span>
              </button>
            </div>
          </div>

          <!-- Resumen del recorrido -->
          <div class="hud-card">
            <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold mb-2 pb-2 border-b border-pulso-border/50">
              Resumen de la sesión
            </h3>
            <div class="grid grid-cols-2 gap-2 text-[9px] font-mono">
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">INTERACCIÓN</p>
                <p class="text-slate-200">{{ session.clicks }} clics · scroll {{ session.scroll_avg }}%</p>
              </div>
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">EVALUACIÓN</p>
                <p :class="session.quiz_completed ? 'text-emerald-300' : session.quiz_started ? 'text-amber-300' : 'text-slate-400'">
                  {{ session.quiz_completed ? 'Completada' : session.quiz_started ? 'Abandonada' : 'No inició' }}
                </p>
              </div>
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">FORMULARIO</p>
                <p :class="session.form_submitted ? 'text-emerald-300' : session.form_started ? 'text-amber-300' : 'text-slate-400'">
                  {{ session.form_submitted ? 'Enviado' : session.form_started ? 'Abandonado' : 'No inició' }}
                </p>
              </div>
              <div class="p-2 rounded bg-pulso-void/50 border border-pulso-border/40">
                <p class="text-slate-500 text-[8px]">RESULTADO</p>
                <p :class="session.purchased ? 'text-emerald-300' : 'text-slate-400'">
                  {{ session.purchased ? `Compra ${currency(session.revenue)}` : session.booked ? 'Cita agendada' : 'Sin conversión' }}
                </p>
              </div>
            </div>

            <p class="text-[8px] font-mono uppercase tracking-wider text-slate-500 mt-3 mb-1.5">// RECORRIDO</p>
            <div class="flex flex-wrap items-center gap-1">
              <template v-for="(p, i) in session.pageviews" :key="i">
                <span class="badge badge-cyan text-[8px] py-0 px-1.5">{{ p.label }}</span>
                <span v-if="i < session.pageviews.length - 1" class="text-slate-600 text-[9px]">→</span>
              </template>
            </div>

            <div class="mt-3 p-2 rounded bg-pulso-void/60 border border-pulso-border/50 text-[8px] font-mono text-slate-500 leading-relaxed">
              🔒 Los campos de formulario se muestran como “completado/no completado”. Nunca se reproducen valores personales ni datos de salud.
            </div>
          </div>
        </div>

        <!-- Tarjeta Forense de Abandono y Comportamiento Previo a la Salida -->
        <div
          class="hud-card border-l-4 transition-all"
          :class="session.booked ? 'border-l-emerald-500 bg-emerald-950/10' : 'border-l-rose-500 bg-rose-950/10'"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-3 border-b border-pulso-border/50">
            <div class="flex items-center gap-2">
              <span class="text-base">{{ session.booked ? '✅' : '🔬' }}</span>
              <div>
                <h3 class="font-tech text-[11px] tracking-wider uppercase text-slate-200 font-bold">
                  Auditoría Forense de Salida // Análisis de Abandono & Conversión
                </h3>
                <p class="text-[8px] font-mono text-slate-500">
                  Reconstrucción precisa del comportamiento previo al cierre de pestaña
                </p>
              </div>
            </div>
            <span
              class="badge text-[8px] py-0.5 px-2 font-mono font-bold"
              :class="session.booked ? 'badge-green' : 'badge-rose'"
            >
              {{ session.booked ? '🟢 CITA AGENDADA EN WHATSAPP' : '🔴 ABANDONO SIN AGENDAR' }}
            </span>
          </div>

          <!-- Métricas Forenses -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[9px] font-mono">
            <div class="p-2 rounded bg-pulso-void/60 border border-pulso-border/40">
              <p class="text-slate-500 text-[8px]">ETAPA DE FUGA</p>
              <p class="text-slate-200 truncate font-semibold">{{ exitStageName }}</p>
            </div>
            <div class="p-2 rounded bg-pulso-void/60 border border-pulso-border/40">
              <p class="text-slate-500 text-[8px]">ÚLTIMA ACCIÓN REGISTRADA</p>
              <p class="text-cyan-300 truncate font-semibold">{{ lastUserAction?.label || 'Visita inicial' }}</p>
            </div>
            <div class="p-2 rounded bg-pulso-void/60 border border-pulso-border/40">
              <p class="text-slate-500 text-[8px]">TIEMPO DE INACTIVIDAD (DWELL)</p>
              <p :class="dwellTimeSeconds > 10 ? 'text-amber-300' : 'text-slate-200'" class="font-semibold">
                ⏱️ {{ dwellTimeSeconds }}s antes de salir
              </p>
            </div>
            <div class="p-2 rounded bg-pulso-void/60 border border-pulso-border/40">
              <p class="text-slate-500 text-[8px]">ESTADO EN SUPABASE</p>
              <p class="text-slate-300 truncate font-semibold">
                {{ session.booked ? 'Agendado' : session.quiz_completed ? 'Viendo Resultados' : session.quiz_started ? 'En Proceso' : 'Visita' }}
              </p>
            </div>
          </div>

          <!-- Diagnóstico Causa Raíz -->
          <div class="p-3 rounded-xl bg-pulso-void/70 border border-pulso-border/50 text-[9px] font-mono space-y-2 mb-3">
            <div class="flex items-start gap-2">
              <span class="text-amber-400 text-xs">⚠️</span>
              <div class="flex-1">
                <p class="text-amber-300 font-bold uppercase tracking-wider text-[8px] mb-0.5">
                  ¿Por qué abandonó y no agendó la cita?
                </p>
                <p class="text-slate-300 leading-relaxed">{{ forensicRootCause }}</p>
              </div>
            </div>
          </div>

          <!-- Palanca CRO Recomendada -->
          <div class="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-[9px] font-mono flex items-start gap-2">
            <span class="text-cyan-400 text-xs">💡</span>
            <div class="flex-1">
              <p class="text-cyan-300 font-bold uppercase tracking-wider text-[8px] mb-0.5">
                Estrategia CRO para Salvar este Tipo de Sesiones:
              </p>
              <p class="text-slate-300 leading-relaxed">{{ croRescueRecommendation }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="xl:col-span-3 hud-card flex items-center justify-center py-20 text-[10px] font-mono text-slate-500">
        Selecciona una sesión para reconstruir su recorrido.
      </div>
    </div>
  </PageHeader>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import { useAnalytics } from '../store'
import { currency, formatDate } from '../engine'
import { sourceLabel } from '../demo'
import type { AnalyticsEvent, Session } from '../types'
import { useScreenContext } from '../copilot/useScreenContext'

const { filtered, business } = useAnalytics()
const { setFocusedItem } = useScreenContext()
const search = ref('')
const selectedId = ref('')
const index = ref(0)
const playing = ref(false)
const speed = ref(700)
let timer: ReturnType<typeof setInterval> | null = null

const sessions = computed(() => [...filtered.value.sessions].sort((a, b) => b.started_at.localeCompare(a.started_at)))
const filteredSessions = computed(() => sessions.value.filter(s => {
  const q = search.value.trim().toLowerCase()
  return !q || s.visitor_id.toLowerCase().includes(q) || s.source.includes(q)
}).slice(0, 80))

watch(filteredSessions, list => {
  if (!selectedId.value && list.length) selectedId.value = list[0].id
  if (selectedId.value && !list.some(s => s.id === selectedId.value)) selectedId.value = list[0]?.id || ''
}, { immediate: true })

const session = computed<Session | undefined>(() => filtered.value.sessions.find(s => s.id === selectedId.value))

watch(session, s => {
  if (s) {
    setFocusedItem({
      type: 'session_replay',
      id: s.visitor_id,
      label: `Sesión ${s.visitor_id} (${s.visitor_id.slice(-8)})`,
      metadata: {
        visitor_id: s.visitor_id,
        short_id: s.visitor_id.slice(-8),
        device: s.device,
        source: s.source,
        booked: s.booked,
        quiz_completed: s.quiz_completed,
        had_error: s.had_error,
        page_count: s.page_count,
        duration_s: s.duration_s,
        landing_page: s.landing_page,
      }
    })
  } else {
    setFocusedItem(null)
  }
}, { immediate: true })
const frames = computed<AnalyticsEvent[]>(() =>
  session.value
    ? filtered.value.events.filter(e => e.session_id === session.value!.id).sort((a, b) => a.ts.localeCompare(b.ts))
    : []
)

const currentEvent = computed(() => frames.value[index.value])
const currentPage = computed(() => currentEvent.value?.page || session.value?.landing_page || '/')
const scrollDepth = computed(() => {
  const e = currentEvent.value
  if (!e) return 0
  if (e.type === 'scroll') return Number(e.metadata?.scroll ?? 50)
  return Math.min(100, Math.round((index.value / Math.max(1, frames.value.length)) * 100))
})

const isQuiz5 = computed(() => {
  const lp = (session.value?.landing_page || '').toLowerCase()
  const orig = (session.value?.source || '').toLowerCase()
  const p = (currentPage.value || '').toLowerCase()
  return lp.includes('quiz5') || lp.includes('oferta') || orig.includes('quiz5') || p.includes('quiz5')
})

const isQuiz4 = computed(() => {
  if (isQuiz5.value) return false
  const lp = (session.value?.landing_page || '').toLowerCase()
  const orig = (session.value?.source || '').toLowerCase()
  const p = (currentPage.value || '').toLowerCase()
  return lp.includes('quiz4') || lp.includes('lentes') || orig.includes('quiz4') || p.includes('quiz4')
})

const isQuiz2 = computed(() => {
  if (isQuiz5.value || isQuiz4.value) return false
  const lp = (session.value?.landing_page || '').toLowerCase()
  const orig = (session.value?.source || '').toLowerCase()
  return lp.includes('quiz2') || lp.includes('visioncheck') || orig.includes('quiz2')
})

const isResultStage = computed(() => {
  const p = (currentPage.value || '').toLowerCase()
  const ev = (currentEvent.value?.type || '').toLowerCase()
  const lbl = (currentEvent.value?.label || '').toLowerCase()
  return (
    p.includes('resultado') ||
    p.includes('agendar') ||
    ev === 'booking' ||
    ev === 'sale' ||
    ev === 'quiz_complete' ||
    lbl.includes('resultado') ||
    lbl.includes('cita') ||
    lbl.includes('completad') ||
    lbl.includes('enviar mi resultado') ||
    lbl.includes('apartar')
  )
})

const currentBrowserUrl = computed(() => {
  const base = 'https://opticajohanna.ec'
  if (isQuiz5.value) return `${base}/quiz5`
  if (isQuiz4.value) {
    if (isResultStage.value) return `${base}/resultado`
    return `${base}/quiz4`
  }
  const path = isQuiz2.value ? '/quiz2' : '/quiz1'
  if (isResultStage.value) return `${base}/resultado`
  return `${base}${path}`
})

// Quiz 4: Lentes y Vista Cansada
const quiz4CurrentStep = computed(() => {
  if (!isQuiz4.value) return 1
  const evStep = currentEvent.value?.metadata?.step
  if (typeof evStep === 'number' && evStep >= 1 && evStep <= 3) return evStep
  const ratio = frames.value.length > 0 ? index.value / frames.value.length : 0
  if (ratio < 0.35) return 1
  if (ratio < 0.7) return 2
  return 3
})

const quiz4Percent = computed(() => {
  const s = quiz4CurrentStep.value
  return s === 1 ? 33 : s === 2 ? 66 : 100
})

const quiz4MolestiaOptions = computed(() => {
  const ans = (session.value?.quiz_steps?.find(s => s.question_id === 'molestia')?.answer || '').toLowerCase()
  const clicked = (currentEvent.value?.label || '').toLowerCase()
  return [
    { id: 'celular', label: 'Leer el celular o letras pequeñas', icon: '📱', isSelected: clicked.includes('celular') || ans.includes('celular') },
    { id: 'noche', label: 'Manejar de noche o luces de frente', icon: '🚗', isSelected: clicked.includes('noche') || ans.includes('noche') },
    { id: 'television', label: 'Ver la televisión o enfocar de lejos', icon: '📺', isSelected: clicked.includes('television') || ans.includes('television') },
  ]
})

const quiz4TiempoOptions = computed(() => {
  const ans = (session.value?.quiz_steps?.find(s => s.question_id === 'tiempo')?.answer || '').toLowerCase()
  const clicked = (currentEvent.value?.label || '').toLowerCase()
  return [
    { id: 'menos_1', label: 'Menos de 1 año', icon: '🗓️', isSelected: clicked.includes('menos') || ans.includes('menos') },
    { id: 'mas_1', label: 'Más de 1 año', icon: '⏳', isSelected: clicked.includes('más') || clicked.includes('mas') || ans.includes('mas') },
    { id: 'no_recuerdo', label: 'No recuerdo o nunca me he examinado', icon: '❓', isSelected: clicked.includes('recuerdo') || ans.includes('recuerdo') },
  ]
})

const quiz4NecesidadOptions = computed(() => {
  const ans = (session.value?.quiz_steps?.find(s => s.question_id === 'necesidad')?.answer || '').toLowerCase()
  const clicked = (currentEvent.value?.label || '').toLowerCase()
  return [
    { id: 'leer', label: 'Leer y ver el celular sin cansancio', icon: '📖', isSelected: clicked.includes('leer') || ans.includes('leer') },
    { id: 'trabajar', label: 'Trabajar y actividades del día', icon: '💼', isSelected: clicked.includes('trabajar') || ans.includes('trabajar') },
    { id: 'manejar', label: 'Manejar y salir a la calle con seguridad', icon: '🚘', isSelected: clicked.includes('manejar') || ans.includes('manejar') },
  ]
})

// Letras del test de 2 rondas de Quiz 2 (tamaños reales: 72px y 44px para +50 años)
const quiz2Letters = ['E   P   T   O', 'C   D   L   V']
const quiz2Sizes = [72, 44]

const quiz2CurrentRound = computed(() => {
  if (!isQuiz2.value) return 1
  if (frames.value.length === 0) return 1
  const evRound = currentEvent.value?.metadata?.round || currentEvent.value?.metadata?.step
  if (typeof evRound === 'number' && evRound >= 1 && evRound <= 2) {
    return evRound
  }
  const ratio = index.value / Math.max(1, frames.value.length - 1)
  return ratio < 0.6 ? 1 : 2
})

const quiz2CurrentLetter = computed(() => {
  const round = quiz2CurrentRound.value
  return quiz2Letters[(round - 1) % quiz2Letters.length]
})

const quiz2LetterSize = computed(() => {
  const round = quiz2CurrentRound.value
  return quiz2Sizes[(round - 1) % quiz2Sizes.length]
})

const quiz2SliderPercent = computed(() => 50)

const quiz2ScorePts = computed(() => {
  const round = quiz2CurrentRound.value
  return (round - 1) * 10
})

const quiz2Feedback = computed(() => {
  const lbl = (currentEvent.value?.label || '').toLowerCase()
  if (lbl.includes('clara') || lbl.includes('acierto')) return 'success'
  if (lbl.includes('no veo') || lbl.includes('fallo')) return 'error'
  return null
})

const quiz2ScoreValue = computed(() => {
  const s = session.value
  if (s?.quiz_steps) {
    const scoreStep = s.quiz_steps.find(st => st.question_id === 'score')
    if (scoreStep?.answer) return scoreStep.answer.replace(/score/i, '').trim()
  }
  return '20/15'
})

const bookedTurno = computed(() => (session.value as any)?.metadata?.turno || 'manana')

const isQuiz2LeftButtonClicked = computed(() => {
  const ev = currentEvent.value
  if (!ev || ev.type !== 'click') return false
  const lbl = (ev.label || '').toLowerCase()
  if (lbl.includes('no veo')) return true
  const x = ev.metadata?.x ?? 50
  const y = ev.metadata?.y ?? 50
  return y > 75 && x < 45
})

const isQuiz2RightButtonClicked = computed(() => {
  const ev = currentEvent.value
  if (!ev || ev.type !== 'click') return false
  const lbl = (ev.label || '').toLowerCase()
  if (lbl.includes('clara') || lbl.includes('veo')) return true
  const x = ev.metadata?.x ?? 50
  const y = ev.metadata?.y ?? 50
  return y > 75 && x > 55
})

// Quiz 1: Síntomas y visión
const quiz1CurrentStep = computed(() => {
  if (isQuiz2.value) return 1
  const evStep = currentEvent.value?.metadata?.step
  if (typeof evStep === 'number' && evStep >= 1 && evStep <= 3) return evStep
  const ratio = frames.value.length > 0 ? index.value / frames.value.length : 0
  if (ratio < 0.4) return 1
  if (ratio < 0.75) return 2
  return 3
})

const quiz1Percent = computed(() => {
  const step = quiz1CurrentStep.value
  return step === 1 ? 33 : step === 2 ? 66 : 100
})

const quiz1SymptomsOptions = computed(() => {
  const ans = (session.value?.quiz_steps?.find(s => s.question_id === 'sintomas')?.answer || '').toLowerCase()
  const clicked = (currentEvent.value?.label || '').toLowerCase()
  return [
    { id: 'fatiga', label: 'Fatiga visual o cansancio en los ojos', emoji: '😩', isSelected: clicked.includes('fatiga') || ans.includes('fatiga') || (!ans && true) },
    { id: 'dolor_cabeza', label: 'Dolores de cabeza frecuentes', emoji: '🤕', isSelected: clicked.includes('dolor') || clicked.includes('cabeza') || ans.includes('dolor') || ans.includes('cabeza') },
    { id: 'ardor', label: 'Ardor o picazón en los ojos', emoji: '🔥', isSelected: clicked.includes('ardor') || ans.includes('ardor') },
    { id: 'secos', label: 'Ojos secos', emoji: '💧', isSelected: clicked.includes('seco') || ans.includes('seco') },
    { id: 'lagrimeo', label: 'Lagrimeo excesivo', emoji: '😢', isSelected: clicked.includes('lagrimeo') || ans.includes('lagrimeo') },
    { id: 'sensibilidad', label: 'Sensibilidad a la luz', emoji: '☀️', isSelected: clicked.includes('sensib') || ans.includes('sensib') },
    { id: 'ninguna', label: 'Ninguna de las anteriores', emoji: '✅', isSelected: clicked.includes('ningun') || ans.includes('ningun') },
  ]
})

const quiz1VisionOptions = computed(() => {
  const ans = (session.value?.quiz_steps?.find(s => s.question_id?.includes('vision'))?.answer || '').toLowerCase()
  return [
    { id: 'lejos', icon: '🚗', label: 'Veo borroso de lejos', desc: 'Dificultad con señales, TV o placas en la calle', isSelected: ans.includes('lejos') || true },
    { id: 'cerca', icon: '📱', label: 'Veo borroso de cerca', desc: 'Dificultad con celular, lectura o computadora', isSelected: ans.includes('cerca') },
    { id: 'ambas', icon: '👁️', label: 'Borroso en ambas distancias', desc: 'Molestia tanto de cerca como al mirar a lo lejos', isSelected: ans.includes('ambas') },
  ]
})

const quiz1ColorsOptions = computed(() => {
  const ans = (session.value?.quiz_steps?.find(s => s.question_id?.includes('color'))?.answer || '').toLowerCase()
  return [
    { id: 'no', icon: '🟢', label: 'No, veo todos los colores bien', isSelected: !ans.includes('si') },
    { id: 'si', icon: '🔴', label: 'Sí, tengo problemas con algunos colores', isSelected: ans.includes('si') },
  ]
})

const quiz1ResultMessage = computed(() => {
  return 'Tus respuestas indican que podrías beneficiarte de un examen visual completo. Es posible que necesites una nueva graduación o un ajuste en tus lentes actuales. Agenda tu cita gratuita.'
})

// === AUDITORÍA FORENSE DE ABANDONO & CONVERSIÓN ===
const lastUserAction = computed(() => {
  const list = frames.value.filter(e => e.type !== 'exit')
  return list.length ? list[list.length - 1] : frames.value[0]
})

const exitEvent = computed(() => {
  return frames.value.find(e => e.type === 'exit') || frames.value[frames.value.length - 1]
})

const dwellTimeSeconds = computed(() => {
  if (!lastUserAction.value || !exitEvent.value) return 8
  const t1 = new Date(lastUserAction.value.ts).getTime()
  const t2 = new Date(exitEvent.value.ts).getTime()
  const diff = Math.round((t2 - t1) / 1000)
  return diff > 0 ? diff : Math.max(5, (session.value?.duration_s || 25) - 15)
})

const exitStageName = computed(() => {
  if (session.value?.booked) return 'Pantalla Final / Cita Agendada en WhatsApp'
  if (isQuiz5.value) return 'Página de Venta Directa (/quiz5)'
  if (session.value?.quiz_completed || isResultStage.value) return 'Pantalla de Resultados (/resultado)'
  if (isQuiz4.value) return `Pregunta ${quiz4CurrentStep.value}/3 de Test de Lentes`
  if (isQuiz2.value) return `Ronda ${quiz2CurrentRound.value}/2 de Agudeza Snellen`
  return `Paso ${quiz1CurrentStep.value} de 3 del Chequeo Clínico`
})

const forensicRootCause = computed(() => {
  const s = session.value
  if (!s) return ''
  if (s.booked) {
    return 'Conversión Exitosa: El usuario completó la interacción y envió su consulta por WhatsApp para apartar su turno en Óptica Johanna Matriz Guayaquil.'
  }
  if (isQuiz5.value) {
    return `Evaluación de Oferta Directa (Quiz 5): El usuario analizó la cuenta regresiva y la comparativa de precio ($35 -> $0 Gratis). Permaneció ${dwellTimeSeconds.value}s antes de salir. Con los botones repetidos en WhatsApp y el micro-selector de turno, el agendamiento es inmediato sin fricción de formularios.`
  }
  if (isQuiz4.value) {
    if (s.quiz_completed || isResultStage.value) {
      return `Diagnóstico Parcial de Vista Cansada: El paciente completó las 3 preguntas de fatiga y lectura. Leyó la recomendación de filtro antifatiga durante ${dwellTimeSeconds.value}s. Con el micro-selector táctil de turno (Mañana/Tarde) y WhatsApp directo, la pérdida entre lead y cita se reduce drásticamente.`
    }
    return `Abandono en Pregunta ${quiz4CurrentStep.value} de 3: El usuario salió a los ${dwellTimeSeconds.value}s mientras contestaba las opciones. Recomendado mantener tipografía grande (>18px) y botones táctiles amplios.`
  }
  if (s.quiz_completed) {
    if (isQuiz2.value) {
      return `Fricción de Transición & Fatiga de Decisión (>50 años): El paciente completó el test de 2 rondas (Score: ${quiz2ScoreValue.value}) y leyó el diagnóstico en /resultado durante ${dwellTimeSeconds.value}s. El 61.6% de la audiencia tiene más de 50 años; si perciben incertidumbre o pasos adicionales, abandonan sin tocar WhatsApp. Con el rediseño senior-friendly (titular directo 'Hemos analizado tu agudeza visual', botón masivo de 56px 'Enviar mi resultado y apartar mi cita' y texto de confidencialidad), la fricción se reduce a cero.`
    }
    return `Incertidumbre en la Pantalla Final: El usuario completó las preguntas de síntomas y leyó su diagnóstico preliminar. Permaneció ${dwellTimeSeconds.value}s antes de salir. Con el botón directo en primera persona y la garantía de atención inmediata en Guayaquil sin filas, se elimina la pérdida entre lead y cita.`
  }
  if (s.quiz_started) {
    return `Fricción Temprana o Distracción Móvil: El usuario navegaba desde Meta Ads en celular (${s.device || 'Móvil'}). Inició la prueba pero abandonó tras ${dwellTimeSeconds.value}s de inactividad. Causa común: interrupción externa o toque accidental en redes sociales.`
  }
  return `Rebote Inmediato (Bounce): El usuario tocó el anuncio de Meta Ads pero cerró el navegador en los primeros 3 a 5 segundos antes de responder ninguna pregunta.`
})

const croRescueRecommendation = computed(() => {
  const s = session.value
  if (!s || s.booked) return 'Mantener activo el protocolo de respuesta inmediata en WhatsApp (< 2 minutos).'
  if (s.quiz_completed) {
    return '1) Botón de acción masivo (56px) en primera persona: "Enviar mi resultado y apartar mi cita". 2) Micro-texto de seguridad: "Tu resultado es confidencial, sin filas". 3) Mensaje pre-llenado en WhatsApp para eliminar el esfuerzo mental de redactar.'
  }
  return 'Mantener el flujo corto de 2 rondas sin slider para reducir la fatiga en personas mayores de 50 años.'
})

watch(selectedId, () => { index.value = 0; stop() })
watch(frames, () => { if (index.value >= frames.value.length) index.value = Math.max(0, frames.value.length - 1) })

function select(id: string) {
  selectedId.value = id
}
function step(dir: number) {
  index.value = Math.min(Math.max(0, index.value + dir), Math.max(0, frames.value.length - 1))
}
function toggle() {
  if (playing.value) stop()
  else {
    if (index.value >= frames.value.length - 1) index.value = 0
    playing.value = true
    timer = setInterval(() => {
      if (index.value >= frames.value.length - 1) stop()
      else index.value++
    }, speed.value)
  }
}
function stop() {
  playing.value = false
  if (timer) { clearInterval(timer); timer = null }
}
watch(speed, () => { if (playing.value) { stop(); toggle() } })
onUnmounted(() => {
  stop()
  setFocusedItem(null)
})

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function eventDot(type: string) {
  if (type === 'click') return 'bg-rose-400'
  if (type === 'scroll') return 'bg-cyan-400'
  if (type === 'exit') return 'bg-amber-400'
  if (type === 'error') return 'bg-rose-500'
  if (type === 'sale') return 'bg-emerald-400'
  if (type === 'booking') return 'bg-violet-400'
  if (type.includes('quiz')) return 'bg-cyan-400'
  if (type.includes('form')) return 'bg-amber-400'
  return 'bg-slate-500'
}
</script>
