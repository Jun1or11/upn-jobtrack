import React from 'react';
import type { EstadoPostulacion } from '../types';
import { ESTADO_CONFIG } from '../constants/postulaciones';

interface BadgeEstadoProps {
  estado: EstadoPostulacion;
}

const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado }) => {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <span className={`badge ${cfg.clase}`}>
      {cfg.emoji} {cfg.label}
    </span>
  );
};

export default BadgeEstado;
