import React from 'react';
import type { EstadoPostulacion } from '../types';

interface BadgeEstadoProps {
  estado: EstadoPostulacion;
}

const ESTADO_CONFIG: Record<EstadoPostulacion, { label: string; clase: string; emoji: string }> = {
  'Por postular': { label: 'Por postular', clase: 'badge--por-postular',  emoji: '⏳' },
  'Postulado':    { label: 'Postulado',    clase: 'badge--postulado',     emoji: '📤' },
  'Entrevista':   { label: 'Entrevista',   clase: 'badge--entrevista',    emoji: '🎙️' },
  'Oferta':       { label: 'Oferta',       clase: 'badge--oferta',        emoji: '🎉' },
};

const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <span className={`badge ${cfg.clase}`}>
      {cfg.emoji} {cfg.label}
    </span>
  );
};

export default BadgeEstado;
export { ESTADO_CONFIG };
