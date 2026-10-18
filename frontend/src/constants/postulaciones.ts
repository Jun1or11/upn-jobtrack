import type { EstadoPostulacion } from '../types';

// ── Estados de postulación (fuente única de verdad) ────────────────────────
export const ESTADOS: EstadoPostulacion[] = [
  'Por postular',
  'Postulado',
  'Entrevista',
  'Oferta',
];

// Configuración visual de cada estado (badge + emoji)
export const ESTADO_CONFIG: Record<
  EstadoPostulacion,
  { label: string; clase: string; emoji: string }
> = {
  'Por postular': { label: 'Por postular', clase: 'badge--por-postular', emoji: '⏳' },
  'Postulado':    { label: 'Postulado',    clase: 'badge--postulado',    emoji: '📤' },
  'Entrevista':   { label: 'Entrevista',   clase: 'badge--entrevista',   emoji: '🎙️' },
  'Oferta':       { label: 'Oferta',       clase: 'badge--oferta',       emoji: '🎉' },
};

// Sufijo de clase usado por las columnas del kanban (dot + color)
export const ESTADO_KANBAN_CLASS: Record<EstadoPostulacion, string> = {
  'Por postular': 'por-postular',
  'Postulado':    'postulado',
  'Entrevista':   'entrevista',
  'Oferta':       'oferta',
};

export const FUENTES = [
  'LinkedIn',
  'Computrabajo',
  'Indeed',
  'Bumeran',
  'Bolsa UPN',
  'Referido',
  'Web empresa',
  'Otro',
];
