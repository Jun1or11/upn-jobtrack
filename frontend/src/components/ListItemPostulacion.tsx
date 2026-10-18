import React from 'react';
import type { Postulacion, EstadoPostulacion } from '../types';
import { ESTADOS } from '../constants/postulaciones';
import BadgeEstado from './BadgeEstado';

interface ListItemPostulacionProps {
  postulacion: Postulacion;
  onEliminar?: (id: string) => void;
  onEditar?: (postulacion: Postulacion) => void;
  onCambiarEstado?: (id: string, estado: EstadoPostulacion) => void;
  delay?: number;
}

const ListItemPostulacion: React.FC<ListItemPostulacionProps> = ({
  postulacion, onEliminar, onEditar, onCambiarEstado, delay = 0,
}) => {
  const { id, empresa, cargo, fuente, fecha, estado, proximaAccion } = postulacion;

  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div
      className="list-item"
      style={{ animationDelay: `${delay}ms` }}
      role="row"
      aria-label={`${cargo} en ${empresa}`}
    >
      {/* Empresa + Cargo */}
      <div className="list-item__main">
        <div className="list-item__empresa">{empresa}</div>
        <div className="list-item__cargo">{cargo}</div>
      </div>

      {/* Metadata */}
      <div className="list-item__meta">
        <div className="list-item__meta-item hide-mobile">
          <span className="list-item__meta-label">Fuente</span>
          <span className="list-item__meta-value">{fuente}</span>
        </div>
        <div className="list-item__meta-item hide-mobile">
          <span className="list-item__meta-label">Fecha</span>
          <span className="list-item__meta-value">{fechaFormateada}</span>
        </div>
        {proximaAccion && (
          <div className="list-item__meta-item" style={{ maxWidth: 200 }}>
            <span className="list-item__meta-label">Próxima acción</span>
            <span className="list-item__meta-value" style={{
              textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {proximaAccion}
            </span>
          </div>
        )}
        <BadgeEstado estado={estado} />
        {onCambiarEstado && (
          <select
            id={`select-estado-list-${id}`}
            className="status-select"
            value={estado}
            onChange={e => onCambiarEstado(id, e.target.value as EstadoPostulacion)}
            aria-label={`Cambiar estado de ${cargo}`}
            style={{ width: 150, marginTop: 0 }}
          >
            {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
          </select>
        )}
        {onEditar && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => onEditar(postulacion)}
            id={`btn-editar-list-${id}`}
            aria-label={`Editar ${cargo}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
        {onEliminar && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => onEliminar(id)}
            id={`btn-eliminar-list-${id}`}
            aria-label={`Eliminar ${cargo}`}
            style={{ marginLeft: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ListItemPostulacion;
