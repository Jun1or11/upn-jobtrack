import React, { useMemo } from 'react';
import type { MetricasDashboard, Postulacion, VistaDashboard } from '../types';
import { ESTADO_CONFIG } from '../constants/postulaciones';
import { fechaRelativa, formatearFecha } from '../utils/fechas';

interface DashboardHomeProps {
  metricas: MetricasDashboard;
  postulaciones: Postulacion[];
  onNavegar: (vista: VistaDashboard) => void;
  onNueva: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
  metricas, postulaciones, onNavegar, onNueva,
}) => {
  const proximas = useMemo(() => postulaciones
    .filter(p => p.fechaProximaAccion)
    .sort((a, b) => (a.fechaProximaAccion ?? '').localeCompare(b.fechaProximaAccion ?? ''))
    .slice(0, 5), [postulaciones]);

  const recientes = useMemo(() => [...postulaciones]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5), [postulaciones]);

  const empresas = useMemo(() => new Set(postulaciones.map(p => p.empresa)).size, [postulaciones]);
  const entrevistas = postulaciones.filter(p => p.estado === 'Entrevista').length;
  const respuesta = metricas.total
    ? Math.round(((metricas.postulado + metricas.entrevista + metricas.oferta) / metricas.total) * 100)
    : 0;

  return (
    <>
      <section aria-label="Métricas de postulaciones">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card__icon metric-card__icon--total">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <div id="metric-total" className="metric-card__value">{metricas.total}</div>
              <div className="metric-card__label">Total postulaciones</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card__icon metric-card__icon--postulado">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </div>
            <div>
              <div id="metric-postulado" className="metric-card__value">{metricas.postulado}</div>
              <div className="metric-card__label">Postuladas</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card__icon metric-card__icon--entrevista">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div id="metric-entrevista" className="metric-card__value">{metricas.entrevista}</div>
              <div className="metric-card__label">En entrevista</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card__icon metric-card__icon--oferta">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div id="metric-oferta" className="metric-card__value">{metricas.oferta}</div>
              <div className="metric-card__label">Ofertas recibidas</div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-highlight">
        <div className="dashboard-highlight__text">
          <span className="dashboard-highlight__eyebrow">Resumen de tu búsqueda</span>
          <h2 className="dashboard-highlight__title">
            {metricas.total === 0
              ? 'Empieza registrando tu primera postulación'
              : `Tienes ${metricas.total} postulaciones y ${entrevistas} entrevistas activas`}
          </h2>
          <p className="dashboard-highlight__sub">
            {metricas.total === 0
              ? 'Centraliza tus procesos, fechas y próximas acciones en un solo lugar.'
              : `Tasa de respuesta del ${respuesta}% en ${empresas} empresa${empresas !== 1 ? 's' : ''}. Mantén tus próximas acciones al día para no perder oportunidades.`}
          </p>
          <div className="dashboard-highlight__actions">
            <button className="btn btn--primary" onClick={onNueva}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Registrar postulación
            </button>
            <button className="btn btn--secondary" onClick={() => onNavegar('postulaciones')}>
              Ver todas
            </button>
          </div>
        </div>
        <div className="dashboard-highlight__stats">
          <div className="mini-stat">
            <span className="mini-stat__value">{empresas}</span>
            <span className="mini-stat__label">Empresas</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__value">{entrevistas}</span>
            <span className="mini-stat__label">Entrevistas</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__value">{respuesta}%</span>
            <span className="mini-stat__label">Respuesta</span>
          </div>
        </div>
      </section>

      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Próximas acciones
            </h3>
            <button className="panel__link" onClick={() => onNavegar('calendario')}>
              Calendario →
            </button>
          </div>
          {proximas.length === 0 ? (
            <div className="panel__empty">
              Aún no tienes fechas de próxima acción. Puedes agregarlas al editar una postulación.
            </div>
          ) : (
            <ul className="agenda-list">
              {proximas.map(p => (
                <li key={p.id} className="agenda-item">
                  <div className="agenda-item__date">
                    <span className="agenda-item__day">{p.fechaProximaAccion?.slice(8, 10)}</span>
                    <span className="agenda-item__month">{p.fechaProximaAccion?.slice(5, 7)}</span>
                  </div>
                  <div className="agenda-item__body">
                    <div className="agenda-item__title">{p.cargo}</div>
                    <div className="agenda-item__meta">{p.empresa} · {fechaRelativa(p.fechaProximaAccion!)}</div>
                  </div>
                  <span className={`badge ${ESTADO_CONFIG[p.estado].clase}`}>
                    {ESTADO_CONFIG[p.estado].emoji}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Actividad reciente
            </h3>
            <button className="panel__link" onClick={() => onNavegar('postulaciones')}>
              Ver postulaciones →
            </button>
          </div>
          {recientes.length === 0 ? (
            <div className="panel__empty">Todavía no hay postulaciones registradas.</div>
          ) : (
            <ul className="activity-list">
              {recientes.map(p => (
                <li key={p.id} className="activity-item">
                  <div className="activity-item__dot" />
                  <div className="activity-item__body">
                    <div className="activity-item__title">{p.cargo}</div>
                    <div className="activity-item__meta">
                      {p.empresa} · {formatearFecha(p.fecha)}
                    </div>
                  </div>
                  <span className={`badge ${ESTADO_CONFIG[p.estado].clase}`}>
                    {ESTADO_CONFIG[p.estado].label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="module-shortcuts" aria-label="Accesos rápidos">
        <button className="module-shortcut" onClick={() => onNavegar('entrevistas')}>
          <span className="module-shortcut__icon">🎙️</span>
          <span>
            <strong>Entrevistas</strong>
            <small>{entrevistas} en proceso</small>
          </span>
        </button>
        <button className="module-shortcut" onClick={() => onNavegar('empresas')}>
          <span className="module-shortcut__icon">🏢</span>
          <span>
            <strong>Empresas</strong>
            <small>{empresas} registradas</small>
          </span>
        </button>
        <button className="module-shortcut" onClick={() => onNavegar('estadisticas')}>
          <span className="module-shortcut__icon">📊</span>
          <span>
            <strong>Estadísticas</strong>
            <small>Analiza tu embudo</small>
          </span>
        </button>
        <button className="module-shortcut" onClick={() => onNavegar('calendario')}>
          <span className="module-shortcut__icon">🗓️</span>
          <span>
            <strong>Calendario</strong>
            <small>Revisa tus fechas</small>
          </span>
        </button>
      </section>
    </>
  );
};

export default DashboardHome;
