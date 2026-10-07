# Sprint 1 – Autenticación y Acceso

**Estado:** ✅ Completado  
**Período:** Semana 1–3 (simulado en prototipo)  
**Responsable:** Equipo JOBTRACK – UPN Chorrillos 2026

---

## Objetivos del Sprint 1

Implementar el módulo de autenticación completo, incluyendo pantalla de login, validación de credenciales, protección de rutas y gestión de sesión.

---

## Historias de Usuario Implementadas

### US-01 – Pantalla de Login
**Como** estudiante de UPN,  
**quiero** ver una pantalla de inicio de sesión,  
**para** acceder al sistema de forma segura.

**Criterios de aceptación:**
- [x] Pantalla con campos de correo institucional y contraseña
- [x] Diseño limpio y profesional con colores UPN
- [x] Botón de "Ingresar al sistema"
- [x] Panel de branding visible en pantallas grandes
- [x] Responsive para móvil y laptop

### US-02 – Validación de Credenciales
**Como** estudiante,  
**quiero** que el sistema valide mis credenciales,  
**para** acceder solo si son correctas.

**Criterios de aceptación:**
- [x] Validar correo `n00329808@upn.pe` + contraseña `jobtrack-demo`
- [x] Mostrar error si las credenciales son incorrectas
- [x] Mostrar estado de carga mientras se procesa
- [x] Redirigir al dashboard al autenticar correctamente

### US-03 – Persistencia de Sesión
**Como** usuario autenticado,  
**quiero** que mi sesión persista al recargar la página,  
**para** no tener que iniciar sesión cada vez.

**Criterios de aceptación:**
- [x] Guardar sesión en localStorage
- [x] Verificar sesión al cargar la app
- [x] Sesión expira después de 8 horas
- [x] Splash screen mientras se verifica

### US-04 – Cierre de Sesión
**Como** usuario autenticado,  
**quiero** poder cerrar sesión,  
**para** proteger mi información al compartir el equipo.

**Criterios de aceptación:**
- [x] Botón "Cerrar sesión" en el sidebar
- [x] Eliminar datos de sesión del localStorage
- [x] Redirigir automáticamente al login

### US-05 – Protección de Rutas
**Como** sistema,  
**quiero** proteger el dashboard,  
**para** que solo usuarios autenticados lo accedan.

**Criterios de aceptación:**
- [x] Si no hay sesión, mostrar login (no dashboard)
- [x] Si hay sesión válida, mostrar dashboard directamente
- [x] Si la sesión expiró, redirigir al login

---

## Componentes Implementados

| Componente | Archivo | Descripción |
|---|---|---|
| `LoginPage` | `pages/LoginPage.tsx` | Pantalla completa de login con dos paneles |
| `App` | `App.tsx` | Lógica de routing y protección de rutas |
| `storage.ts` | `utils/storage.ts` | Funciones de auth y localStorage |

## Estilos Implementados

| Archivo | Propósito |
|---|---|
| `styles/global.css` | Design system global, tokens, botones, inputs |
| `styles/login.css` | Estilos específicos de la pantalla de login |

---

## Funcionalidades Técnicas Implementadas

1. **Validación de formulario** – campos requeridos y formato básico
2. **Simulación de latencia** – 900ms para simular llamada a API
3. **Toggle de contraseña** – ver/ocultar contraseña
4. **Auto-completar demo** – botón para llenar las credenciales demo
5. **Accesibilidad** – `aria-label`, `role`, `aria-modal` en todos los elementos

---

## Credenciales Demo

| Campo | Valor |
|---|---|
| Correo | `n00329808@upn.pe` |
| Contraseña | `jobtrack-demo` |
| Duración sesión | 8 horas |

---

## Pendiente (Siguiente Sprint)

- [ ] Registro de nuevos usuarios
- [ ] Recuperación de contraseña
- [ ] Login con cuenta Google UPN
- [ ] 2FA (verificación en dos pasos)
