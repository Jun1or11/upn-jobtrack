import type { SesionAuth } from '../types';

const SESSION_KEY = 'jobtrack_session';

export function guardarSesion(sesion: SesionAuth): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
}

export function obtenerSesion(): SesionAuth | null {
  try {
    const sesion = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as SesionAuth | null;
    if (!sesion || !sesion.usuario?.id || typeof sesion.token !== 'string' ||
      !Number.isFinite(sesion.expiraEn) || sesion.expiraEn <= Date.now()) return null;
    return sesion;
  } catch { return null; }
}

export function cerrarSesion(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('jobtrack:logout'));
}

export function haySession(): boolean { return obtenerSesion() !== null; }
