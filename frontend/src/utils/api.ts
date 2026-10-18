import type { SesionAuth, Usuario, Postulacion } from '../types';
import { cerrarSesion, guardarSesion, obtenerSesion } from './storage';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, '');

export async function api<T>(path: string, options: RequestInit = {}, auth = true): Promise<T> {
  const session = obtenerSesion();
  if (auth && !session) {
    cerrarSesion();
    throw new Error('La sesión ha vencido. Inicia sesión nuevamente.');
  }
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${session!.token}` } : {}), ...options.headers },
    });
  } catch { throw new Error('No se pudo conectar con la API. Comprueba que el backend esté iniciado.'); }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (auth && response.status === 401 && path !== '/auth/account') cerrarSesion();
    const message = body?.message;
    throw new Error(Array.isArray(message) ? message.join(' ') : message ?? `Error HTTP ${response.status}`);
  }
  return body as T;
}

export async function login(email: string, password: string) {
  const session = await api<SesionAuth>('/auth/login', { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase(), password }) }, false);
  guardarSesion(session);
  return session;
}

export async function register(datos: Omit<Usuario, 'id'> & { password: string }) {
  const session = await api<SesionAuth>('/auth/register', { method: 'POST', body: JSON.stringify(datos) }, false);
  guardarSesion(session);
  return session;
}

export const jobsApi = {
  list: () => api<Postulacion[]>('/postulaciones'),
  create: (datos: Omit<Postulacion, 'id' | 'createdAt'>) => api<Postulacion>('/postulaciones', { method: 'POST', body: JSON.stringify(datos) }),
  update: (id: string, datos: Partial<Omit<Postulacion, 'id' | 'createdAt'>>) => api<Postulacion>(`/postulaciones/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }),
  remove: (id: string) => api(`/postulaciones/${id}`, { method: 'DELETE' }),
};
