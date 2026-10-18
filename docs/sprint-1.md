# Sprint 1 — Autenticación y cuentas

## Implementado

- NestJS 11 con PostgreSQL 16 mediante TypeORM y variables de entorno.
- Migración versionada para usuarios y postulaciones; `synchronize: false`.
- Registro con correo normalizado y único, perfil y contraseña bcrypt (12 rondas).
- Login real: JWT HS256 con emisor, audiencia, caducidad y versión de sesión.
- Guard que verifica JWT y usuario en la base antes de permitir acceso.
- Restauración de sesión con `/auth/me`, cierre local por vencimiento y manejo de 401.
- Logout con incremento de versión: invalida todos los JWT anteriores del usuario.
- Recuperación académica explícita: token aleatorio, hash SHA-256 almacenado, vence en 15 minutos, consumo único transaccional y revocación de sesiones.
- Eliminación de cuenta con contraseña actual y borrado de postulaciones en cascada.
- Cuenta demo en PostgreSQL con bcrypt, creada por un seed explícito e idempotente.
- Formulario de registro, recuperación y eliminación dentro de modales del diseño existente.

## Endpoints

| Método | Ruta `/api` | Acceso |
|---|---|---|
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |
| GET | `/auth/me` | JWT |
| POST | `/auth/logout` | JWT |
| POST | `/auth/forgot-password` | Público, solo con modo demo habilitado |
| POST | `/auth/reset-password` | Token de recuperación |
| DELETE | `/auth/account` | JWT y contraseña actual |

Archivos: `backend/src/auth/`, `backend/src/users/user.entity.ts`, `backend/src/config.ts`, `backend/src/database/`; `frontend/src/utils/api.ts`, `frontend/src/utils/storage.ts`, `frontend/src/App.tsx`, `frontend/src/pages/LoginPage.tsx` y `frontend/src/components/AccountModal.tsx`.

## Validación y pruebas

Validación de DTO en Nest y comprobaciones en formularios React. Campos inesperados rechazados. No se devuelve passwordHash ni hashes de recuperación. Contraseñas nuevas de 8–72 caracteres ASCII imprimibles, correo válido, nombre 2–80, ciclo 1–40 y carrera 2–100.

Jest/Supertest verifica registro duplicado, bcrypt real en base, credenciales incorrectas, JWT ausente/inválido/vencido, perfil, recuperación, token de un uso, logout, eliminación y cascada. Ver `backend/test/app.e2e-spec.ts` y `docs/pruebas-iniciales.md`.

## Configuración y límites

Se requieren `DATABASE_URL` y `JWT_SECRET` válidos. La recuperación demo exige `DEMO_PASSWORD_RESET=true`; devuelve el token en pantalla/respuesta, **no envía un correo** y no está permitida en producción. Cuando está deshabilitada, el endpoint informa 503.

No hay refresh tokens. La sesión local guarda el JWT; la contraseña no se guarda en el navegador. Si la API no está disponible al cerrar sesión, se limpia el navegador, pero no se garantiza revocación remota hasta que la petición pueda llegar.

Pendiente fuera del alcance: recuperación SMTP real, OAuth Google y 2FA. Instalación y comandos en el README principal.
