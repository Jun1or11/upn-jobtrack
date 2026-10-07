# Sprint 2 (Parcial) – Gestión de Postulaciones

**Estado:** 🟡 En progreso (avance parcial – Semana 4–6)  
**Período:** Semana 4–6 del proyecto  
**Responsable:** Equipo JOBTRACK – UPN Chorrillos 2026

---

## Objetivos del Sprint 2

Implementar el módulo central de gestión de postulaciones: dashboard, visualización kanban/lista, formulario de registro, búsqueda, filtros y métricas.

---

## Historias de Usuario Implementadas ✅

### US-06 – Dashboard Principal
**Como** usuario autenticado,  
**quiero** ver un dashboard con mis postulaciones,  
**para** tener una visión general de mi búsqueda laboral.

**Criterios de aceptación:**
- [x] Sidebar de navegación con logo JOBTRACK
- [x] Header con nombre del usuario y badge de prototipo
- [x] Cuatro métricas en la parte superior (total, postuladas, entrevistas, ofertas)
- [x] Barra de acciones con búsqueda, filtro y toggle de vista

### US-07 – Vista Kanban de Postulaciones
**Como** usuario,  
**quiero** ver mis postulaciones organizadas en columnas por estado,  
**para** visualizar rápidamente en qué etapa está cada proceso.

**Criterios de aceptación:**
- [x] 4 columnas: Por postular / Postulado / Entrevista / Oferta
- [x] Cada columna muestra el conteo de ítems
- [x] Tarjetas con: empresa, cargo, fuente, fecha, estado, próxima acción, nota
- [x] Estado vacío con mensaje amigable
- [x] Animaciones de entrada escalonadas

### US-08 – Vista Lista de Postulaciones
**Como** usuario,  
**quiero** ver mis postulaciones en formato de lista,  
**para** comparar múltiples postulaciones a la vez.

**Criterios de aceptación:**
- [x] Filas con empresa, cargo, fuente, fecha, estado, próxima acción
- [x] Toggle para cambiar entre vista kanban y vista lista
- [x] Animaciones de entrada en cascada

### US-09 – Registro de Nueva Postulación
**Como** usuario,  
**quiero** registrar nuevas postulaciones,  
**para** hacer seguimiento desde el inicio.

**Criterios de aceptación:**
- [x] Botón "Nueva postulación" visible en la barra de acciones
- [x] Modal con formulario completo
- [x] Campos: empresa, cargo, fuente, fecha, estado, próxima acción, nota
- [x] Validación de campos requeridos
- [x] Guardar en localStorage al enviar
- [x] Cerrar con Escape o click fuera del modal

### US-10 – Persistencia de Postulaciones
**Como** usuario,  
**quiero** que mis postulaciones se conserven al recargar,  
**para** no perder la información registrada.

**Criterios de aceptación:**
- [x] Datos guardados en localStorage
- [x] Se cargan al iniciar la sesión
- [x] Datos demo inicializados si no hay datos previos

### US-11 – Búsqueda por Empresa o Cargo
**Como** usuario,  
**quiero** buscar postulaciones por texto libre,  
**para** encontrar rápidamente una oportunidad específica.

**Criterios de aceptación:**
- [x] Input de búsqueda en la barra de acciones
- [x] Filtra en tiempo real por empresa, cargo o fuente
- [x] Muestra conteo de resultados

### US-12 – Filtro por Estado
**Como** usuario,  
**quiero** filtrar mis postulaciones por estado,  
**para** enfocarme en un tipo de proceso específico.

**Criterios de aceptación:**
- [x] Selector de estado en la barra de acciones
- [x] Opciones: Todos / Por postular / Postulado / Entrevista / Oferta
- [x] Compatible con búsqueda simultánea

### US-13 – Métricas Simples
**Como** usuario,  
**quiero** ver un resumen numérico de mis postulaciones,  
**para** evaluar el estado general de mi búsqueda.

**Criterios de aceptación:**
- [x] Tarjeta: Total de postulaciones
- [x] Tarjeta: Postuladas
- [x] Tarjeta: En entrevista
- [x] Tarjeta: Ofertas recibidas
- [x] Valores actualizados en tiempo real

### US-14 – Eliminar Postulación
**Como** usuario,  
**quiero** eliminar postulaciones incorrectas o desactualizadas.

**Criterios de aceptación:**
- [x] Botón eliminar visible al hacer hover en tarjetas y filas
- [x] Se elimina del estado y del localStorage

---

## Historias de Usuario Pendientes 🔴

### US-15 – Editar Postulación
- [ ] Modal para editar los datos de una postulación existente
- [ ] Pre-cargar datos en el formulario

### US-16 – Detalle de Postulación
- [ ] Panel lateral o página de detalle con historial de cambios

### US-17 – Cambio de Estado Drag & Drop
- [ ] Arrastrar tarjetas entre columnas del kanban

### US-18 – Exportar a PDF / Excel
- [ ] Generar reporte de todas las postulaciones

---

## Componentes Implementados

| Componente | Archivo | Descripción |
|---|---|---|
| `DashboardPage` | `pages/DashboardPage.tsx` | Página principal del dashboard |
| `Sidebar` | `components/Sidebar.tsx` | Barra lateral de navegación |
| `JobCard` | `components/JobCard.tsx` | Tarjeta kanban de postulación |
| `ListItemPostulacion` | `components/ListItemPostulacion.tsx` | Fila de postulación en vista lista |
| `ModalNuevaPostulacion` | `components/ModalNuevaPostulacion.tsx` | Modal de registro |
| `BadgeEstado` | `components/BadgeEstado.tsx` | Badge de estado coloreado |
| `usePostulaciones` | `hooks/usePostulaciones.ts` | Hook de gestión de estado |

---

## Datos Demo Incluidos

Se incluyen **8 postulaciones demo** en empresas reales del mercado peruano:

| Empresa | Cargo | Estado |
|---|---|---|
| BCP | Analista de Datos Jr. | Entrevista |
| Interbank | Desarrollador Frontend Jr. | Postulado |
| Rimac Seguros | Practicante de Sistemas | Postulado |
| Alicorp | Analista de Sistemas | Por postular |
| Belcorp | Junior Developer | Oferta |
| Telefónica del Perú | Practicante TI | Por postular |
| Yape / BCP Digital | QA Tester Jr. | Entrevista |
| Falabella Perú | Analista Jr. de E-Commerce | Postulado |

---

## Pendiente para Sprint 3

- Edición de postulaciones
- Detalle expandido con historial
- Notificaciones y recordatorios
- Perfil de usuario editable
- Estadísticas avanzadas con gráficos
- Drag & drop en kanban
