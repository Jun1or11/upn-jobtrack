import React from 'react';
import type { Postulacion } from '../types';
import BadgeEstado from './BadgeEstado';

interface ListItemPostulacionProps {
  postulacion: Postulacion;
  onEliminar?: (id: string) => void;
  delay?: number;
}

const ListItemPostulacion: React.FC<ListItemPostulacionProps> = ({
  postulacion, onEliminar, delay = 0,
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
