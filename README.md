# JOBTRACK 🎯

**Sistema web de seguimiento de postulaciones laborales**  
Proyecto académico – Universidad Privada del Norte (UPN) Sede Chorrillos  
Curso: Ingeniería de Software · 2026

> ⚗️ **Prototipo académico – datos de demostración**

---

## 📋 Descripción

JOBTRACK es una plataforma web responsive diseñada para que estudiantes de últimos ciclos y egresados recientes de UPN Chorrillos puedan gestionar y hacer seguimiento de sus postulaciones laborales de forma organizada y visual.

El sistema permite registrar oportunidades, visualizarlas en formato kanban o lista, filtrarlas por estado, buscarlas por empresa/cargo, y ver métricas simples de la búsqueda laboral.

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- **Node.js** v18 o superior
- **npm** v9 o superior

### Pasos

```bash
# 1. Navegar al directorio del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

### URL local
```
http://localhost:5173
```

---

## 🔑 Credenciales Demo

| Campo | Valor |
|---|---|
| **Correo** | `n00329808@upn.pe` |
| **Contraseña** | `jobtrack-demo` |
| Duración sesión | 8 horas (localStorage) |

> También puedes usar el botón **"Autocompletar credenciales demo"** en la pantalla de login.

---

## ✅ Funcionalidades Implementadas

### Sprint 1 – Autenticación y Acceso

| Funcionalidad | Estado |
|---|---|
| Pantalla de login con diseño UPN | ✅ |
| Validación de credenciales demo | ✅ |
| Redirección al dashboard al autenticar | ✅ |
| Sesión guardada en localStorage (8h) | ✅ |
| Splash screen de carga | ✅ |
| Protección del dashboard sin sesión | ✅ |
| Mensaje de error para credenciales incorrectas | ✅ |
| Toggle para mostrar/ocultar contraseña | ✅ |
| Botón para cerrar sesión | ✅ |
| Auto-completar credenciales demo | ✅ |

### Sprint 2 (Parcial) – Gestión de Postulaciones

| Funcionalidad | Estado |
|---|---|
| Dashboard principal con sidebar y header | ✅ |
| 4 métricas: Total, Postuladas, Entrevistas, Ofertas | ✅ |
| Vista Kanban (columnas por estado) | ✅ |
| Vista Lista (filas con datos completos) | ✅ |
| Toggle entre vista kanban y lista | ✅ |
| 8 postulaciones demo con datos reales de empresas peruanas | ✅ |
| Botón "Nueva postulación" | ✅ |
| Modal con formulario completo de registro | ✅ |
| Validación de campos requeridos en el formulario | ✅ |
| Guardar nuevas postulaciones en localStorage | ✅ |
| Búsqueda por empresa o cargo | ✅ |
| Filtro por estado | ✅ |
| Contador de resultados en tiempo real | ✅ |
| Eliminar postulación (hover en tarjeta) | ✅ |
| Cerrar modal con Escape o click fuera | ✅ |
| Diseño responsive para móvil y laptop | ✅ |
| Sidebar responsive con botón hamburguesa | ✅ |
| Badge de estado colorizado | ✅ |

---

## 🗂️ Estructura del Proyecto

```
jobtrack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BadgeEstado.tsx         ← Badge de estado (color por tipo)
│   │   │   ├── JobCard.tsx             ← Tarjeta kanban de postulación
│   │   │   ├── ListItemPostulacion.tsx ← Fila de vista lista
│   │   │   ├── ModalNuevaPostulacion.tsx ← Modal de registro
│   │   │   └── Sidebar.tsx             ← Barra lateral de navegación
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx           ← Pantalla de inicio de sesión
│   │   │   └── DashboardPage.tsx       ← Dashboard principal
│   │   ├── data/
│   │   │   └── postulacionesDemo.ts    ← 8 postulaciones de demostración
│   │   ├── hooks/
│   │   │   └── usePostulaciones.ts     ← Hook de gestión de estado
│   │   ├── types/
│   │   │   └── index.ts                ← Tipos TypeScript
│   │   ├── utils/
│   │   │   └── storage.ts              ← Auth + localStorage helpers
│   │   ├── styles/
│   │   │   ├── global.css              ← Design system global
│   │   │   ├── login.css               ← Estilos del login
│   │   │   └── dashboard.css           ← Estilos del dashboard
│   │   ├── App.tsx                     ← Componente raíz con routing
│   │   └── main.tsx                    ← Entry point de React
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── sprint-1.md                     ← Documentación Sprint 1
│   ├── sprint-2-parcial.md             ← Documentación Sprint 2
│   └── pruebas-iniciales.md            ← 25 casos de prueba
└── README.md
```

---

## 📦 Tecnologías Usadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18+ | Framework UI |
| TypeScript | 5+ | Tipado estático |
| Vite | 6+ | Build tool y dev server |
| CSS Vanilla | — | Estilos (sin frameworks externos) |
| localStorage | API nativa | Persistencia de datos |
| Google Fonts (Inter) | — | Tipografía |

---

## 🎨 Diseño

- **Paleta principal:** Azul oscuro `#1a3a6b` (UPN) + Amarillo dorado `#f5c518`
- **Fondo:** Gris claro `#f4f6f9`
- **Tipografía:** Inter (Google Fonts)
- **Responsive:** Funciona en laptop (≥768px) y móvil (<768px)

---

## 📁 Sprint 1 – Autenticación

Ver detalles completos en [`docs/sprint-1.md`](docs/sprint-1.md)

**Funcionalidades implementadas:** Login, validación, sesión, protección de rutas, cierre de sesión.

---

## 📁 Sprint 2 Parcial – Gestión de Postulaciones

Ver detalles completos en [`docs/sprint-2-parcial.md`](docs/sprint-2-parcial.md)

**Funcionalidades implementadas:** Dashboard, kanban, lista, métricas, búsqueda, filtros, registro, persistencia.

---

## ⏳ Pendiente para Siguientes Sprints

| Sprint | Funcionalidad |
|---|---|
| Sprint 2 (resto) | Edición de postulaciones, detalle expandido |
| Sprint 3 | Perfil de usuario, estadísticas con gráficos |
| Sprint 3 | Notificaciones y recordatorios de entrevistas |
| Sprint 3 | Drag & drop en kanban |
| Sprint 4 | Backend real con base de datos |
| Sprint 4 | API REST con Node.js / Express |
| Sprint 4 | Autenticación con JWT y bcrypt |
| Sprint 4 | Registro de nuevos usuarios |
| Sprint 5 | Exportar a PDF / Excel |
| Sprint 5 | Login con cuenta Google UPN |
| Sprint 5 | Panel administrativo para coordinadores |

---

## 📊 Pruebas

Ver tabla completa de 25 casos de prueba en [`docs/pruebas-iniciales.md`](docs/pruebas-iniciales.md)

**Resultado:** 25/25 pruebas pasan ✅

---

## 📸 Capturas para el Informe

Para el informe académico, se recomienda capturar:

1. **Pantalla de Login** – Panel dividido con branding UPN a la izquierda
2. **Error de credenciales** – Mensaje de error en rojo
3. **Dashboard completo** – Vista kanban con las 4 columnas y métricas
4. **Vista lista** – Lista de postulaciones con badges de estado
5. **Modal de nueva postulación** – Formulario abierto con campos
6. **Nueva postulación guardada** – Dashboard actualizado con el nuevo ítem
7. **Búsqueda activa** – Buscador con texto y resultados filtrados
8. **Filtro por estado** – Solo un estado seleccionado
9. **Vista móvil** – Dashboard en pantalla pequeña con sidebar cerrado
10. **Sidebar móvil abierto** – Sidebar desplegado sobre el contenido

---

*Proyecto desarrollado como prototipo académico para el curso de Ingeniería de Software – UPN Chorrillos 2026*
