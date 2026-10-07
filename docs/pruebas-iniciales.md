# Pruebas Iniciales – JOBTRACK

**Documento:** Plan y Resultados de Pruebas Funcionales  
**Sistema:** JOBTRACK – Prototipo Semana 6  
**Versión:** 0.1.0  
**Fecha:** Octubre 2026  
**Entorno:** Navegador local (`http://localhost:5173`)  
**Credenciales demo:** `n00329808@upn.pe` / `jobtrack-demo`

---

## Tabla de Pruebas Funcionales

| N° | Caso de Prueba | Módulo | Pasos | Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado |
|---|---|---|---|---|---|---|---|
| PT-01 | Login con credenciales correctas | Autenticación | 1. Abrir `http://localhost:5173` 2. Ingresar correo y contraseña 3. Hacer clic en "Ingresar al sistema" | Email: `n00329808@upn.pe` Clave: `jobtrack-demo` | Redirigir al dashboard. Sesión guardada en localStorage. | ✅ Redirige correctamente al dashboard | ✅ PASA |
| PT-02 | Login con contraseña incorrecta | Autenticación | 1. Ingresar correo correcto 2. Ingresar contraseña errónea 3. Hacer clic en "Ingresar al sistema" | Email: `n00329808@upn.pe` Clave: `1234` | Mostrar mensaje de error. No redirigir. | ✅ Muestra alerta de error en rojo | ✅ PASA |
| PT-03 | Login con correo incorrecto | Autenticación | 1. Ingresar un correo distinto 2. Ingresar cualquier contraseña | Email: `otro@gmail.com` Clave: `cualquiera` | Mostrar mensaje de error. No redirigir. | ✅ Muestra alerta de error en rojo | ✅ PASA |
| PT-04 | Login con campos vacíos | Autenticación | 1. No ingresar datos 2. Hacer clic en "Ingresar" | Campos vacíos | Mostrar mensaje de validación. | ✅ Muestra "Por favor completa todos los campos" | ✅ PASA |
| PT-05 | Persistencia de sesión al recargar | Autenticación | 1. Iniciar sesión 2. Recargar la página (F5) | Sesión activa en localStorage | Dashboard carga directamente sin pedir login | ✅ Dashboard se mantiene abierto | ✅ PASA |
| PT-06 | Acceso directo al dashboard sin sesión | Autenticación | 1. Limpiar localStorage 2. Acceder a la URL | Sin sesión | Mostrar la pantalla de login | ✅ Muestra login correctamente | ✅ PASA |
| PT-07 | Cierre de sesión | Autenticación | 1. Iniciar sesión 2. Hacer clic en "Cerrar sesión" en el sidebar | Sesión activa | Redirigir al login. Datos de sesión eliminados. | ✅ Redirige al login y limpia localStorage | ✅ PASA |
| PT-08 | Visualización del dashboard | Dashboard | 1. Iniciar sesión correctamente | Sesión activa | Dashboard con métricas, postulaciones y sidebar visibles | ✅ Dashboard completo con 8 postulaciones demo | ✅ PASA |
| PT-09 | Métricas visibles | Dashboard | 1. Iniciar sesión 2. Observar las tarjetas de métricas | 8 postulaciones demo | 4 tarjetas: Total=8, Postuladas=3, Entrevistas=2, Ofertas=1 | ✅ Valores correctos en tiempo real | ✅ PASA |
| PT-10 | Vista kanban por defecto | Dashboard | 1. Iniciar sesión 2. Verificar vista inicial | — | Columnas: Por postular, Postulado, Entrevista, Oferta con tarjetas | ✅ 4 columnas con tarjetas correctamente distribuidas | ✅ PASA |
| PT-11 | Cambiar a vista lista | Dashboard | 1. Hacer clic en el ícono de lista | — | Mostrar postulaciones como filas en una lista vertical | ✅ Vista lista con todas las postulaciones | ✅ PASA |
| PT-12 | Filtro por estado – "Entrevista" | Filtros | 1. Seleccionar "Entrevista" en el filtro de estado | Estado: Entrevista | Mostrar solo las postulaciones en estado Entrevista | ✅ Solo muestra BCP y Yape (2 ítems) | ✅ PASA |
| PT-13 | Filtro por estado – "Oferta" | Filtros | 1. Seleccionar "Oferta" en el filtro | Estado: Oferta | Mostrar solo la postulación de Belcorp | ✅ Solo muestra Belcorp (1 ítem) | ✅ PASA |
| PT-14 | Búsqueda por empresa | Búsqueda | 1. Escribir "Interbank" en el buscador | Texto: "Interbank" | Mostrar solo la postulación de Interbank | ✅ Filtra correctamente por empresa | ✅ PASA |
| PT-15 | Búsqueda por cargo | Búsqueda | 1. Escribir "analista" en el buscador | Texto: "analista" | Mostrar todas las postulaciones cuyo cargo contiene "Analista" | ✅ Muestra BCP, Rimac, Alicorp y Falabella | ✅ PASA |
| PT-16 | Búsqueda sin resultados | Búsqueda | 1. Escribir texto inexistente | Texto: "zzz999" | Mostrar mensaje de estado vacío | ✅ Muestra estado vacío con mensaje amigable | ✅ PASA |
| PT-17 | Búsqueda + filtro simultáneo | Búsqueda + Filtros | 1. Filtrar por "Postulado" 2. Buscar "Interbank" | Estado: Postulado, Texto: "Interbank" | Mostrar solo postulaciones postuladas que incluyan "Interbank" | ✅ Filtra en combinación correctamente | ✅ PASA |
| PT-18 | Registro de nueva postulación | Postulaciones | 1. Clic en "Nueva postulación" 2. Llenar formulario 3. Clic en "Guardar" | Empresa: "Google Perú", Cargo: "Intern Dev", Fecha: actual | Modal se cierra y nueva tarjeta aparece en el kanban | ✅ Postulación agregada y visible en la columna correcta | ✅ PASA |
| PT-19 | Validación en formulario | Postulaciones | 1. Abrir modal 2. No ingresar empresa ni cargo 3. Guardar | Campos vacíos | Mostrar mensajes de error en campos requeridos | ✅ Muestra errores en empresa y cargo | ✅ PASA |
| PT-20 | Persistencia de nueva postulación | Postulaciones | 1. Registrar postulación 2. Recargar página | Postulación guardada en localStorage | La nueva postulación debe seguir visible | ✅ Persiste correctamente en localStorage | ✅ PASA |
| PT-21 | Eliminar postulación | Postulaciones | 1. Hacer hover en una tarjeta 2. Clic en "Eliminar" | — | Tarjeta desaparece y métrica total disminuye | ✅ Elimina correctamente y actualiza métricas | ✅ PASA |
| PT-22 | Cerrar modal con Escape | UX | 1. Abrir modal 2. Presionar tecla Escape | Tecla Escape | Modal se cierra sin guardar | ✅ Modal cierra con Escape | ✅ PASA |
| PT-23 | Cerrar modal con click fuera | UX | 1. Abrir modal 2. Hacer clic en el overlay oscuro | Click en backdrop | Modal se cierra sin guardar | ✅ Modal cierra al hacer clic fuera | ✅ PASA |
| PT-24 | Responsive en móvil | Responsive | 1. Reducir ventana a 375px de ancho 2. Navegar | Pantalla móvil | Sidebar oculto, botón hamburguesa visible, layout de 1 columna | ✅ Adaptación correcta para móvil | ✅ PASA |
| PT-25 | Sidebar en móvil | Responsive | 1. En vista móvil 2. Clic en ícono hamburguesa | Pantalla móvil | Sidebar desliza desde la izquierda | ✅ Sidebar aparece con overlay | ✅ PASA |

---

## Resumen de Resultados

| Resultado | Cantidad |
|---|---|
| ✅ Pruebas que PASAN | 25 |
| ❌ Pruebas que FALLAN | 0 |
| ⏳ Pruebas pendientes | 0 |
| **Total** | **25** |

---

## Observaciones Generales

1. Todas las pruebas se ejecutaron en el entorno de desarrollo local con `npm run dev`.
2. Los datos son de demostración; no existe conexión a backend real.
3. La sesión se almacena en `localStorage` bajo la clave `jobtrack_session`.
4. Las postulaciones se almacenan en `localStorage` bajo la clave `jobtrack_postulaciones`.
5. Al limpiar el localStorage, el sistema se reinicia con los datos demo originales.

---

## Herramientas de Prueba Utilizadas

- Navegador: Google Chrome / Microsoft Edge
- Herramientas de desarrollo del navegador (F12) para inspeccionar localStorage
- Reducción manual de ventana para pruebas responsive

---

*Documento generado para el informe académico del proyecto JOBTRACK – UPN Chorrillos 2026*
