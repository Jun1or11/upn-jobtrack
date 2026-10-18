import React from 'react';
import type { Postulacion, EstadoPostulacion } from '../types';
import { ESTADOS } from '../constants/postulaciones';
import BadgeEstado from './BadgeEstado';

interface JobCardProps {
  postulacion: Postulacion;
  onEliminar?: (id: string) => void;
  onEditar?: (postulacion: Postulacion) => void;
  onCambiarEstado?: (id: string, estado: EstadoPostulacion) => void;
  delay?: number;
}

const JobCard: React.FC<JobCardProps> = ({
  postulacion, onEliminar, onEditar, onCambiarEstado, delay = 0,
}) => {
  const { id, empresa, cargo, fuente, fecha, estado, proximaAccion, nota } = postulacion;

  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div
      className="job-card"
      style={{ animationDelay: `${delay}ms` }}
      role="article"
      aria-label={`${cargo} en ${empresa}`}
    >
      {/* Empresa */}
      <div className="job-card__empresa">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        {empresa}
      </div>

      {/* Cargo */}
      <div className="job-card__cargo">{cargo}</div>

      {/* Metadata */}
      <div className="job-card__meta">
        <BadgeEstado estado={estado} />
        <span className="job-card__tag">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          {fuente}
        </span>
        <span className="job-card__tag">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {fechaFormateada}
        </span>
      </div>

      {/* Cambio rápido de estado */}
      {onCambiarEstado && (
        <select
          id={`select-estado-${id}`}
          className="status-select"
          value={estado}
          onChange={e => onCambiarEstado(id, e.target.value as EstadoPostulacion)}
          aria-label={`Cambiar estado de ${cargo}`}
        >
          {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      )}

      <hr className="job-card__divider" />

      {/* Próxima acción */}
      {proximaAccion && (
        <div className="job-card__next-action">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span>{proximaAccion}</span>
        </div>
      )}

      {/* Nota */}
      {nota && <p className="job-card__nota">💬 {nota}</p>}

      {/* Acciones hover */}
      {(onEditar || onEliminar) && (
        <div className="job-card__actions">
          {onEditar && (
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => onEditar(postulacion)}
              id={`btn-editar-${id}`}
              aria-label={`Editar postulación ${cargo}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          )}
          {onEliminar && (
            <button
              className="btn btn--danger btn--sm"
              onClick={() => onEliminar(id)}
              id={`btn-eliminar-${id}`}
              aria-label={`Eliminar postulación ${cargo}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
