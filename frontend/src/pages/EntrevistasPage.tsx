import React, { useMemo } from 'react';
import type { EstadoPostulacion, Postulacion } from '../types';
import { ESTADOS } from '../constants/postulaciones';
import BadgeEstado from '../components/BadgeEstado';
import { fechaRelativa, formatearFecha } from '../utils/fechas';

interface EntrevistasPageProps {
  postulaciones: Postulacion[];
  onEditar: (postulacion: Postulacion) => void;
  onCambiarEstado: (id: string, estado: EstadoPostulacion) => void;
}

const EntrevistasPage: React.FC<EntrevistasPageProps> = ({
  postulaciones, onEditar, onCambiarEstado,
}) => {
  const entrevistas = useMemo(() => postulaciones
    .filter(p => p.estado === 'Entrevista')
    .sort((a, b) => {
      if (a.fechaProximaAccion && b.fechaProximaAccion) {
        return a.fechaProximaAccion.localeCompare(b.fechaProximaAccion);
      }
      return a.fechaProximaAccion ? -1 : b.fechaProximaAccion ? 1 : 0;
    }), [postulaciones]);

  const conFecha = entrevistas.filter(p => p.fechaProximaAccion).length;

  return (
    <>
      <section className="module-intro">
        <div>
          <h2 className="module-intro__title">Tus entrevistas activas</h2>
          <p className="module-intro__sub">
            Da seguimiento a los procesos que ya llegaron a la etapa de entrevista.
          </p>
        </div>
        <div className="module-intro__stats">
          <div className="mini-stat">
            <span className="mini-stat__value">{entrevistas.length}</span>
            <span className="mini-stat__label">Entrevistas</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__value">{conFecha}</span>
            <span className="mini-stat__label">Con fecha</span>
          </div>
        </div>
      </section>

      {entrevistas.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__icon">🎙️</div>
          <div className="empty-state__title">Sin entrevistas por ahora</div>
          <p className="empty-state__sub">
            Cuando una postulación cambie al estado <strong>Entrevista</strong>, aparecerá aquí
            automáticamente.
          </p>
        </div>
      ) : (
        <div className="interview-grid">
          {entrevistas.map(p => (
            <article key={p.id} className="interview-card">
              <div className="interview-card__header">
                <div>
                  <div className="interview-card__empresa">{p.empresa}</div>
                  <h3 className="interview-card__cargo">{p.cargo}</h3>
                </div>
                <BadgeEstado estado={p.estado} />
              </div>

              <div className="interview-card__dates">
                <div className="interview-card__date">
                  <span className="interview-card__date-label">Postulación</span>
                  <span className="interview-card__date-value">{formatearFecha(p.fecha)}</span>
                </div>
                <div className="interview-card__date">
                  <span className="interview-card__date-label">Próxima acción</span>
                  <span className="interview-card__date-value">
                    {p.fechaProximaAccion
                      ? `${fechaRelativa(p.fechaProximaAccion)} · ${formatearFecha(p.fechaProximaAccion)}`
                      : 'Sin fecha definida'}
                  </span>
                </div>
              </div>

              {p.proximaAccion && (
                <div className="interview-card__action">
                  <span className="interview-card__action-label">Acción</span>
                  <p>{p.proximaAccion}</p>
                </div>
              )}

              {p.nota && <p className="interview-card__nota">{p.nota}</p>}

              <div className="interview-card__footer">
                <select
                  className="status-select"
                  value={p.estado}
                  onChange={e => onCambiarEstado(p.id, e.target.value as EstadoPostulacion)}
                  aria-label={`Cambiar estado de ${p.cargo}`}
                >
                  {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
                </select>
                <button className="btn btn--secondary btn--sm" onClick={() => onEditar(p)}>
                  Editar detalles
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default EntrevistasPage;
