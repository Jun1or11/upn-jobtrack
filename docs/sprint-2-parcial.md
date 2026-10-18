# Sprint 2 — CRUD de postulaciones con propietario

## Implementado

- Entidad Postulación con relación obligatoria al usuario y `ON DELETE CASCADE`.
- UUID de servidor, fecha de creación y persistencia PostgreSQL.
- Listar, consultar por UUID, crear, editar parcialmente y eliminar.
- Endpoints protegidos con JWT: el propietario siempre sale de la sesión, nunca del cuerpo.
- Todas las consultas individuales y escrituras usan `id` y `ownerId`.
- Usuario ajeno recibe 404; no puede enumerar ni alterar registros de otro usuario.
- Validación frontend/backend: empresa, cargo, fecha, fuente, estado y límites de texto.
- React conectado con la API; no muestra éxito ni modifica la lista antes de guardar en servidor.
- Confirmación de eliminación con estado de carga y errores recuperables.
- Se mantienen kanban, lista, tarjetas, filtros, búsqueda, cambio de estado, métricas y responsive.
- Cuenta demo con ocho postulaciones creadas por seed, sin reinicializar listas vacías al recargar.

## Endpoints protegidos bajo `/api`

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/postulaciones?q=texto&estado=Entrevista` | Lista del propietario; parámetros opcionales |
| GET | `/postulaciones/:id` | Una postulación propia |
| POST | `/postulaciones` | Crear para el usuario autenticado |
| PATCH | `/postulaciones/:id` | Editar campos; permite solo `{ "estado": "Oferta" }` |
| DELETE | `/postulaciones/:id` | Eliminar un registro propio |

Estados: Por postular, Postulado, Entrevista y Oferta. Búsqueda por empresa, cargo o fuente. La interfaz combina búsqueda/filtro localmente sobre la lista de la cuenta; la API también admite ambos parámetros. Las métricas superiores son globales de la cuenta.

## Archivos principales

- Backend: `backend/src/postulaciones/`, migración en `backend/src/database/migrations/`.
- Frontend: `frontend/src/hooks/usePostulaciones.ts`, `frontend/src/utils/api.ts`, `DashboardPage.tsx`, `JobCard.tsx`, `ListItemPostulacion.tsx`, `ModalNuevaPostulacion.tsx` y `ConfirmDialog.tsx`.
- Pruebas: `backend/src/postulaciones/postulaciones.service.spec.ts`, `backend/src/auth/auth.dto.spec.ts` y `backend/test/app.e2e-spec.ts`.
- Ejemplos HTTP: `docs/api.http`.

## Transición de datos

La fuente de verdad es PostgreSQL. La clave histórica `jobtrack_postulaciones` se conserva intacta pero no se lee ni se importa automáticamente: sus registros no tienen propietario verificable. Ya no se inicializa la aplicación desde `frontend/src/data/postulacionesDemo.ts`.

## Pendiente fuera de alcance

Detalle con historial, drag & drop, exportación, módulos Entrevistas/Empresas/Calendario y Estadísticas avanzadas. No se asigna un porcentaje artificial al producto completo: el alcance de CRUD y autenticación está implementado; la verificación visual final y configuración de la base habitual se realizan siguiendo el README.
