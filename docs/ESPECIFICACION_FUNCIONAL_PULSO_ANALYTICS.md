# PULSO ANALYTICS
## Especificación funcional maestra

**Documento:** Plataforma de inteligencia de marketing y comportamiento
**Versión:** 1.0
**Estado:** Base funcional completa — 22 módulos
**Ámbito:** Qué debe hacer la plataforma. No describe arquitectura, código ni proveedores tecnológicos.

---

## Control del documento

| Elemento | Definición |
|---|---|
| Propósito | Definir el comportamiento funcional completo de Pulso Analytics: qué observa, qué calcula, qué muestra, qué recomienda y qué límites respeta. |
| Alcance | Analítica de adquisición, comportamiento, conversión, atención comercial, resultados de negocio y optimización continua, para uno o varios negocios. |
| Fuera de alcance | CRM operativo completo, facturación electrónica, gestión de inventario, campañas publicitarias desde la plataforma, mensajería masiva. |
| Usuarios | Dirección del negocio, responsable de marketing, responsable comercial, personal de atención y analista de datos. |
| Idioma | Español (Ecuador). Moneda base: dólar estadounidense. |
| Principio rector | Ningún dato se presenta sin origen, período, volumen y nivel de confianza. Ninguna correlación se presenta como causalidad. |

### Glosario mínimo

| Término | Significado |
|---|---|
| **Observado** | Dato capturado automáticamente durante la navegación, con consentimiento. |
| **Declarado** | Dato que la persona escribe voluntariamente. |
| **Registrado por el negocio** | Dato anotado por el equipo durante la atención (cita, asistencia, venta). |
| **Importado** | Dato recibido de una plataforma externa (inversión, impresiones, clics). |
| **Calculado** | Dato derivado matemáticamente de otros datos (tasas, promedios, ROAS). |
| **Inferido / predicho** | Estimación probabilística o asignación de atribución. Nunca se muestra como hecho. |
| **Sesión** | Conjunto de interacciones de un visitante en una ventana continua. |
| **Lead** | Persona que dejó datos de contacto de forma voluntaria. |
| **Conversión** | Resultado definido por el negocio: lead, cita, cotización o venta. |
| **Atribución** | Asignación de un resultado a un origen. Es una estimación, no una prueba. |
| **Período comparable** | Ventana inmediatamente anterior de igual duración, usada para comparar. |

---

# ENTREGABLE 1 — ESTRUCTURA FUNCIONAL

## 1.1 Las cuatro etapas del sistema

La plataforma se organiza en cuatro etapas encadenadas. Cada etapa alimenta a la siguiente y ninguna se presenta como aislada.

| Etapa | Pregunta que responde | Resultado |
|---|---|---|
| **1. Recopilación** | ¿Qué ocurrió y con qué evidencia? | Datos observados, declarados, registrados e importados. |
| **2. Análisis** | ¿Qué significan esos datos? | Indicadores, tasas, comparaciones, segmentos y detección de anomalías. |
| **3. Visualización** | ¿Cómo se entiende rápido? | Paneles, series, embudos, mapas, tablas y recorridos. |
| **4. Inteligencia** | ¿Qué conviene hacer y cómo comprobarlo? | Hallazgos priorizados, recomendaciones y seguimiento de mejoras. |

**Regla de trazabilidad:** todo indicador visible debe poder responder: qué dato lo origina, en qué período, con qué filtros, con qué fórmula y con qué volumen.

## 1.2 Navegación y agrupación de módulos

La plataforma tiene 22 módulos agrupados en seis secciones. La numeración es estable y se usa en toda la documentación y en la interfaz.

### Sección A — Inteligencia

| Código | Módulo | Función principal |
|---|---|---|
| 01 | **Overview** | Resumen ejecutivo del negocio: resultados, tendencia, embudo y alertas. |
| 19 | **AI Insights** | Centro de hallazgos: qué funciona, qué no, qué vigilar y qué hacer. |

### Sección B — Audiencia

| Código | Módulo | Función principal |
|---|---|---|
| 02 | **Visitantes** | Quiénes llegan, cuántas veces, desde dónde y qué valor aportan. |
| 03 | **Actividad en vivo** | Qué está ocurriendo en los últimos minutos. |
| 15 | **Segmentos** | Construcción y comparación de audiencias. |
| 17 | **Dispositivos** | Diferencias de experiencia y conversión por dispositivo. |

### Sección C — Adquisición y experiencia

| Código | Módulo | Función principal |
|---|---|---|
| 04 | **Campañas** | Origen del tráfico, inversión, costo por resultado y retorno. |
| 05 | **Comportamiento** | Páginas, profundidad de lectura, clics y salidas. |
| 06 | **Mapas de calor** | Dónde se hace clic y hasta dónde se lee. |
| 07 | **Session replay** | Reproducción agregada y anonimizada de una sesión. |

### Sección D — Conversión y comercial

| Código | Módulo | Función principal |
|---|---|---|
| 08 | **Evaluaciones** | Comportamiento pregunta por pregunta del test o diagnóstico. |
| 09 | **Formularios y leads** | Dónde se abandona el formulario y qué calidad tiene el lead. |
| 10 | **Embudos** | Pérdida entre etapas y tiempo de avance. |
| 11 | **Recorridos** | Trayecto completo desde el primer contacto hasta la compra. |
| 12 | **Citas** | Agendamiento, confirmación, asistencia y ausencia. |
| 13 | **Seguimiento** | Contacto comercial, respuesta, canales y leads desatendidos. |
| 14 | **Ventas** | Ingresos, margen, ticket, atribución y tiempo de cierre. |

### Sección E — Optimización

| Código | Módulo | Función principal |
|---|---|---|
| 16 | **Análisis temporal** | Patrones por día, hora y semana; anomalías. |
| 18 | **Experimentos** | Pruebas A/B con hipótesis, variantes y confianza. |
| 20 | **Seguimiento de mejoras** | Antes/después de cada acción implementada. |

### Sección F — Administración

| Código | Módulo | Función principal |
|---|---|---|
| 21 | **Negocios** | Separación y comparación entre negocios. |
| 22 | **Privacidad y datos** | Qué se recopila, finalidad, retención y acceso. |

> **Nota de nomenclatura:** «AI Insights» es el nombre visible del módulo de hallazgos. Internamente no implica modelos generativos ni decisiones automáticas: es un motor de reglas explicables sobre datos de la propia plataforma.

## 1.3 Filtros globales

Los filtros son transversales: al cambiar uno, todos los módulos recalculan sus resultados. Deben permanecer visibles y mostrar cuántos filtros están activos.

| Filtro | Valores | Comportamiento |
|---|---|---|
| **Negocio** | Todos / cada negocio | Cambia el conjunto de datos completo. «Todos» agrega sin mezclar identidades. |
| **Período** | 7, 14, 30, 90 días | Define la ventana de análisis y el período comparable anterior. |
| **Fuente** | Todas, orgánico, directo, referidos, redes, buscadores, campañas | Filtra sesiones por origen. |
| **Campaña** | Todas / campaña específica | Filtra por campaña y muestra su inversión. |
| **Dispositivo** | Todos, móvil, escritorio, tablet | Filtra sesiones por dispositivo. |
| **Tipo de visitante** | Todos, nuevo, recurrente | Filtra por historial. |
| **Tipo de comprador** | Todos, comprador, no comprador | Filtra por resultado comercial. |
| **Comparar período anterior** | Activado / desactivado | Muestra variación absoluta y porcentual. |

**Reglas de filtro:**
- Los filtros se combinan con lógica «Y» entre categorías y «O» dentro de una misma categoría.
- Un filtro que deja el conjunto vacío debe mostrar un estado vacío explicativo, nunca ceros engañosos.
- La comparación con el período anterior debe usar exactamente la misma duración y los mismos filtros.
- Las vistas guardadas almacenan la combinación completa de filtros y un nombre definido por el usuario.
- Al aplicar una vista guardada, el usuario debe poder modificarla sin sobrescribirla.

## 1.4 Roles funcionales

| Rol | Puede ver | Puede hacer |
|---|---|---|
| **Dirección** | Todos los módulos y todos los negocios. | Consultar, comparar, exportar, aprobar mejoras. |
| **Marketing** | Adquisición, comportamiento, embudos, experimentos. | Crear segmentos, vistas guardadas, experimentos. |
| **Comercial** | Citas, seguimiento, ventas, recorridos. | Registrar resultados de contacto y ventas. |
| **Atención** | Citas del día, ficha de visitante autorizada. | Confirmar, marcar asistencia, registrar observación. |
| **Analista** | Todos los módulos. | Construir análisis, validar calidad, documentar fórmulas. |
| **Consulta** | Solo lectura. | Navegar y exportar lo permitido. |

**Restricción transversal:** el acceso a datos de salud visual (respuestas de evaluación) requiere autorización explícita y queda registrado.

## 1.5 Estados de la aplicación

| Estado | Cuándo aparece | Qué debe mostrar |
|---|---|---|
| **Datos reales** | Existen datos del negocio en el período. | Indicadores con fecha de última actualización. |
| **Modo demostración** | No hay datos disponibles o el entorno es de prueba. | Aviso visible y permanente que identifica los datos como simulados. |
| **Período sin datos** | El filtro no devuelve registros. | Explicación, sugerencia de ampliar período y acceso a quitar filtros. |
| **Datos insuficientes** | El volumen no alcanza el mínimo estadístico. | El indicador se muestra con etiqueta «muestra insuficiente». |
| **Parcial** | Falta una fuente (por ejemplo, ventas no registradas). | Se declara la cobertura y no se completan huecos con estimaciones silenciosas. |

## 1.6 Estructura de cada módulo

Todo módulo debe respetar el mismo orden de lectura:

1. **Encabezado:** nombre, propósito en una frase y estado del dato.
2. **Indicadores clave:** entre 4 y 8 tarjetas, con valor, variación y nota de origen.
3. **Visualización principal:** una sola pregunta dominante.
4. **Visualizaciones de apoyo:** descomposición, comparación o detalle.
5. **Tabla o listado:** evidencia individual trazable.
6. **Lectura funcional:** interpretación breve, límites y siguiente acción.

## 1.7 Criterios de aceptación de la estructura

- Existen exactamente 22 módulos accesibles y ninguno depende de otro para cargar.
- Todo módulo responde a los filtros globales en menos de una interacción.
- Ningún módulo muestra una cifra sin unidad, período o etiqueta de origen.
- Todo módulo tiene estado vacío, estado de carga y estado de error.
- La navegación indica siempre el módulo activo y el negocio seleccionado.

---

# ENTREGABLE 2 — CATÁLOGO DE DATOS

## 2.1 Entidades funcionales

### D-01. Negocio

Representa a cada marca o unidad de análisis. Es la frontera de separación de datos.

| Campo | Descripción | Origen | Obligatorio |
|---|---|---|---|
| Identificador | Clave estable del negocio | Configuración | Sí |
| Nombre | Nombre comercial | Configuración | Sí |
| Giro o industria | Actividad principal | Configuración | Sí |
| Símbolo visual | Emoji o marca | Configuración | No |
| Moneda | Moneda de los importes | Configuración | Sí |
| Color de acento | Identificación visual | Configuración | No |
| Sitio web | Dominio analizado | Configuración | No |
| CRM local | Indica si el negocio registra citas y ventas en la plataforma | Configuración | Sí |
| Estado | Activo o inactivo | Configuración | Sí |

**Regla:** los datos de dos negocios nunca se mezclan a nivel de persona. La vista consolidada solo suma métricas.

### D-02. Campaña

Origen de tráfico pagado o identificado.

| Campo | Descripción | Origen |
|---|---|---|
| Identificador | Clave de campaña | Importado |
| Negocio | Negocio al que pertenece | Configuración |
| Plataforma | Meta, Google, TikTok, orgánico, directo o referidos | Importado |
| Nombre | Nombre de la campaña | Importado |
| Conjunto de anuncios | Segmentación utilizada | Importado |
| Anuncio | Pieza individual | Importado |
| Creatividad | Formato o mensaje | Importado |
| Inversión diaria | Gasto promedio por día | Importado |
| Impresiones | Veces mostrada | Importado |
| Clics | Clics reportados | Importado |
| Fechas | Inicio y fin | Importado |
| Estado | Activa, pausada o finalizada | Importado |

**Regla de inversión:** la inversión del período es la suma de la inversión diaria multiplicada por los días en que la campaña estuvo activa. No se debe sumar dos veces una campaña que abarca varios días.

### D-03. Visitante

Persona seudónima que interactúa con el sitio. No contiene identidad real por defecto.

| Campo | Descripción | Origen |
|---|---|---|
| Identificador seudónimo | Clave estable sin datos personales | Observado |
| Negocio | Negocio asociado | Configuración |
| Primera y última visita | Marcas temporales | Observado |
| Número de sesiones | Frecuencia acumulada | Calculado |
| Dispositivo, sistema, navegador | Contexto técnico | Observado |
| Idioma y país | Contexto de navegación | Observado |
| Ciudad | Ubicación **aproximada** por IP | Inferido |
| Fuente y medio | Origen de la visita | Observado / importado |
| Campaña, anuncio, creatividad | Punto de contacto | Importado |
| Página de entrada | Primera página vista | Observado |
| Recurrente | Si ya había visitado antes | Calculado |
| Identificado | Si dejó datos | Declarado |
| Lead | Si cumple la definición de lead | Calculado |
| Comprador | Si tiene una venta asociada | Registrado |
| Ingreso acumulado | Suma de compras no devueltas | Calculado |

### D-04. Sesión

Unidad central de comportamiento.

| Campo | Descripción | Origen |
|---|---|---|
| Identificador | Clave de sesión | Observado |
| Visitante y negocio | Relaciones | Observado |
| Inicio y fin | Marcas temporales | Observado |
| Duración | Segundos activos | Calculado |
| Fuente y medio | Origen | Observado |
| Campaña | Punto de contacto | Importado |
| Dispositivo, sistema, navegador | Contexto | Observado |
| Página de entrada | Primera página | Observado |
| Páginas vistas | Lista con ruta, etiqueta, scroll, clics, segundos y hora | Observado |
| Número de páginas | Conteo | Calculado |
| Scroll medio | Profundidad promedio | Calculado |
| Clics | Total de clics | Observado |
| Evaluación iniciada / completada | Estado del test | Observado |
| Pasos de evaluación | Pregunta, respuesta, tiempo, cambios, omisiones | Declarado |
| Formulario iniciado / enviado | Estado | Observado |
| Campos del formulario | Foco, completado, error, abandono, tiempo | Observado |
| Tiempo en formulario | Segundos | Calculado |
| Cita agendada / confirmada / asistida | Estado comercial | Registrado |
| Compra, cotización, lead | Resultados | Registrado |
| Ingreso | Importe asociado | Registrado |
| Error técnico | Si ocurrió un fallo | Observado |

### D-05. Evento

Registro atómico de una interacción. Se detalla en el Entregable 3.

### D-06. Evaluación (respuesta por paso)

| Campo | Descripción | Origen |
|---|---|---|
| Pregunta | Identificador y texto | Configuración |
| Paso | Posición en el test | Configuración |
| Vista | Si la pregunta se mostró | Observado |
| Respondida | Si hubo respuesta | Declarado |
| Respuesta | Opción o valor elegido | Declarado |
| Tiempo | Milisegundos dedicados | Observado |
| Cambio | Si modificó la respuesta | Observado |
| Omisión | Si saltó la pregunta | Observado |

**Clasificación:** dato sensible cuando la pregunta se refiere a salud visual. Acceso restringido y prohibido su envío a plataformas publicitarias.

### D-07. Formulario (campo)

| Campo | Descripción | Origen |
|---|---|---|
| Nombre del campo | Identificador funcional | Configuración |
| Foco | Si recibió atención | Observado |
| Completado | Si se llenó | Observado |
| Error | Si produjo un error de validación | Observado |
| Abandono | Si se dejó vacío al salir | Observado |
| Tiempo | Duración de interacción | Observado |

**Regla:** nunca se almacena el contenido de campos sensibles (contraseñas, documentos, datos de salud) dentro de la analítica.

### D-08. Cita

| Campo | Descripción | Origen |
|---|---|---|
| Identificador | Clave de cita | Registrado |
| Negocio, visitante, sesión | Relaciones | Registrado |
| Campaña | Origen atribuido | Importado / inferido |
| Fecha de creación | Cuándo se agendó | Registrado |
| Fecha de cita | Cuándo se atenderá | Registrado |
| Estado | Pendiente, confirmada, atendida, no asistió, cancelada, reagendada | Registrado |
| Recordatorio | Ninguno, 24 h, 48 h, 24 h + 2 h | Registrado |
| Anticipación | Horas entre agendamiento y cita | Calculado |
| Fuente | Origen declarado | Registrado |

### D-09. Comunicación

| Campo | Descripción | Origen |
|---|---|---|
| Identificador | Clave de contacto | Registrado |
| Negocio, visitante, sesión | Relaciones | Registrado |
| Canal | WhatsApp, llamada, correo | Registrado |
| Dirección | Saliente o entrante | Registrado |
| Envío y respuesta | Marcas temporales | Registrado |
| Respondió | Solo si hay evidencia de respuesta | Registrado |
| Estado | Pendiente, enviado, entregado, respondido, sin respuesta | Registrado |
| Resultado | Interesado, agendado, compró, no interesado, sin respuesta, pendiente | Registrado |
| Primer contacto | Si es el primer intento | Registrado |
| Minutos hasta respuesta | Diferencia temporal | Calculado |
| Notas | Observación autorizada | Registrado |

**Regla:** «enviado» o «entregado» no equivale a «leído» ni a «respondido».

### D-10. Venta

| Campo | Descripción | Origen |
|---|---|---|
| Identificador | Clave de venta | Registrado |
| Negocio, visitante, sesión | Relaciones | Registrado |
| Campaña | Atribución estimada | Inferido |
| Fecha | Momento de la venta | Registrado |
| Producto y categoría | Bien o servicio | Registrado |
| Cantidad | Unidades | Registrado |
| Precio, descuento, total | Importes | Registrado |
| Costo | Costo directo | Registrado |
| Estado de pago | Pagado total, parcial, pendiente, devuelto | Registrado |
| Vendedor | Responsable | Registrado |
| Origen | Fuente declarada | Registrado |
| Primer contacto | Fecha del primer punto de contacto | Inferido |
| Días hasta cierre | Diferencia entre primer contacto y venta | Calculado |

### D-11. Experimento

| Campo | Descripción | Origen |
|---|---|---|
| Identificador y nombre | Clave y título | Configuración |
| Negocio | Negocio | Configuración |
| Hipótesis | Qué se espera y por qué | Declarado |
| Elemento | Qué se modifica | Configuración |
| Variantes | Nombre, visitantes y conversiones | Observado |
| Métrica principal | Indicador de decisión | Configuración |
| Fechas | Inicio y fin | Configuración |
| Estado | Borrador, en curso, finalizado | Configuración |
| Resultado | Lectura de los datos | Calculado |
| Confianza | Nivel estimado | Calculado |
| Decisión | Sin decisión, implementar, descartar, repetir | Declarado |

### D-12. Mejora

| Campo | Descripción | Origen |
|---|---|---|
| Identificador | Clave | Configuración |
| Negocio | Negocio | Configuración |
| Problema | Qué se detectó | Declarado |
| Recomendación | Qué se propone | Declarado |
| Acción | Qué se hizo | Declarado |
| Responsable | Quién ejecuta | Configuración |
| Fecha de implementación | Cuándo se aplicó | Registrado |
| Indicador | Métrica de evaluación | Configuración |
| Valor antes / después | Medición | Calculado |
| Unidad | Porcentaje, puntos o valor | Configuración |
| Estado | Pendiente, en curso, implementada, evaluada | Configuración |
| Conclusión | Qué se aprendió | Declarado |

### D-13. Vista guardada

| Campo | Descripción | Origen |
|---|---|---|
| Identificador y nombre | Clave y título | Configuración |
| Filtros | Combinación completa | Configuración |
| Propietario | Quién la creó | Configuración |
| Fecha | Cuándo se guardó | Configuración |

### D-14. Consentimiento

| Campo | Descripción | Origen |
|---|---|---|
| Estado | Otorgado, rechazado, pendiente, retirado | Declarado |
| Finalidad | Analítica, comunicación, ambas | Configuración |
| Fecha y hora | Momento del consentimiento | Observado |
| Versión del aviso | Texto aceptado | Configuración |
| Canal | Formulario, banner, presencial | Registrado |

### D-15. Configuración del negocio

| Campo | Descripción |
|---|---|
| Umbral de ausencia aceptable | Porcentaje a partir del cual se alerta |
| Umbral de abandono de evaluación | Porcentaje a partir del cual se alerta |
| Ventana de actividad en vivo | Minutos considerados «ahora» |
| Definición de lead | Regla del negocio |
| Moneda y formato | Presentación de importes |
| Retención por tipo de dato | Días o años |
| Zona horaria | Base de los cortes diarios |

## 2.2 Reglas de clasificación y uso

| Clase | Se puede mostrar | Se puede exportar | Se puede enviar a terceros | Requiere consentimiento |
|---|---|---|---|---|
| Observado | Sí, agregado | Sí, agregado | Solo datos no personales | Sí |
| Declarado | Sí, con control de acceso | Solo con autorización | No si es sensible | Sí |
| Registrado por el negocio | Sí | Sí, con autorización | No | Según finalidad |
| Importado | Sí | Sí | No aplica | No |
| Calculado | Sí, con fórmula | Sí | No | Hereda del origen |
| Inferido / predicho | Sí, marcado como estimación | Solo con advertencia | No | Hereda del origen |
| Salud visual | Solo personal autorizado | No por defecto | Prohibido | Sí, explícito |

## 2.3 Retención funcional

| Dato | Retención por defecto | Al vencer |
|---|---|---|
| Eventos de navegación | 90 días | Se elimina el detalle; se conservan agregados. |
| Datos de formulario | 90 días | Se eliminan salvo relación comercial activa u obligación legal. |
| Datos de salud visual | 90 días | Se eliminan o anonimizan. |
| Citas | 24 meses | Se eliminan o anonimizan. |
| Comunicaciones | 24 meses | Se eliminan o anonimizan. |
| Ventas y facturación | 7 años | Se conservan por obligación contable. |
| Experimentos y mejoras | Permanente | Se archivan. |
| Vistas guardadas | Hasta eliminación | Se eliminan. |
| Consentimientos | Mientras dure la relación + plazo legal | Se archivan como evidencia. |

## 2.4 Criterios de aceptación del catálogo de datos

- Cada campo visible en la interfaz está asociado a una de las seis clases de origen.
- Ningún campo sensible aparece en exportaciones por defecto.
- Toda entidad tiene identificador estable, negocio y fecha.
- Los datos calculados indican su fórmula en la ayuda contextual.
- Los datos inferidos llevan marca visible de estimación.

---

# ENTREGABLE 3 — CATÁLOGO DE EVENTOS

## 3.1 Convenciones

- **Nombre:** verbo en pasado o sustantivo de acción, sin espacios.
- **Momento:** cuándo se emite exactamente.
- **Propiedades comunes:** negocio, sesión, visitante seudónimo, fecha y hora, página, etiqueta.
- **Propiedades específicas:** solo las necesarias para el análisis. Nunca contenido sensible.
- **Volumen:** se controla para evitar duplicados por recargas o reintentos.

## 3.2 Eventos de navegación

| Evento | Cuándo se emite | Propiedades específicas | Módulos que lo usan |
|---|---|---|---|
| `visita` | Al iniciar una sesión nueva | Fuente, medio, campaña, dispositivo, página de entrada | 01, 02, 03, 04, 15, 16, 17 |
| `page_view` | Al mostrarse una página | Ruta, etiqueta, hora | 01, 05, 06, 07, 11, 15 |
| `scroll` | Al alcanzar un umbral de profundidad (25, 50, 75, 90 %) | Porcentaje, ruta | 05, 06, 17 |
| `click` | Al hacer clic en un elemento interactivo | Ruta, etiqueta del elemento, coordenada relativa X/Y | 05, 06, 07, 15 |
| `interaccion` | Al usar un componente relevante (acordeón, selector, video) | Tipo, etiqueta | 05, 06, 09, 17 |
| `exit` | Al salir o cerrar la sesión | Última página, segundos totales | 05, 07, 10 |
| `error` | Al producirse un fallo visible | Código, ruta, tipo | 01, 03, 07, 17 |

## 3.3 Eventos de evaluación

| Evento | Cuándo se emite | Propiedades específicas | Módulos |
|---|---|---|---|
| `quiz_start` | Al abrir la primera pregunta | Identificador del test | 08, 10, 11, 17 |
| `quiz_step` | Al mostrarse cada pregunta | Identificador, texto, paso, tiempo | 08, 10, 11 |
| `quiz_change` | Al modificar una respuesta | Pregunta, valor anterior y nuevo | 08 |
| `quiz_complete` | Al terminar la última pregunta | Total de pasos, tiempo total | 01, 08, 10, 11, 15, 17 |

**Límite:** el contenido de la respuesta puede ser sensible. Se guarda para análisis autorizado, no para publicidad.

## 3.4 Eventos de formulario y lead

| Evento | Cuándo se emite | Propiedades específicas | Módulos |
|---|---|---|---|
| `form_start` | Al enfocar el primer campo | Formulario, página | 09, 10, 11, 17 |
| `form_field` | Al enfocar, completar o fallar un campo | Campo, acción, tiempo | 09, 10 |
| `form_submit` | Al enviarse correctamente | Formulario, campos completados | 01, 02, 09, 10, 11, 13, 15 |
| `form_abandon` | Al salir sin enviar | Último campo, tiempo | 09, 10, 11 |
| `lead` | Al quedar un lead válido | Definición aplicada, calidad estimada | 01, 09, 13, 15 |

**Regla:** `form_submit` y `lead` son eventos distintos. Un envío puede no cumplir la definición de lead del negocio.

## 3.5 Eventos comerciales

| Evento | Cuándo se emite | Propiedades específicas | Módulos |
|---|---|---|---|
| `booking` | Al agendar una cita | Fecha de cita, recordatorio, anticipación | 01, 10, 11, 12, 15 |
| `booking_confirm` | Al confirmar la cita | Canal de confirmación | 12 |
| `appointment_attend` | Al registrarse la asistencia | Fecha real, notas autorizadas | 01, 11, 12, 14, 20 |
| `appointment_noshow` | Al registrarse la ausencia | Motivo si existe | 12, 13, 20 |
| `whatsapp` | Al iniciar o responder una conversación | Canal, dirección, primer contacto | 13, 15 |
| `sale` | Al registrar una venta | Producto, cantidad, total, costo, estado de pago, vendedor | 01, 11, 14, 15, 20 |

## 3.6 Eventos de calidad y control

| Evento | Cuándo se emite | Uso |
|---|---|---|
| `datos_incompletos` | Cuando falta un campo obligatorio para el análisis | Registro de cobertura. |
| `atribucion_ambigua` | Cuando un resultado tiene más de un origen plausible | Marca de estimación. |
| `consentimiento_otorgado` | Cuando la persona acepta | Habilita captura. |
| `consentimiento_retirado` | Cuando la persona revoca | Detiene captura y programa eliminación. |
| `exportacion_realizada` | Cuando se exporta un conjunto | Auditoría. |
| `acceso_restringido` | Cuando se consulta dato sensible | Auditoría. |

## 3.7 Reglas de emisión

1. **Una vez:** los eventos de estado (`quiz_complete`, `form_submit`, `sale`) no se duplican por recarga.
2. **Con contexto:** todo evento lleva negocio, sesión, visitante seudónimo y hora.
3. **Sin contenido sensible:** nunca se captura texto tecleado en campos de salud, documentos o contraseñas.
4. **Con consentimiento:** si no hay consentimiento de analítica, no se emiten eventos de navegación; solo se registra el rechazo.
5. **Con límite:** el detalle de clics y scroll se conserva 90 días; después solo agregados.
6. **Sin fingerprinting:** no se combinan características del dispositivo para identificar personas entre sitios.

## 3.8 Criterios de aceptación del catálogo de eventos

- Todo evento tiene nombre, momento, propiedades y módulos consumidores definidos.
- No existe evento que capture contenido de salud, documentos o contraseñas.
- Los eventos críticos son idempotentes.
- Todo evento permite reconstruir la sesión a la que pertenece.
- La ausencia de un evento esperado se reporta como problema de calidad.

---

# ENTREGABLE 4 — CATÁLOGO DE ANÁLISIS

## 4.1 Indicadores base

| ID | Indicador | Definición | Origen | Módulos |
|---|---|---|---|---|
| A-01 | Visitantes | Personas seudónimas distintas con al menos una sesión | Calculado | Todos |
| A-02 | Visitantes nuevos | Primera visita dentro del período | Calculado | 01, 02, 15 |
| A-03 | Visitantes recurrentes | Con visita anterior al período | Calculado | 01, 02, 15 |
| A-04 | Sesiones | Conteo de sesiones | Calculado | Todos |
| A-05 | Interactuaron | Sesiones con scroll ≥ 40 % o ≥ 2 clics | Calculado | 01, 05, 10 |
| A-06 | Evaluaciones iniciadas | Sesiones con `quiz_start` | Calculado | 08, 10 |
| A-07 | Evaluaciones completadas | Sesiones con `quiz_complete` | Calculado | 08, 10 |
| A-08 | Tasa de finalización | Completadas / iniciadas | Calculado | 08, 10 |
| A-09 | Abandono de evaluación | 1 − tasa de finalización | Calculado | 01, 08, 10 |
| A-10 | Leads | Personas que cumplen la definición de lead | Calculado | 01, 09, 13 |
| A-11 | Citas | Citas agendadas en el período | Registrado | 01, 12 |
| A-12 | Confirmadas | Citas con confirmación explícita | Registrado | 12 |
| A-13 | Asistencias | Citas con asistencia registrada | Registrado | 01, 12, 14 |
| A-14 | Ausencias | Citas no asistidas | Registrado | 12 |
| A-15 | Cotizaciones | Sesiones con cotización emitida | Registrado | 01, 14 |
| A-16 | Compras | Personas distintas con venta no devuelta | Registrado | 01, 14 |
| A-17 | Ingresos | Suma de ventas no devueltas | Calculado | 01, 14, 21 |
| A-18 | Ticket medio | Ingresos / compras | Calculado | 01, 14 |
| A-19 | Inversión | Suma de inversión diaria de campañas activas | Importado | 01, 04, 14 |
| A-20 | CPL | Inversión / leads | Calculado | 01, 04, 09 |
| A-21 | CPA | Inversión / citas | Calculado | 04, 12 |
| A-22 | CAC | Inversión / compras | Calculado | 01, 14 |
| A-23 | ROAS | Ingresos / inversión | Calculado | 01, 04, 14, 21 |
| A-24 | ROI | (Ingresos − costo) / inversión × 100 | Calculado | 01, 14 |
| A-25 | Conversión | Compras / visitantes | Calculado | Todos |
| A-26 | Margen bruto | (Ingresos − costo) / ingresos × 100 | Calculado | 14 |
| A-27 | Activos ahora | Sesiones con actividad en la ventana en vivo | Calculado | 03 |
| A-28 | Tiempo medio de sesión | Suma de duraciones / sesiones | Calculado | 05, 17 |
| A-29 | Scroll medio | Promedio de profundidad máxima por página | Calculado | 05, 06, 17 |
| A-30 | Tasa de salida | Salidas en página / vistas de página | Calculado | 05 |

## 4.2 Análisis de adquisición

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| B-01 | Rendimiento por fuente | ¿Qué origen trae más valor? | Agrupar por fuente: visitantes, leads, citas, compras, ingresos, inversión, ROAS. | 04 |
| B-02 | Rendimiento por campaña | ¿Qué campaña conviene mantener? | Mismas métricas por campaña, con inversión diaria prorrateada. | 04 |
| B-03 | Rendimiento por anuncio y creatividad | ¿Qué pieza funciona mejor? | Agrupar por anuncio y creatividad. | 04 |
| B-04 | Costo por resultado | ¿Cuánto cuesta un lead, una cita o una compra? | Inversión / resultado correspondiente. | 04, 09, 12 |
| B-05 | Calidad de la fuente | ¿Los leads de una fuente compran? | Leads → citas → asistencias → compras por fuente. | 04, 13, 14 |
| B-06 | Comparación de períodos | ¿Mejoramos o empeoramos? | Variación absoluta y porcentual contra el período anterior. | 01, 04 |

**Advertencia funcional:** la atribución por sesión no demuestra que la campaña haya causado la venta. Se muestra como «atribuido», nunca como «causado».

## 4.3 Análisis de audiencia

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| C-01 | Nuevos vs recurrentes | ¿Cuánto depende del tráfico nuevo? | Conteo y valor por tipo de visitante. | 02, 15 |
| C-02 | Frecuencia de visita | ¿Cuántas veces vuelven? | Distribución de sesiones por visitante. | 02 |
| C-03 | Valor por visitante | ¿Qué aporta cada persona? | Ingresos atribuidos / visitantes. | 02, 14 |
| C-04 | Composición geográfica | ¿De dónde llegan? | Agrupar por ciudad y país (aproximado). | 02 |
| C-05 | Composición tecnológica | ¿Con qué navegan? | Dispositivo, sistema y navegador. | 02, 17 |
| C-06 | Segmentos predefinidos | ¿Cómo se comporta cada grupo? | Compradores, no compradores, leads, sin seguimiento, abandono, móvil, nuevos, recurrentes. | 15 |
| C-07 | Comparación compradores vs no compradores | ¿Qué distingue a quien compra? | Porcentaje que realiza cada acción en cada grupo. | 15 |
| C-08 | Rasgos del segmento | ¿Qué define al segmento? | Fuente dominante, página más vista, dispositivo, conversión. | 15 |

## 4.4 Análisis de comportamiento

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| D-01 | Páginas más vistas | ¿Qué contenido atrae? | Vistas, visitantes, tiempo medio, scroll medio. | 05 |
| D-02 | Profundidad de lectura | ¿Se lee el contenido? | Distribución de scroll por página. | 05, 06 |
| D-03 | Interacción por elemento | ¿Qué se pulsa? | Conteo de clics por etiqueta y página. | 05, 06 |
| D-04 | Páginas de salida | ¿Dónde se van? | Última página de la sesión / vistas. | 05, 10 |
| D-05 | Ruta de navegación | ¿Qué camino siguen? | Secuencia de páginas por sesión. | 05, 11 |
| D-06 | Mapa de calor de clics | ¿Dónde se concentra la atención? | Densidad de clics por coordenada relativa. | 06 |
| D-07 | Mapa de calor de scroll | ¿Hasta dónde llegan? | Profundidad alcanzada por página. | 06 |
| D-08 | Reproducción de sesión | ¿Cómo fue una visita concreta? | Secuencia temporal de eventos agregados. | 07 |

**Límite del replay:** se reproduce la secuencia de páginas, clics y scroll, no el contenido de campos ni la pantalla literal. Es una reconstrucción, no una grabación de video.

## 4.5 Análisis de conversión

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| E-01 | Embudo completo | ¿Dónde se pierde más? | Visitantes → interacción → evaluación → datos → cita → asistencia → compra. | 01, 10 |
| E-02 | Caída por etapa | ¿Qué paso pierde más? | Diferencia porcentual entre etapas consecutivas. | 10 |
| E-03 | Tiempo entre etapas | ¿Cuánto tarda el avance? | Horas o días entre hitos. | 10, 11 |
| E-04 | Embudo por dispositivo | ¿El móvil pierde más? | Mismo embudo segmentado por dispositivo. | 17 |
| E-05 | Embudo por fuente | ¿Qué origen convierte mejor? | Mismo embudo segmentado por fuente. | 04, 10 |
| E-06 | Pregunta con mayor abandono | ¿Qué pregunta frena el test? | Abandonos por paso / vistas del paso. | 08 |
| E-07 | Respuesta más frecuente | ¿Qué declara la audiencia? | Distribución de respuestas por pregunta. | 08 |
| E-08 | Campo con más error | ¿Qué campo del formulario falla? | Errores / intentos por campo. | 09 |
| E-09 | Campo con más abandono | ¿Dónde se deja el formulario? | Abandonos / focos por campo. | 09 |
| E-10 | Tiempo hasta completar | ¿El formulario es demasiado largo? | Segundos por campo y total. | 09 |
| E-11 | Recorrido por resultado | ¿Qué camino siguen los compradores? | Secuencias agrupadas y comparadas con no compradores. | 11 |
| E-12 | Días hasta compra | ¿Cuánto tarda el cierre? | Diferencia entre primer contacto y venta. | 11, 14 |

## 4.6 Análisis comercial

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| F-01 | Demanda por horario | ¿Cuándo se agendan las citas? | Citas por hora del día. | 12 |
| F-02 | Efectividad de recordatorios | ¿Qué recordatorio reduce ausencias? | Asistencia por esquema de recordatorio. | 12 |
| F-03 | Anticipación vs asistencia | ¿La anticipación afecta? | Asistencia por rango de horas. | 12 |
| F-04 | Citas a venta | ¿Cuántas citas terminan en compra? | Ventas / citas. | 12, 14 |
| F-05 | Asistencia a venta | ¿Cuántas asistencias compran? | Ventas / asistencias. | 12, 14 |
| F-06 | Ingreso por cita | ¿Cuánto deja cada cita? | Ingresos / citas. | 12 |
| F-07 | Leads sin seguimiento | ¿A quién no se contactó? | Leads sin comunicación registrada. | 13 |
| F-08 | Tasa de respuesta | ¿La gente contesta? | Comunicaciones respondidas / enviadas. | 13 |
| F-09 | Tiempo de primera respuesta | ¿Se responde rápido? | Minutos hasta la respuesta. | 13 |
| F-10 | Contacto antes de 24 h | ¿Se atiende a tiempo? | Primeros contactos < 24 h / leads. | 13 |
| F-11 | Efectividad por canal | ¿WhatsApp, llamada o correo? | Enviados, respondidos, ventas por canal. | 13 |
| F-12 | Resultado de seguimientos | ¿En qué termina el contacto? | Distribución por resultado. | 13 |
| F-13 | Ventas por producto | ¿Qué se vende más? | Ingresos, unidades y participación. | 14 |
| F-14 | Ventas por vendedor | ¿Quién genera resultados? | Ingresos por vendedor. | 14 |
| F-15 | Estado de pago | ¿Cuánto está pendiente? | Distribución por estado de pago. | 14 |
| F-16 | Devoluciones | ¿Cuánto se devuelve? | Ventas devueltas / ventas. | 14 |
| F-17 | Ingreso por visitante | ¿Cuánto vale el tráfico? | Ingresos / visitantes. | 14 |

## 4.7 Análisis temporal

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| G-01 | Serie diaria | ¿Cómo evoluciona? | Métricas por día. | 01, 14, 16 |
| G-02 | Mejor y peor día de la semana | ¿Cuándo hay más actividad? | Agrupar por día de semana. | 16 |
| G-03 | Patrón horario | ¿A qué hora ocurre? | Sesiones, leads y ventas por hora. | 16 |
| G-04 | Matriz hora × día | ¿Cuándo se concentra? | Cruce de hora y día. | 16 |
| G-05 | Variación semanal | ¿Sube o baja? | Última semana vs anterior. | 16 |
| G-06 | Detección de anomalías | ¿Qué día se desvía? | Desviación estándar ≥ 2 respecto a la media. | 16 |
| G-07 | Comparación de período | ¿Qué cambió? | Serie actual vs anterior. | 01, 16 |

**Lenguaje obligatorio:** una anomalía es una desviación estadística. No se etiqueta como causa. Se sugiere revisar campañas, cambios de sitio y estacionalidad.

## 4.8 Análisis de optimización

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| H-01 | Conversión por variante | ¿Qué versión gana? | Conversiones / visitantes por variante. | 18 |
| H-02 | Diferencia entre variantes | ¿La diferencia es relevante? | Diferencia en puntos porcentuales. | 18 |
| H-03 | Confianza de la prueba | ¿Podemos decidir? | Nivel declarado según volumen y diferencia. | 18 |
| H-04 | Mejora antes/después | ¿La acción funcionó? | Valor después − valor antes. | 20 |
| H-05 | Mejora media | ¿Cuánto mejoramos? | Promedio de cambios, en puntos o porcentaje. | 20 |
| H-06 | Iniciativas confirmadas | ¿Cuántas funcionaron? | Cambios positivos / evaluadas. | 20 |
| H-07 | Iniciativas sin efecto | ¿Cuántas no funcionaron? | Cambios nulos o negativos / evaluadas. | 20 |

**Regla de decisión:** con confianza menor a 80 % no se declara ganador. Se recomienda repetir o ampliar la muestra.

## 4.9 Análisis comparativo entre negocios

| ID | Análisis | Pregunta | Cálculo | Módulo |
|---|---|---|---|---|
| I-01 | Comparación consolidada | ¿Cómo se compara cada negocio? | Visitantes, leads, citas, ventas, ingresos, inversión, ROAS y conversión. | 21 |
| I-02 | Participación de ingresos | ¿Qué peso tiene cada negocio? | Ingresos del negocio / ingresos totales. | 21 |
| I-03 | Eficiencia publicitaria | ¿Quién invierte mejor? | ROAS y CAC por negocio. | 21 |
| I-04 | Ranking de conversión | ¿Quién convierte mejor? | Conversión por negocio. | 21 |

**Regla:** la comparación es de métricas agregadas. Nunca se cruzan identidades entre negocios.

## 4.10 Reglas de cálculo

1. **Período:** los cortes diarios usan la zona horaria del negocio.
2. **Personas vs sesiones:** los indicadores de personas cuentan identidades seudónimas distintas; los de actividad cuentan sesiones.
3. **Ventas devueltas:** se excluyen de ingresos, compras y ticket, pero se muestran en devoluciones.
4. **Inversión:** solo campañas activas en el período; se prorratea por días.
5. **Promedios:** se calculan sobre registros válidos, no sobre ceros artificiales.
6. **Redondeo:** se muestra con un decimal en tasas y sin decimales en conteos.
7. **División por cero:** se muestra «—», no «0 %».
8. **Comparación:** si el período anterior no tiene datos, se indica «sin base comparable».

## 4.11 Criterios de aceptación de los análisis

- Cada indicador tiene definición, fórmula, origen y módulo.
- Toda tasa muestra numerador y denominador en la ayuda contextual.
- Los análisis segmentados usan la misma definición que el análisis global.
- Los resultados sin volumen suficiente se marcan explícitamente.
- Ningún análisis afirma causalidad.

---

# ENTREGABLE 5 — CATÁLOGO DE VISUALIZACIONES

## 5.1 Principios visuales

- **Una pregunta por visualización.** Si necesita dos preguntas, se divide en dos.
- **Jerarquía:** primero el resultado, después la explicación, después el detalle.
- **Color con significado:** verde para resultado positivo, ámbar para atención, rojo para problema, cian para neutral/observado, violeta para estimación o inteligencia.
- **Consistencia:** el mismo indicador usa el mismo color y la misma escala en todos los módulos.
- **Densidad controlada:** máximo 8 tarjetas por fila; máximo 4 series por gráfico de líneas.
- **Accesibilidad:** todo gráfico tiene título, subtítulo, unidad y una tabla o resumen textual equivalente.

## 5.2 Catálogo de componentes

| ID | Visualización | Cuándo usarla | Cuándo evitarla | Módulos |
|---|---|---|---|---|
| V-01 | **Tarjeta de indicador** | Mostrar un valor único con variación y contexto. | Cuando el valor necesita una serie para entenderse. | Todos |
| V-02 | **Línea temporal** | Evolución diaria o comparación de períodos. | Pocos puntos o categorías no ordenadas. | 01, 14, 16 |
| V-03 | **Barras verticales** | Comparar categorías o momentos. | Series temporales largas. | 04, 05, 08, 12, 16, 17 |
| V-04 | **Barras horizontales** | Rankings con etiquetas largas. | Cuando el orden no importa. | 02, 04, 12, 14 |
| V-05 | **Barras agrupadas** | Comparar dos o tres series por categoría. | Más de tres series. | 13, 16, 17, 20 |
| V-06 | **Barras apiladas** | Mostrar composición y total. | Cuando la comparación entre partes es lo principal. | 04, 09 |
| V-07 | **Dona** | Participación de pocas categorías (máximo 6). | Muchas categorías o valores muy parecidos. | 01, 12, 13, 14, 21 |
| V-08 | **Embudo** | Pérdida entre etapas ordenadas. | Etapas sin orden natural. | 01, 10, 17 |
| V-09 | **Sankey** | Flujo entre origen, entrada y resultado. | Más de cuatro columnas o muchos nodos. | 11 |
| V-10 | **Mapa de calor** | Densidad de clics o scroll sobre una página. | Datos sin coordenada o con poco volumen. | 06, 16 |
| V-11 | **Matriz** | Cruce de dos dimensiones (hora × día). | Cuando una dimensión tiene muchas categorías. | 16, 17 |
| V-12 | **Tabla de datos** | Evidencia individual y comparación exacta. | Como única visualización de una tendencia. | 02, 05, 09, 12, 13, 14, 17, 21, 22 |
| V-13 | **Línea de tiempo de sesión** | Reconstruir un recorrido individual. | Para agregados. | 07, 11 |
| V-14 | **Tarjeta de hallazgo** | Explicar un insight con evidencia y acción. | Para mostrar datos sin interpretación. | 19 |
| V-15 | **Barra de progreso** | Mostrar avance de una iniciativa o una meta. | Para comparar categorías. | 20 |
| V-16 | **Etiqueta de estado** | Señalar origen, confianza o severidad. | Para reemplazar un valor. | Todos |
| V-17 | **Comparador de segmentos** | Alternar audiencias y ver el mismo conjunto de métricas. | Cuando los segmentos no son comparables. | 11, 15 |

## 5.3 Reglas por tipo de dato

| Tipo de dato | Visualización recomendada | Requisito |
|---|---|---|
| Conteo | Tarjeta o barras | Unidad explícita. |
| Tasa o porcentaje | Tarjeta, barra o embudo | Numerador y denominador disponibles. |
| Dinero | Tarjeta, línea o barras | Moneda y período visibles. |
| Tiempo | Barras o distribución | Unidad (segundos, minutos, horas, días). |
| Categoría | Barras horizontales o dona | Orden por valor y máximo de categorías. |
| Secuencia | Sankey o línea de tiempo | Nodos legibles y sin cruces excesivos. |
| Densidad | Mapa de calor | Escala visible y leyenda. |
| Comparación | Línea con dos series o barras agrupadas | Período anterior claramente identificado. |
| Estimación | Cualquier visualización + etiqueta | Marca visible de «estimado» o «inferido». |

## 5.4 Estados visuales obligatorios

| Estado | Representación |
|---|---|
| **Cargando** | Esqueleto o indicador de progreso, nunca un gráfico vacío. |
| **Sin datos** | Mensaje explicativo y acción sugerida. |
| **Datos insuficientes** | Valor visible con etiqueta de muestra insuficiente. |
| **Error** | Mensaje claro, opción de reintentar y código de referencia. |
| **Parcial** | Aviso de cobertura incompleta. |
| **Demostración** | Marca permanente de «MODO DEMO». |

## 5.5 Reglas de color y etiquetado

- El color nunca es el único portador de significado: siempre va acompañado de texto o icono.
- Las series comparadas usan colores estables entre módulos.
- Las etiquetas de origen usan un código consistente: observado (cian), declarado (verde), registrado (violeta), importado (ámbar), calculado (azul), inferido (rosa).
- Los importes se muestran con separador de miles y símbolo de moneda.
- Las fechas se muestran en formato local corto; las horas con dos dígitos.
- Los ejes comienzan en cero salvo que se indique lo contrario y se explique.

## 5.6 Criterios de aceptación de las visualizaciones

- Toda visualización tiene título, subtítulo, unidad y período.
- Toda visualización tiene estado vacío y estado de error.
- Ninguna dona supera seis categorías.
- Ninguna línea supera cuatro series.
- Todo gráfico tiene una alternativa textual o tabla.
- Los colores cumplen contraste suficiente para lectura en pantalla.

---

# ENTREGABLE 6 — CENTRO DE INTELIGENCIA

## 6.1 Propósito

Convertir datos en decisiones explicables. El centro no adivina: aplica reglas sobre los datos del período, muestra la evidencia, declara el volumen, estima la confianza y propone una acción medible.

## 6.2 Estructura de un hallazgo

Todo hallazgo debe contener:

| Elemento | Descripción |
|---|---|
| **Identificador** | Clave estable del hallazgo. |
| **Severidad** | Funciona, no funciona, a vigilar, informativo. |
| **Área** | Adquisición, comportamiento, evaluaciones, formularios, citas, ventas, seguimiento, experiencia. |
| **Título** | Qué ocurre, en una frase. |
| **Descripción** | Explicación breve y comprensible. |
| **Evidencia** | Datos concretos que lo respaldan. |
| **Indicador y valor** | Métrica principal y su resultado. |
| **Comparación** | Contra período anterior, otro segmento o referencia. |
| **Recomendación** | Qué hacer, en lenguaje accionable. |
| **Impacto esperado** | Alto, medio o bajo. |
| **Esfuerzo** | Alto, medio o bajo. |
| **Prioridad** | Orden calculado. |
| **Confianza** | Alta, media o baja, según volumen y consistencia. |
| **Puntos de datos** | Cuántos registros sostienen el hallazgo. |
| **Acciones sugeridas** | Lista corta de pasos concretos. |

## 6.3 Reglas de detección

| ID | Regla | Condición | Severidad | Módulos relacionados |
|---|---|---|---|---|
| R-01 | Leads sin seguimiento | Existen leads sin comunicación registrada. | No funciona | 13, 09 |
| R-02 | Primer contacto lento | Menos del 50 % de leads contactados antes de 24 h. | A vigilar | 13 |
| R-03 | Abandono alto de evaluación | Abandono > 40 % con al menos 20 inicios. | No funciona | 08, 10 |
| R-04 | Pregunta crítica | Una pregunta concentra > 25 % de los abandonos. | No funciona | 08 |
| R-05 | Campo problemático | Un campo concentra > 30 % de errores o abandonos. | No funciona | 09 |
| R-06 | Brecha móvil | Conversión móvil al menos 5 puntos por debajo de escritorio. | A vigilar | 17 |
| R-07 | Página de salida | Una página concentra > 40 % de las salidas. | A vigilar | 05, 10 |
| R-08 | Fuente ineficiente | Fuente con inversión y ROAS < 1. | No funciona | 04, 14 |
| R-09 | Campaña eficiente | Campaña con ROAS ≥ 2 y al menos 5 compras. | Funciona | 04 |
| R-10 | Ausencia alta en citas | Ausencia > 15 %. | No funciona | 12 |
| R-11 | Recordatorio eficaz | Un esquema supera en 10 puntos la asistencia de otro con volumen suficiente. | Funciona | 12 |
| R-12 | Cita sin venta | Más del 70 % de asistencias sin compra registrada. | A vigilar | 12, 14 |
| R-13 | Concentración horaria | Una franja concentra > 40 % de las citas. | Informativo | 12, 16 |
| R-14 | Anomalía temporal | Un día se desvía ≥ 2 desviaciones estándar. | A vigilar | 16 |
| R-15 | Caída semanal | Última semana cae > 20 % frente a la anterior. | A vigilar | 16 |
| R-16 | Dependencia de una fuente | Una fuente aporta > 60 % de las compras. | A vigilar | 04 |
| R-17 | Buen ticket | Ticket medio por encima del período anterior con volumen suficiente. | Funciona | 14 |
| R-18 | Devoluciones altas | Devoluciones > 5 % de las ventas. | No funciona | 14 |
| R-19 | Recorrido comprador claro | Una secuencia concentra compradores con diferencia ≥ 15 puntos frente a no compradores. | Informativo | 11, 15 |
| R-20 | Experimento concluyente | Confianza ≥ 90 % y diferencia ≥ 5 puntos. | Funciona | 18 |
| R-21 | Experimento insuficiente | Confianza < 80 %. | A vigilar | 18 |
| R-22 | Mejora confirmada | Valor después > valor antes en el indicador objetivo. | Funciona | 20 |
| R-23 | Mejora sin efecto | Valor después ≤ valor antes. | A vigilar | 20 |

## 6.4 Confianza del hallazgo

| Nivel | Condición orientativa | Cómo se comunica |
|---|---|---|
| **Alta** | ≥ 100 registros relevantes, diferencia consistente en al menos dos períodos. | «Evidencia sólida en el período». |
| **Media** | Entre 30 y 99 registros, o diferencia en un solo período. | «Evidencia moderada; confirmar con más datos». |
| **Baja** | Menos de 30 registros o señales contradictorias. | «Muestra insuficiente; no tomar decisión definitiva». |

**Regla:** la confianza no depende solo del tamaño de la muestra. También considera la consistencia temporal y la calidad del dato.

## 6.5 Priorización de hallazgos

La prioridad combina impacto, esfuerzo y confianza:

1. **Impacto alto + esfuerzo bajo + confianza alta** → prioridad máxima.
2. **Impacto alto + esfuerzo medio** → prioridad alta.
3. **Impacto medio + esfuerzo bajo** → prioridad media-alta.
4. **Impacto alto + esfuerzo alto** → planificar, no ejecutar de inmediato.
5. **Confianza baja** → siempre por debajo de un hallazgo equivalente con confianza alta.

**Regla de transparencia:** la prioridad es una recomendación de orden, no una garantía de resultado.

## 6.6 Lenguaje y límites

El centro de inteligencia debe usar fórmulas como:

- «Los datos muestran una asociación entre…»
- «Esto no demuestra que… sea la causa».
- «Con el volumen actual, la conclusión es preliminar».
- «Se recomienda probar… y medir antes/después».

Debe evitar:

- «Esta campaña causó las ventas».
- «El cliente compró por…».
- «El resultado es definitivo» sin confianza suficiente.
- «La inteligencia artificial descubrió…» cuando solo se aplicaron reglas.

## 6.7 Ciclo de mejora

1. **Detectar:** el hallazgo aparece con evidencia.
2. **Decidir:** el responsable acepta, descarta o pide más datos.
3. **Registrar:** se crea una iniciativa con problema, recomendación y acción.
4. **Implementar:** se anota la fecha y el responsable.
5. **Evaluar:** se comparan valores antes y después con un período suficiente.
6. **Concluir:** se documenta si funcionó, no funcionó o no es concluyente.
7. **Aprender:** la conclusión queda asociada al hallazgo original.

**Período mínimo de evaluación:** 14 días o el volumen necesario para estabilizar el indicador, lo que sea mayor.

## 6.8 Criterios de aceptación del centro de inteligencia

- Todo hallazgo muestra evidencia, indicador, valor, confianza y acción.
- Ningún hallazgo se muestra sin volumen de datos.
- Las reglas son explicables y auditables.
- Un hallazgo puede convertirse en iniciativa de mejora en una sola acción.
- El lenguaje evita afirmaciones causales.
- Los hallazgos se filtran por severidad, área y prioridad.

---

# ENTREGABLE 7 — CASOS DE USO REALES

## 7.1 Caso A — Óptica Johanna (salud visual)

### Contexto

Negocio de optometría con evaluación visual en línea, agenda de citas presenciales y venta de lentes. El recorrido típico es: anuncio → página de evaluación → test visual → datos de contacto → cita → examen presencial → venta de lentes.

### Recorrido funcional

| Etapa | Qué ocurre | Dato generado | Módulo |
|---|---|---|---|
| 1. Descubrimiento | La persona ve un anuncio de examen visual. | Impresión y clic importados. | 04 |
| 2. Entrada | Llega a la página de evaluación. | Sesión, fuente, campaña, dispositivo. | 02, 04 |
| 3. Interés | Lee el contenido y empieza el test. | Scroll, clics, `quiz_start`. | 05, 06, 08 |
| 4. Evaluación | Responde preguntas sobre síntomas y uso de lentes. | Respuestas, tiempos, cambios, abandono. | 08 |
| 5. Contacto | Deja nombre y teléfono. | Lead declarado. | 09 |
| 6. Agenda | Elige fecha y hora. | Cita, recordatorio, anticipación. | 12 |
| 7. Confirmación | Confirma por WhatsApp. | Confirmación registrada. | 12, 13 |
| 8. Asistencia | Llega al local. | Asistencia registrada. | 12 |
| 9. Venta | Compra lentes o tratamiento. | Venta, producto, monto, margen. | 14 |
| 10. Seguimiento | Se contacta si no compró. | Comunicación y resultado. | 13 |

### Preguntas de negocio y respuestas esperadas

| Pregunta | Análisis | Visualización | Decisión |
|---|---|---|---|
| ¿Qué campaña trae pacientes que sí asisten? | B-01, B-05 | Barras comparativas por fuente | Reasignar inversión. |
| ¿En qué pregunta del test se abandona más? | E-06 | Barras por paso + tabla | Simplificar o reformular. |
| ¿El móvil completa menos el test? | E-04, C-05 | Embudo por dispositivo | Mejorar experiencia móvil. |
| ¿Qué recordatorio reduce las ausencias? | F-02 | Barras de asistencia por esquema | Estandarizar el mejor esquema. |
| ¿Cuántas citas terminan en venta? | F-04, F-05 | Tarjetas + barras | Ajustar expectativa comercial. |
| ¿Qué fuente tiene mejor ROAS? | B-01, B-04 | Barras + tabla | Priorizar presupuesto. |
| ¿Qué producto deja más margen? | F-13, A-26 | Dona + tabla | Enfocar la recomendación. |

### Hallazgos esperados

- **R-03 / R-04:** una pregunta sobre síntomas genera abandono por perceived invasiveness. Recomendación: explicar finalidad y permitir omitir.
- **R-06:** la evaluación no es usable en móvil; el botón de avance queda fuera de pantalla. Recomendación: rediseñar el paso.
- **R-10 / R-11:** las citas con doble recordatorio asisten más. Recomendación: activar 24 h + 2 h por defecto.
- **R-01:** leads de fin de semana sin contacto hasta el lunes. Recomendación: turno de respuesta o mensaje automático.
- **R-08:** una campaña de lentes de sol tiene ROAS bajo pero buen volumen. Recomendación: separar objetivo de marca y objetivo de venta.

### Límites del caso

- La evaluación no sustituye un examen optométrico presencial.
- Los datos de salud visual no se envían a plataformas publicitarias.
- La atribución de la venta a una campaña es una asociación por sesión, no una prueba causal.
- Una venta puede ocurrir semanas después y no registrarse; la cobertura debe declararse.

### Indicadores de éxito del caso

| Indicador | Línea base | Objetivo | Plazo |
|---|---|---|---|
| Tasa de finalización del test | Medir | +10 puntos | 30 días |
| Contacto antes de 24 h | Medir | ≥ 80 % | 30 días |
| Asistencia a citas | Medir | ≥ 80 % | 60 días |
| Citas a venta | Medir | +5 puntos | 90 días |
| ROAS global | Medir | ≥ 2 | 90 días |

---

## 7.2 Caso B — Mecánica Luis (taller automotriz)

### Contexto

Taller de frenos y mantenimiento. No cuenta con CRM local completo: las citas y ventas se registran parcialmente. El recorrido típico es: búsqueda o red social → página de servicio → solicitud de diagnóstico → contacto por WhatsApp → visita al taller → cotización → reparación → venta.

### Recorrido funcional

| Etapa | Qué ocurre | Dato generado | Módulo |
|---|---|---|---|
| 1. Descubrimiento | Busca «frenos cerca de mí» o ve una publicación. | Fuente, campaña, palabras clave. | 04 |
| 2. Entrada | Llega a la página del servicio. | Sesión, página de entrada, dispositivo. | 02, 05 |
| 3. Interés | Revisa precios, servicios y horarios. | Scroll, clics, tiempo. | 05, 06 |
| 4. Contacto | Pulsa WhatsApp o llena el formulario. | `whatsapp` o lead. | 09, 13 |
| 5. Conversación | Pregunta por disponibilidad y precio. | Comunicación, respuesta, tiempo. | 13 |
| 6. Visita | Acude al taller. | Cita o visita registrada. | 12 |
| 7. Cotización | Recibe diagnóstico y presupuesto. | Cotización. | 14 |
| 8. Reparación | Autoriza el trabajo. | Venta, producto, monto. | 14 |
| 9. Postventa | Se contacta para seguimiento. | Comunicación y resultado. | 13 |

### Particularidad del caso

Al no existir CRM completo, la plataforma debe:

- Declarar qué datos son **registrados** y cuáles son **estimados**.
- Permitir registrar citas y ventas de forma manual y rápida.
- No inventar ventas faltantes ni completar silenciosamente la cobertura.
- Medir el negocio con indicadores disponibles, aunque sean parciales.
- Distinguir «no se registró» de «no ocurrió».

### Preguntas de negocio y respuestas esperadas

| Pregunta | Análisis | Visualización | Decisión |
|---|---|---|---|
| ¿Qué servicio genera más consultas? | D-01, B-03 | Barras por página y anuncio | Crear contenido específico. |
| ¿Cuántos contactos de WhatsApp terminan en visita? | F-08, F-12 | Embudo + tabla | Mejorar guion de respuesta. |
| ¿Se responde rápido? | F-09, F-10 | Tarjetas + distribución | Definir tiempo objetivo. |
| ¿Qué día y hora hay más solicitudes? | G-02, G-03 | Matriz hora × día | Ajustar horario de atención. |
| ¿Qué campaña trae consultas de alto valor? | B-01, F-13 | Tabla comparativa | Priorizar presupuesto. |
| ¿Cuánto se pierde entre cotización y venta? | E-01, F-06 | Embudo | Revisar precio y seguimiento. |

### Hallazgos esperados

- **R-01:** consultas de WhatsApp sin respuesta en horario de cierre. Recomendación: mensaje de bienvenida con tiempo estimado.
- **R-07:** la página de precios es la principal salida. Recomendación: mostrar rangos y una llamada a la acción clara.
- **R-12:** muchas visitas sin venta registrada. Recomendación: registrar el motivo de no compra.
- **R-15:** caída de consultas en la última semana. Recomendación: revisar campañas activas y estacionalidad.
- **R-18:** devoluciones o reprocesos altos. Recomendación: revisar calidad del servicio.

### Límites del caso

- Sin CRM completo, la cobertura de ventas es parcial.
- La venta puede registrarse días después de la consulta.
- El lead de WhatsApp no siempre deja datos declarados.
- La comparación entre períodos debe considerar la estacionalidad del taller.

### Indicadores de éxito del caso

| Indicador | Línea base | Objetivo | Plazo |
|---|---|---|---|
| Respuesta a WhatsApp < 15 min | Medir | ≥ 70 % | 30 días |
| Consulta a visita | Medir | +8 puntos | 60 días |
| Cotización a venta | Medir | +10 puntos | 90 días |
| Cobertura de ventas registradas | Medir | ≥ 80 % | 60 días |
| Costo por consulta | Medir | −15 % | 90 días |

---

## 7.3 Comparación de ambos casos

| Dimensión | Óptica Johanna | Mecánica Luis |
|---|---|---|
| Naturaleza | Salud visual | Servicio automotriz |
| Dato sensible | Alto (salud) | Bajo |
| Evaluación en línea | Central | No aplica |
| Agenda formal | Sí | Parcial |
| CRM local | Sí | No |
| Canal principal | Formulario + cita | WhatsApp + llamada |
| Riesgo principal | Privacidad y abandono del test | Cobertura incompleta de ventas |
| Módulo más crítico | 08 Evaluaciones | 13 Seguimiento |
| Decisión más valiosa | Simplificar el test | Responder más rápido |

## 7.4 Criterios de aceptación de los casos

- Cada etapa del recorrido tiene dato, módulo y responsable.
- Cada pregunta de negocio tiene análisis, visualización y decisión asociada.
- Cada caso declara sus límites y su cobertura.
- Los objetivos son medibles y tienen plazo.
- Ningún caso promete resultados garantizados.

---

# ENTREGABLE 8 — PRIORIZACIÓN FUNCIONAL

## 8.1 Método

Cada función se evalúa con cuatro criterios:

| Criterio | Pregunta |
|---|---|
| **Valor** | ¿Resuelve una decisión real del negocio? |
| **Dependencia** | ¿Otros módulos necesitan que exista primero? |
| **Esfuerzo** | ¿Cuánto trabajo funcional y operativo requiere? |
| **Riesgo** | ¿Qué pasa si falta o falla? |

Escala: alto, medio, bajo.

## 8.2 Clasificación por horizonte

### Horizonte 1 — Núcleo operativo (obligatorio)

Sin estas funciones la plataforma no responde las preguntas básicas del negocio.

| Orden | Módulo / función | Valor | Esfuerzo | Justificación |
|---|---|---|---|---|
| 1 | Captura de sesiones y eventos de navegación | Alto | Medio | Base de todo análisis. |
| 2 | Overview con indicadores y embudo | Alto | Medio | Lectura ejecutiva diaria. |
| 3 | Campañas y fuentes | Alto | Medio | Decide inversión. |
| 4 | Formularios y leads | Alto | Medio | Mide captura de demanda. |
| 5 | Citas y asistencias | Alto | Medio | Conecta marketing con local. |
| 6 | Ventas e ingresos | Alto | Alto | Demuestra resultado real. |
| 7 | Seguimiento comercial | Alto | Medio | Evita pérdida de leads. |
| 8 | Filtros globales y vistas guardadas | Alto | Bajo | Usabilidad transversal. |
| 9 | Privacidad, consentimiento y retención | Alto | Medio | Requisito legal y de confianza. |
| 10 | Negocios separados | Alto | Bajo | Evita mezcla de datos. |

### Horizonte 2 — Diagnóstico y conversión (alto valor)

| Orden | Módulo / función | Valor | Esfuerzo | Justificación |
|---|---|---|---|---|
| 11 | Evaluaciones pregunta por pregunta | Alto | Medio | Principal fuente de abandono en óptica. |
| 12 | Embudos configurables | Alto | Medio | Localiza la pérdida. |
| 13 | Comportamiento y páginas | Alto | Medio | Explica el qué y el dónde. |
| 14 | Dispositivos | Alto | Bajo | Detecta brecha móvil. |
| 15 | Segmentos y comparación | Alto | Medio | Personaliza decisiones. |
| 16 | Análisis temporal | Medio | Bajo | Planifica horarios y campañas. |
| 17 | Recorridos | Medio | Alto | Explica la ruta completa. |
| 18 | Mapas de calor | Medio | Medio | Optimiza páginas clave. |

### Horizonte 3 — Optimización y aprendizaje (valor compuesto)

| Orden | Módulo / función | Valor | Esfuerzo | Justificación |
|---|---|---|---|---|
| 19 | Centro de inteligencia (hallazgos) | Alto | Alto | Convierte datos en acciones. |
| 20 | Seguimiento de mejoras | Alto | Medio | Comprueba si funcionó. |
| 21 | Experimentos A/B | Medio | Alto | Requiere volumen y disciplina. |
| 22 | Session replay | Medio | Alto | Útil para diagnóstico puntual. |

## 8.3 Matriz de decisión

| | Esfuerzo bajo | Esfuerzo medio | Esfuerzo alto |
|---|---|---|---|
| **Valor alto** | Filtros, vistas, negocios, dispositivos | Overview, campañas, leads, citas, seguimiento, privacidad | Ventas, centro de inteligencia, recorridos |
| **Valor medio** | Análisis temporal | Comportamiento, evaluaciones, embudos, mapas de calor, mejoras | Experimentos, replay |
| **Valor bajo** | — | — | Funciones exploratorias sin decisión asociada |

**Regla:** ninguna función de valor bajo entra al producto sin una decisión de negocio identificada.

## 8.4 Fases de entrega

| Fase | Duración orientativa | Entregable funcional | Criterio de salida |
|---|---|---|---|
| **Fase 1 — Ver** | 4 a 6 semanas | Captura, Overview, campañas, leads, citas, ventas, filtros, privacidad. | El negocio puede responder «qué pasó» y «cuánto costó». |
| **Fase 2 — Entender** | 4 a 6 semanas | Evaluaciones, embudos, comportamiento, dispositivos, segmentos, temporal. | El negocio puede responder «dónde se pierde» y «a quién». |
| **Fase 3 — Actuar** | 4 a 6 semanas | Centro de inteligencia, mejoras, recorridos. | El negocio puede responder «qué hacer» y «funcionó». |
| **Fase 4 — Experimentar** | 4 a 8 semanas | Experimentos, replay, mapas de calor avanzados. | El negocio puede probar y decidir con evidencia. |

## 8.5 Dependencias críticas

| Función | Depende de |
|---|---|
| Embudos | Sesiones, eventos, citas, ventas. |
| Recorridos | Sesiones, eventos, ventas. |
| Centro de inteligencia | Todos los indicadores y volumen suficiente. |
| Mejoras | Centro de inteligencia y medición antes/después. |
| Experimentos | Volumen de tráfico y definición de métrica. |
| Segmentos | Calidad de fuente y dispositivo. |
| Mapas de calor | Eventos de clic y scroll con coordenadas. |

## 8.6 Qué no se prioriza y por qué

| Función | Motivo |
|---|---|
| Reconocimiento facial o emocional | Invasivo, innecesario y de alto riesgo legal. |
| Identificación entre dispositivos sin evidencia | Genera falsos positivos y afecta la privacidad. |
| Geolocalización exacta | La ubicación aproximada es suficiente para decisiones comerciales. |
| Predicción de compra individual | Requiere volumen y puede estigmatizar; no es necesaria para el MVP. |
| Envío de datos de salud a publicidad | Prohibido por política y por protección de datos. |
| Panel de «vanity metrics» sin decisión | No aporta valor operativo. |

## 8.7 Criterios de aceptación de la priorización

- Toda función priorizada tiene decisión de negocio asociada.
- Toda dependencia crítica está identificada.
- Cada fase tiene criterio de salida verificable.
- Las funciones descartadas tienen motivo explícito.
- La priorización se revisa al cierre de cada fase.

---

# ENTREGABLE 9 — REQUISITOS DE CALIDAD Y CONTROL

## 9.1 Dimensiones de calidad del dato

| Dimensión | Definición | Control |
|---|---|---|
| **Completitud** | Proporción de campos obligatorios presentes. | Reporte de cobertura por entidad. |
| **Validez** | El dato cumple formato y rango. | Validación en captura y revisión periódica. |
| **Consistencia** | El mismo hecho coincide entre fuentes. | Comparación de totales entre módulos. |
| **Unicidad** | No hay registros duplicados. | Clave estable e idempotencia. |
| **Oportunidad** | El dato está disponible cuando se necesita. | Marca de última actualización. |
| **Trazabilidad** | Se puede reconstruir el origen y la fórmula. | Ficha de cada indicador. |
| **Exactitud** | El dato representa la realidad observada. | Muestreo y conciliación. |

## 9.2 Controles de captura

1. **Consentimiento previo:** sin consentimiento no se capturan eventos de navegación.
2. **Minimización:** solo se recoge lo necesario para la finalidad declarada.
3. **Exclusión de sensibles:** nunca se captura contenido de salud, documentos o contraseñas.
4. **Idempotencia:** los eventos de estado no se duplican.
5. **Validación de rango:** scroll entre 0 y 100; tiempos no negativos; importes no negativos.
6. **Validación temporal:** el fin de sesión no puede ser anterior al inicio.
7. **Coherencia comercial:** una venta debe tener visitante y fecha; una cita debe tener fecha futura al momento de crear.
8. **Rechazo controlado:** el registro inválido se marca, no se descarta silenciosamente.

## 9.3 Controles de proceso

| Control | Frecuencia | Responsable | Acción si falla |
|---|---|---|---|
| Revisión de cobertura | Diaria | Analista | Alertar fuente faltante. |
| Duplicados | Diaria | Analista | Depurar y documentar. |
| Totales entre módulos | Semanal | Analista | Conciliar diferencias. |
| Ventas sin origen | Semanal | Comercial | Completar o marcar «sin atribución». |
| Citas sin estado | Diaria | Atención | Actualizar estado. |
| Leads sin contacto | Diaria | Comercial | Contactar o justificar. |
| Retención y eliminación | Mensual | Responsable de datos | Ejecutar y registrar. |
| Accesos a datos sensibles | Mensual | Responsable de datos | Revisar autorizaciones. |

## 9.4 Indicadores de calidad visibles en el producto

| Indicador | Fórmula | Umbral aceptable |
|---|---|---|
| Cobertura de origen | Sesiones con fuente identificada / sesiones | ≥ 85 % |
| Cobertura de ventas | Ventas con visitante asociado / ventas | ≥ 90 % |
| Cobertura de citas | Citas con estado final / citas | ≥ 95 % |
| Cobertura de contacto | Leads con comunicación / leads | ≥ 90 % |
| Duplicados | Registros duplicados / registros | ≤ 0,5 % |
| Sesiones sin duración | Sesiones con duración 0 / sesiones | ≤ 2 % |
| Ventas sin atribución | Ventas sin campaña / ventas | Se declara, no se oculta |
| Datos sensibles sin autorización | Accesos no autorizados | 0 |

## 9.5 Privacidad y protección de datos (Ecuador)

La plataforma se alinea con los principios de la Ley Orgánica de Protección de Datos Personales:

| Principio | Aplicación funcional |
|---|---|
| **Legalidad y transparencia** | Aviso claro de qué se recoge y para qué. |
| **Finalidad** | Cada dato tiene una finalidad declarada. |
| **Minimización** | Solo datos necesarios. |
| **Proporcionalidad** | El análisis no excede la finalidad. |
| **Calidad** | Datos exactos y actualizados. |
| **Seguridad** | Acceso restringido y registro de auditoría. |
| **Confidencialidad** | Datos sensibles con protección reforzada. |
| **Conservación limitada** | Retención definida y eliminación programada. |
| **Derechos del titular** | Acceso, rectificación, eliminación, oposición y portabilidad. |

### Derechos del titular — flujo funcional

1. **Solicitud:** la persona pide acceso, corrección, eliminación u oposición.
2. **Verificación:** se confirma su identidad por un canal seguro.
3. **Localización:** se buscan sus datos por identificador seudónimo o dato declarado.
4. **Acción:** se entrega, corrige, elimina o anonimiza.
5. **Registro:** se documenta la fecha, el alcance y el responsable.
6. **Respuesta:** se comunica en el plazo definido por la normativa.

**Plazo objetivo interno:** 30 días para anonimizar o eliminar, salvo obligación legal de conservación.

### Datos de salud visual

- Se clasifican como sensibles.
- Solo se muestran a personal autorizado.
- No se envían a plataformas publicitarias.
- Se conservan por el plazo mínimo necesario.
- Se eliminan o anonimizan al vencer.
- Todo acceso queda registrado.

## 9.6 Seguridad funcional

| Requisito | Comportamiento |
|---|---|
| Acceso por rol | Cada rol ve solo lo autorizado. |
| Lectura pública limitada | El acceso de consulta no permite escritura. |
| Escritura autenticada | Solo usuarios autorizados registran datos. |
| Registro de auditoría | Se registran accesos sensibles y exportaciones. |
| Sesión | Expira por inactividad según política. |
| Exportación | Sujeta a permisos y advertencia de datos sensibles. |
| Eliminación | Programada y verificable. |
| Incidentes | Registro, contención, notificación y aprendizaje. |

## 9.7 Requisitos de usabilidad y accesibilidad

- Toda pantalla debe entenderse sin capacitación previa prolongada.
- Los filtros globales deben ser visibles y reversibles.
- Los estados vacíos deben explicar qué hacer.
- Los mensajes deben evitar tecnicismos innecesarios.
- El contraste debe permitir lectura cómoda.
- La navegación debe funcionar con teclado.
- Los gráficos deben tener equivalente textual.
- Las unidades deben ser explícitas.
- Los errores deben indicar qué pasó y cómo continuar.

## 9.8 Requisitos de rendimiento funcional

| Escenario | Comportamiento esperado |
|---|---|
| Cambio de filtro | Resultados en menos de 3 segundos para el período estándar. |
| Período de 90 días | Resultados en menos de 8 segundos o indicador de progreso. |
| Actividad en vivo | Actualización automática cada 30 segundos. |
| Exportación | Generación con indicador de progreso y confirmación. |
| Módulo sin datos | Respuesta inmediata con estado vacío. |
| Error de fuente | Mensaje claro sin bloquear el resto de módulos. |

## 9.9 Criterios de aceptación de calidad y control

- Existe un reporte visible de cobertura por fuente y entidad.
- Todo dato sensible tiene control de acceso y auditoría.
- Toda eliminación es verificable.
- Los totales entre módulos son consistentes o la diferencia está explicada.
- Los umbrales de calidad se muestran y se alertan.
- La plataforma declara sus límites en cada módulo crítico.
- Ninguna función promete resultados que no puede medir.

---

# ANEXO A — MATRIZ DE TRAZABILIDAD MÓDULO → DATO → ANÁLISIS → VISUALIZACIÓN

| Módulo | Datos principales | Análisis | Visualizaciones |
|---|---|---|---|
| 01 Overview | Sesiones, citas, ventas, campañas | A-01 a A-26, E-01, G-01 | V-01, V-02, V-08, V-16 |
| 02 Visitantes | Visitantes, sesiones | C-01 a C-05 | V-01, V-03, V-04, V-12 |
| 03 Actividad en vivo | Eventos, sesiones | A-27 | V-01, V-13, V-16 |
| 04 Campañas | Campañas, sesiones, ventas | B-01 a B-06 | V-03, V-04, V-12 |
| 05 Comportamiento | Páginas, eventos | D-01 a D-05 | V-03, V-04, V-12 |
| 06 Mapas de calor | Clics, scroll | D-06, D-07 | V-10 |
| 07 Session replay | Eventos de sesión | D-08 | V-13 |
| 08 Evaluaciones | Pasos de evaluación | E-06, E-07 | V-03, V-12 |
| 09 Formularios | Campos, leads | E-08 a E-10 | V-03, V-12, V-15 |
| 10 Embudos | Sesiones, hitos | E-01 a E-05 | V-08 |
| 11 Recorridos | Secuencias, ventas | E-11, E-12 | V-09, V-13, V-17 |
| 12 Citas | Citas | F-01 a F-06 | V-01, V-03, V-07 |
| 13 Seguimiento | Comunicaciones | F-07 a F-12 | V-03, V-05, V-07, V-12 |
| 14 Ventas | Ventas | F-13 a F-17 | V-01, V-02, V-07, V-12 |
| 15 Segmentos | Todo el conjunto | C-06 a C-08 | V-01, V-03, V-12, V-17 |
| 16 Temporal | Series y eventos | G-01 a G-07 | V-02, V-03, V-10, V-11 |
| 17 Dispositivos | Sesiones por dispositivo | C-05, E-04 | V-03, V-05, V-12 |
| 18 Experimentos | Variantes | H-01 a H-03 | V-01, V-03, V-15 |
| 19 Inteligencia | Indicadores y reglas | R-01 a R-23 | V-14, V-16 |
| 20 Mejoras | Iniciativas | H-04 a H-07 | V-03, V-05, V-15 |
| 21 Negocios | Agregados por negocio | I-01 a I-04 | V-01, V-03, V-07, V-12 |
| 22 Privacidad | Consentimiento, retención | Auditoría | V-12, V-16 |

---

# ANEXO B — DEFINICIONES DE NEGOCIO

| Término | Definición operativa |
|---|---|
| **Lead** | Persona que dejó al menos un dato de contacto válido y aceptó ser contactada. |
| **Cita** | Reserva de atención presencial o remota con fecha y hora. |
| **Asistencia** | Confirmación de que la persona acudió a la cita. |
| **Compra** | Venta registrada no devuelta, asociada a una persona. |
| **Conversión principal** | Resultado que el negocio define como objetivo del período. |
| **Fuente** | Origen de la visita: campaña, red, buscador, referido o directo. |
| **Atribución** | Asignación estimada de un resultado a un punto de contacto. |
| **Período comparable** | Ventana anterior de igual duración y mismos filtros. |
| **Muestra suficiente** | Volumen mínimo para sostener una conclusión con confianza media o alta. |
| **Mejora confirmada** | Cambio positivo en el indicador objetivo después de una acción, con período suficiente. |

---

# ANEXO C — PRINCIPIOS INNEGOCIABLES

1. **Ningún dato sin origen.** Todo valor declara si es observado, declarado, registrado, importado, calculado o inferido.
2. **Ninguna correlación sin advertencia.** Se explica que asociación no es causalidad.
3. **Ningún dato sensible sin protección.** La salud visual tiene acceso restringido y no se envía a publicidad.
4. **Ningún hueco rellenado en silencio.** La cobertura incompleta se declara.
5. **Ninguna decisión automática.** La plataforma recomienda; la persona decide.
6. **Ningún resultado garantizado.** Los objetivos son metas, no promesas.
7. **Ninguna identidad inventada.** Se usa identificador seudónimo y no se cruzan identidades entre negocios.
8. **Ninguna captura sin consentimiento.** El rechazo se respeta y se registra.
9. **Ninguna métrica sin unidad y período.** Todo número es interpretable.
10. **Ningún hallazgo sin evidencia y volumen.** La confianza se declara siempre.

---

**Fin del documento.**
