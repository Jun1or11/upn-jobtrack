# JOBTRACK 🎯

Sistema académico de seguimiento de postulaciones laborales — UPN Chorrillos, Ingeniería de Software 2026.

## Estado actual

Sprint 1: registro, login real con JWT y bcrypt, sesión, logout con revocación, recuperación académica y eliminación de cuenta.

Sprint 2: CRUD de postulaciones en PostgreSQL, propietario obligatorio, búsqueda, filtro y cambio de estado. Se conservan las tarjetas, kanban, lista, formularios, paleta azul/amarillo y responsive del frontend.

Sprint 3: navegación funcional con rutas hash, dashboard con próximas acciones, módulos de Postulaciones, Entrevistas, Empresas, Calendario y Estadísticas, edición de perfil, cambio de contraseña, exportación CSV y campo opcional `fechaProximaAccion`.

La cuenta demo también vive en PostgreSQL; no hay acceso con credenciales comparadas en el frontend ni fallback silencioso a datos locales.

## Tecnologías y estructura

- Frontend: React 18, TypeScript 5, Vite 5 y CSS propio.
- Backend: NestJS 11, TypeORM, PostgreSQL 16, JWT, bcrypt y class-validator.
- Pruebas: Jest y Supertest.

```text
frontend/src/
  components/  # Sidebar, tarjetas, formularios, PostulacionesManager y diálogos
  pages/       # Login, Dashboard y módulos: Postulaciones, Entrevistas, Empresas,
               # Calendario, Estadísticas, Perfil y Configuración
  hooks/       # usePostulaciones: comunicación CRUD con API
  utils/       # api.ts, fechas.ts y almacenamiento de sesión
  constants/   # Estados y fuentes
  types/       # Tipos de frontend
  styles/      # Diseño existente
  data/        # Ejemplos históricos; ya no inicializan el dashboard
backend/src/
  auth/        # DTO, registro/login, recuperación, JWT guard y cuentas
  users/       # Entidad User
  postulaciones/ # Entidad, DTO, controller, service y module
  database/    # DataSource, migración y seed demo
  common/      # Validación global
backend/test/  # Integración HTTP sobre PostgreSQL real
docs/          # Sprints, evidencias y ejemplos de API
```

## Requisitos

- Node.js **22 o 24 LTS** y npm.
- PostgreSQL **16**, instalado y ejecutándose. No se sustituye por SQLite ni por una base en memoria.
- Dos terminales para frontend y backend.

En Windows, el servicio encontrado es `postgresql-x64-16`. Si está detenido, abre PowerShell como administrador y ejecuta:

```powershell
Start-Service postgresql-x64-16
```

Si `psql` no está en PATH, usa `C:\Program Files\PostgreSQL\16\bin\psql.exe` o pgAdmin.

## 1. Crear bases de datos

Desde pgAdmin o psql, conectado como administrador de PostgreSQL:

```sql
CREATE ROLE jobtrack LOGIN PASSWORD 'elige-una-clave-local';
CREATE DATABASE jobtrack OWNER jobtrack;
CREATE DATABASE jobtrack_test OWNER jobtrack;
```

No necesitas cambiar la autenticación de tu instalación. El usuario debe poder crear tablas en `jobtrack` y schemas en `jobtrack_test`.

## 2. Configurar y ejecutar backend

Desde la raíz:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edita **backend/.env** antes de continuar. No subas este archivo a Git.

| Variable | Propósito |
|---|---|
| `DATABASE_URL` | `postgresql://jobtrack:CLAVE@localhost:5432/jobtrack` |
| `TEST_DATABASE_URL` | `postgresql://jobtrack:CLAVE@localhost:5432/jobtrack_test` |
| `JWT_SECRET` | Secreto aleatorio de al menos 32 caracteres |
| `JWT_EXPIRES_SECONDS` | Duración del JWT; 28800 por defecto (8 horas) |
| `PORT` | Puerto API; 3000 |
| `FRONTEND_ORIGIN` | Origen permitido por CORS; `http://localhost:5173` |
| `NODE_ENV` | `development` para trabajo local |
| `DEMO_PASSWORD_RESET` | `true` habilita recuperación académica; prohibido en producción |
| `DEMO_EMAIL`, `DEMO_PASSWORD` | Cuenta que crea el seed; valores demo por defecto |

Codifica caracteres especiales de la contraseña en la URL (por ejemplo `@` → `%40`). Para generar el secreto:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Luego, desde `backend`:

```powershell
npm run migration:run
npm run seed
npm run start:dev
```

API: **http://localhost:3000/api**. Usa migraciones explícitas; `synchronize` está deshabilitado. `migration:revert` revierte la última migración y elimina sus tablas; no lo uses para arrancar normalmente.

## 3. Ejecutar frontend

En otra terminal, desde la raíz:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

`VITE_API_URL=http://localhost:3000/api` configura la API. Reinicia Vite después de cambiar variables. Abre **http://localhost:5173**. Si cambias de puerto, actualiza también `FRONTEND_ORIGIN`.

## Cuenta demo para capturas

- Correo: `n00329808@upn.pe`
- Contraseña: `jobtrack-demo`
- El seed crea la cuenta con bcrypt y ocho postulaciones de ejemplo en una transacción.
- Es idempotente: si la cuenta existe, no sobrescribe contraseña ni datos. No se ejecuta automáticamente al iniciar la API y no funciona en producción.
- Si cambias `DEMO_EMAIL`/`DEMO_PASSWORD`, introduce esos valores manualmente; el botón de autocompletar conserva los predeterminados.

## Cómo probar las funciones

| Función | Pasos y resultado esperado |
|---|---|
| Registro | Login → Crear cuenta. Completar nombre, correo, ciclo, carrera y contraseña confirmada. Entra con una lista vacía. Correo duplicado devuelve error. |
| Login | Entrar con una cuenta registrada. Credenciales incorrectas muestran error. Al recargar se valida la sesión con `/auth/me`. |
| Recuperación | ¿Olvidaste tu contraseña? → correo → Obtener token demo → nueva contraseña confirmada. El token vence en 15 minutos y solo se utiliza una vez. No se envía correo. |
| Logout | Cerrar sesión. Vuelve al login y el JWT anterior deja de servir. Revoca todas las sesiones de esa cuenta. |
| Eliminar cuenta | Sidebar → Eliminar mi cuenta → contraseña actual → confirmar. Borra la cuenta y sus postulaciones en cascada. Prueba con una cuenta temporal. |
| Navegación | El sidebar cambia de módulo sin recargar. La URL usa `#/dashboard`, `#/postulaciones`, `#/entrevistas`, `#/empresas`, `#/calendario`, `#/estadisticas`, `#/perfil` y `#/configuracion`; atrás/adelante del navegador funciona. |
| Dashboard | Muestra métricas, próximas acciones ordenadas por fecha, actividad reciente y accesos rápidos a los demás módulos. |
| Crear | Nueva postulación → completar campos → guardar. Aparece tras la respuesta de la API y persiste al recargar. La fecha de próxima acción es opcional. |
| Editar | Editar en tarjeta o lápiz en lista. Formulario precargado; guardar actualiza PostgreSQL, incluyendo `fechaProximaAccion`. |
| Eliminar | Eliminar → cancelar conserva el registro; confirmar lo elimina. |
| Buscar y filtrar | Buscar por empresa, cargo o fuente; combinar con estado. Contador y resultados cambian; métricas muestran el total de la cuenta. |
| Cambiar estado | Selector en tarjeta, lista, entrevistas o formulario. Actualiza columna y métricas. |
| Entrevistas | Agrupa las postulaciones en estado `Entrevista`, ordenadas por próxima acción. Permite editar o cambiar de estado. |
| Empresas | Agrupa automáticamente por empresa: total, estados, última fecha y fuentes. Incluye búsqueda. |
| Calendario | Vista mensual con fechas de postulación y próximas acciones. Permite navegar meses, seleccionar un día y abrir la postulación. |
| Estadísticas | KPIs, embudo de conversión, distribución por estado, fuentes, evolución de 6 meses y ranking de empresas, calculados desde PostgreSQL. |
| Mi perfil | Edita nombre, ciclo y carrera con `PATCH /auth/me`. Actualiza la tarjeta del sidebar y la sesión guardada. |
| Configuración | Cambia la contraseña con `POST /auth/change-password` (revoca las demás sesiones), exporta CSV y elimina la cuenta. |
| Propietario | Crear con usuario A, entrar con B: no aparece. Con el JWT de B, consultar/editar/borrar el UUID de A devuelve 404. |
| Responsive | Probar móvil, menú hamburguesa, formulario y ambas vistas. Acciones visibles en dispositivos sin hover. |

Validaciones: empresa 2–80, cargo 3–80, fecha válida y no futura, fuentes/estados permitidos, próxima acción hasta 120, `fechaProximaAccion` como fecha `YYYY-MM-DD` o `null`, y nota hasta 300 caracteres. Registro: nombre 2–80, ciclo 1–40, carrera 2–100 y correo válido. Contraseñas nuevas: 8–72 caracteres ASCII imprimibles. El backend rechaza campos inesperados como `ownerId`, `id` o `createdAt`.

## Persistencia y transición desde el prototipo

Las postulaciones se leen y escriben exclusivamente en PostgreSQL. La antigua clave `jobtrack_postulaciones` permanece intacta en el navegador, pero ya no se utiliza ni se importa automáticamente: esos datos históricos no tienen propietario verificable. Puedes conservarlos/exportarlos desde DevTools antes de realizar una migración manual, usando los ejemplos de creación de la API para la cuenta elegida.

`localStorage` conserva únicamente la sesión JWT. El backend valida firma, caducidad, existencia del usuario y versión de sesión. El frontend también cierra al vencer el tiempo. No hay JWT de renovación. Si la API está desconectada, se muestran errores y no se simula que se guardó una postulación. El cierre local siempre ocurre; si falla la petición de logout, no se puede confirmar la revocación en servidor.

## Comprobaciones y pruebas

Desde `backend`:

```powershell
npm run typecheck
npm run build
npm test
npm run test:e2e
```

Las pruebas e2e requieren `TEST_DATABASE_URL`. Usan PostgreSQL real: crean un schema aleatorio, ejecutan la migración y lo eliminan al finalizar; no borran el schema público. Usa una base de pruebas dedicada. Sin conexión configurada fallan explícitamente: no cambian a una base falsa ni se marcan como aprobadas.

Desde `frontend`:

```powershell
npm run typecheck
npm run build
npm run preview
```

Para ejecutar el backend compilado: `npm run build` y `npm start`, siempre desde `backend` con `.env` configurado.

Ejemplos HTTP para REST Client o para copiar a Postman: **[docs/api.http](docs/api.http)**. Sustituye `@token`, `@id` y `@resetToken` con las respuestas reales.

## Despliegue: Neon + Render + Vercel

Arquitectura: navegador → frontend en Vercel → API NestJS en Render → PostgreSQL en Neon.

### 1. Neon — base de datos

Crea un proyecto PostgreSQL y copia su connection string completa desde **Connect**, incluyendo `sslmode=require` y los demás parámetros que Neon proporcione. Puedes usar la conexión directa para este proyecto académico. Pégala en `DATABASE_URL` de Render. El driver `pg` interpreta SSL desde la URL tanto en la API como en las migraciones; no se desactiva la validación de certificados.

### 2. Render — backend

Después de hacer commit y subir tu rama, puedes crear un **Blueprint** usando `render.yaml` en la raíz. Solicitará `DATABASE_URL` y `FRONTEND_ORIGIN`, y generará `JWT_SECRET`. Si lo configuras manualmente, crea un **Web Service**:

| Ajuste | Valor |
|---|---|
| Branch | La rama que subiste, por ejemplo `feature/sprint-1-2-backend` |
| Root Directory | `backend` |
| Runtime | Node (el proyecto especifica Node 24.x) |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm run start:deploy` |
| Health Check Path | `/api/health` |

Variables del servicio:

```dotenv
NODE_ENV=production
DATABASE_URL=PEGA_LA_URL_COMPLETA_DE_NEON_CON_SSL
JWT_SECRET=SECRETO_ALEATORIO_DE_AL_MENOS_32_CARACTERES
JWT_EXPIRES_SECONDS=28800
FRONTEND_ORIGIN=https://tu-proyecto.vercel.app
DEMO_PASSWORD_RESET=false
```

`FRONTEND_ORIGIN` debe ser el origen exacto de Vercel, sin barra final ni ruta. Si todavía no lo conoces, actualízalo al terminar el paso 3. Render asigna `PORT`; el servidor escucha en `0.0.0.0`.

`start:deploy` ejecuta las migraciones compiladas antes de arrancar; si fallan, el servicio no arranca. Las migraciones ya aplicadas no se repiten. Este flujo está pensado para una instancia de la API. No ejecutes migraciones durante el build.

Comprueba `https://tu-backend.onrender.com/api/health`: debe responder `{"status":"ok"}` después de consultar PostgreSQL. No expone credenciales. La ruta raíz `/` no es una página web de la API y puede responder 404.

### 3. Vercel — frontend

Importa el mismo repositorio y configura:

| Ajuste | Valor |
|---|---|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 24.x |

`frontend/vercel.json` ya define instalación, build y output. Agrega en las variables de Vercel:

```dotenv
VITE_API_URL=https://tu-backend.onrender.com/api
```

Despliega y copia el dominio final en `FRONTEND_ORIGIN` de Render; guarda y vuelve a desplegar el backend. Si cambias `VITE_API_URL`, vuelve a desplegar el frontend porque Vite la incorpora durante el build. Las URLs de preview de Vercel son orígenes distintos; esta configuración permite el dominio exacto que indiques.

### 4. Cuenta demo y comprobación final

Las migraciones no crean la cuenta demo. Para cargarla una sola vez en Neon, configura temporalmente tu `backend/.env` local con la URL de Neon y `NODE_ENV=development`, y ejecuta desde `backend`:

```powershell
npm run seed
```

Si tu terminal tiene `NODE_ENV=production`, cámbiala también para esa ejecución. El seed no modifica una cuenta que ya exista. Después restaura tu configuración local habitual.

Desde Vercel, prueba registro, login, creación, edición, cambio de estado, eliminación y persistencia al recargar. La recuperación académica está deshabilitada en producción y devuelve 503; el envío real de correo sigue pendiente. El primer acceso puede tardar si los servicios están suspendidos.

Los secretos de Neon y JWT van únicamente en Render o en `.env` local; la única variable que necesita Vercel es la URL pública de la API. Los archivos `.env` están ignorados por Git.

### Commit

Desde la raíz del repositorio:

```powershell
git status
git add .
git commit -m "feat: agrega backend y conexión a base de datos PostgreSQL"
```

Luego sube la rama que quieras conectar en Render/Vercel. La preparación del proyecto no publica ni conecta automáticamente tus cuentas de esos servicios.

## Documentación y alcance

- [Sprint 1](docs/sprint-1.md): autenticación, recuperación y cuentas.
- [Sprint 2](docs/sprint-2-parcial.md): postulaciones por propietario.
- [Sprint 3](docs/sprint-3.md): navegación, módulos de gestión y análisis.
- [Pruebas y evidencias](docs/pruebas-iniciales.md).

Pendiente fuera de estos sprints: drag & drop entre columnas, historial de cambios por postulación, recordatorios por correo o notificaciones, PDF/Excel con formato, recuperación por correo real y login con Google. La recuperación demo está identificada como académica y se deshabilita en producción.
