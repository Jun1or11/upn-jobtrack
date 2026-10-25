# Sprint 3 — Navegación y módulos de gestión

## Objetivo

Convertir los accesos visuales del sidebar en módulos funcionales conectados al backend y a PostgreSQL, manteniendo el diseño azul/amarillo, la sesión JWT y el aislamiento por propietario.

## Alcance implementado

| Módulo | Funcionalidad |
|---|---|
| Dashboard | Métricas, próximas acciones, actividad reciente y accesos rápidos. |
| Postulaciones | Kanban/lista, búsqueda, filtro, creación, edición, eliminación y cambio de estado. |
| Entrevistas | Procesos en estado `Entrevista`, ordenados por próxima acción, con edición y cambio de estado. |
| Empresas | Agrupación por empresa, total, estados, última fecha, fuentes y búsqueda. |
| Calendario | Vista mensual de fechas de postulación y próximas acciones; navegación por mes y edición desde el evento. |
| Estadísticas | KPIs, embudo, distribución por estado, fuentes, últimos 6 meses y ranking de empresas. |
| Mi perfil | Edición de nombre, ciclo y carrera con actualización de la sesión local. |
| Configuración | Cambio de contraseña, exportación CSV y eliminación de cuenta. |

## Navegación

No se agregó una dependencia de routing. `DashboardPage` usa un estado sincronizado con el hash del navegador:

- `#/dashboard`
- `#/postulaciones`
- `#/entrevistas`
- `#/empresas`
- `#/calendario`
- `#/estadisticas`
- `#/perfil`
- `#/configuracion`

El evento `hashchange` mantiene atrás/adelante del navegador. El sidebar resalta la vista activa y se cierra en móvil al navegar.

## Cambios de backend

### Campo `fechaProximaAccion`

Se agregó a `Postulacion` como columna `date` nullable:

```text
migrations/1780000000001-add-fecha-proxima-accion.ts
```

- Se acepta en creación y edición como `YYYY-MM-DD` o `null`.
- Se usa en dashboard, entrevistas y calendario.
- El seed genera fechas relativas a la fecha de ejecución para que la demo tenga próximas acciones.

### Perfil

```http
PATCH /api/auth/me
Authorization: Bearer <JWT>
Content-Type: application/json

{"nombre":"Junior Estudiante","ciclo":"10","carrera":"Ingeniería de Software"}
```

Los tres campos son opcionales, se validan longitudes y se rechazan campos desconocidos. Responde con el usuario público.

### Cambio de contraseña

```http
POST /api/auth/change-password
Authorization: Bearer <JWT>
Content-Type: application/json

{"currentPassword":"jobtrack-demo","newPassword":"NuevaClave123!"}
```

- Verifica la contraseña actual con bcrypt.
- Exige una contraseña nueva diferente y de 8–72 caracteres.
- Incrementa `tokenVersion`, por lo que revoca las sesiones anteriores.
- Devuelve una sesión nueva (`token`, `expiraEn`, `usuario`) para conservar la sesión actual.

Una contraseña actual incorrecta devuelve **400** (la sesión JWT sigue siendo válida). Un **401** queda reservado para sesión inválida o vencida, por lo que el frontend cierra sesión en ese caso.

## Archivos principales

```text
frontend/src/pages/
  DashboardPage.tsx        # layout, rutas hash, modales y CRUD compartido
  DashboardHome.tsx        # resumen del dashboard
  PostulacionesPage.tsx    # módulo completo
  EntrevistasPage.tsx
  EmpresasPage.tsx
  CalendarioPage.tsx
  EstadisticasPage.tsx
  PerfilPage.tsx
  ConfiguracionPage.tsx
frontend/src/components/
  PostulacionesManager.tsx # búsqueda, filtro, kanban y lista reutilizables
frontend/src/utils/fechas.ts
frontend/src/styles/modules.css
```

## Pruebas

Unitarias:

```powershell
cd backend
npm test
```

Cubren validación de `fechaProximaAccion`, perfil y cambio de contraseña.

E2E:

```powershell
cd backend
npm run test:e2e
```

Requieren `TEST_DATABASE_URL`. Crean un schema temporal, ejecutan ambas migraciones y verifican, entre otros:

- Actualización de perfil y rechazo de campos desconocidos.
- Creación con `fechaProximaAccion`, edición, limpieza con `null` y rechazo de fechas inválidas.
- Cambio de contraseña, revocación del JWT anterior y emisión de uno nuevo.

Frontend:

```powershell
cd frontend
npm run typecheck
npm run build
```

## Verificación manual sugerida

1. Iniciar sesión con la cuenta demo.
2. Recorrer cada elemento del sidebar y confirmar que la URL cambia y el contenido corresponde.
3. Crear una postulación con fecha de próxima acción y verla en Dashboard, Entrevistas (si aplica) y Calendario.
4. Cambiar un estado desde el kanban y comprobar Estadísticas.
5. Editar el perfil y confirmar que el nombre del sidebar se actualiza.
6. En Configuración, exportar el CSV y probar una contraseña actual incorrecta (no debe cerrar la sesión).
7. Recargar y usar atrás/adelante del navegador.
