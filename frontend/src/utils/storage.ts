import type { SesionAuth, Usuario } from '../types';

// ── Constantes ─────────────────────────────────────────────────────────────
const SESSION_KEY = 'jobtrack_session';
const POSTULACIONES_KEY = 'jobtrack_postulaciones';
const DEMO_DURACION_MS = 8 * 60 * 60 * 1000; // 8 horas

// ── Credenciales demo ──────────────────────────────────────────────────────
const DEMO_EMAIL = 'n00329808@upn.pe';
const DEMO_PASSWORD = 'jobtrack-demo';

const DEMO_USUARIO: Usuario = {
  email: DEMO_EMAIL,
  nombre: 'Junior Estudiante',
  ciclo: '9.° ciclo',
  carrera: 'Ingeniería de Sistemas',
};

// ── Auth helpers ───────────────────────────────────────────────────────────
export function validarCredenciales(email: string, password: string): boolean {
  return email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function crearSesion(): void {
  const sesion: SesionAuth = {
    usuario: DEMO_USUARIO,
    token: 'demo-token-' + Date.now(),
    expiraEn: Date.now() + DEMO_DURACION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
}

export function obtenerSesion(): SesionAuth | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sesion: SesionAuth = JSON.parse(raw);
    if (Date.now() > sesion.expiraEn) {
      cerrarSesion();
      return null;
    }
    return sesion;
  } catch {
    return null;
  }
}

export function cerrarSesion(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function haySession(): boolean {
  return obtenerSesion() !== null;
}

// ── Postulaciones helpers ──────────────────────────────────────────────────
export function guardarPostulaciones(postulaciones: unknown[]): void {
  localStorage.setItem(POSTULACIONES_KEY, JSON.stringify(postulaciones));
}

export function cargarPostulaciones(): unknown[] | null {
  try {
    const raw = localStorage.getItem(POSTULACIONES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function generarId(): string {
  return `jt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
