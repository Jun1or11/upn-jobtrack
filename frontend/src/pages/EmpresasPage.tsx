import React, { useMemo, useState } from 'react';
import type { EstadoPostulacion, Postulacion, VistaDashboard } from '../types';
import { ESTADOS, ESTADO_CONFIG, ESTADO_KANBAN_CLASS } from '../constants/postulaciones';
import { formatearFecha } from '../utils/fechas';

interface EmpresasPageProps {
  postulaciones: Postulacion[];
  onNavegar: (vista: VistaDashboard) => void;
}

interface GrupoEmpresa {
  empresa: string;
  total: number;
  estados: Record<EstadoPostulacion, number>;
  ultimaFecha: string;
  fuentes: string[];
}

const iniciales = (nombre: string) => nombre
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(parte => parte[0])
  .join('')
  .toUpperCase();

const EmpresasPage: React.FC<EmpresasPageProps> = ({ postulaciones, onNavegar }) => {
  const [busqueda, setBusqueda] = useState('');

  const grupos = useMemo(() => {
    const mapa = new Map<string, GrupoEmpresa>();
    for (const p of postulaciones) {
      const actual = mapa.get(p.empresa) ?? {
        empresa: p.empresa,
        total: 0,
        estados: Object.fromEntries(ESTADOS.map(e => [e, 0])) as Record<EstadoPostulacion, number>,
        ultimaFecha: p.fecha,
        fuentes: [],
      };
      actual.total += 1;
      actual.estados[p.estado] += 1;
      if (p.fecha > actual.ultimaFecha) actual.ultimaFecha = p.fecha;
      if (!actual.fuentes.includes(p.fuente)) actual.fuentes.push(p.fuente);
      mapa.set(p.empresa, actual);
    }
    const q = busqueda.trim().toLowerCase();
    return [...mapa.values()]
      .filter(g => !q || g.empresa.toLowerCase().includes(q))
      .sort((a, b) => b.total - a.total || a.empresa.localeCompare(b.empresa));
  }, [postulaciones, busqueda]);

  return (
    <>
      <section className="module-intro">
        <div>
          <h2 className="module-intro__title">Empresas contactadas</h2>
          <p className="module-intro__sub">
            Agrupación automática de tus postulaciones por empresa.
          </p>
        </div>
        <div className="module-intro__stats">
          <div className="mini-stat">
            <span className="mini-stat__value">{grupos.length}</span>
            <span className="mini-stat__label">Empresas</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__value">{postulaciones.length}</span>
            <span className="mini-stat__label">Postulaciones</span>
          </div>
        </div>
      </section>

      <div className="actions-bar">
        <div className="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="search" className="form-control" placeholder="Buscar empresa..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            aria-label="Buscar empresa" />
        </div>
        <span className="results-count">
          {grupos.length} empresa{grupos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {grupos.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state__icon">🏢</div>
          <div className="empty-state__title">Sin empresas todavía</div>
          <p className="empty-state__sub">
            Registra postulaciones para ver aquí el resumen por empresa.
          </p>
        </div>
      ) : (
        <div className="company-grid">
          {grupos.map(g => (
            <article key={g.empresa} className="company-card">
              <div className="company-card__header">
                <div className="company-card__avatar">{iniciales(g.empresa)}</div>
                <div className="company-card__title">
                  <h3>{g.empresa}</h3>
                  <p>
                    {g.total} postulación{g.total !== 1 ? 'es' : ''} · última{' '}
                    {formatearFecha(g.ultimaFecha)}
                  </p>
                </div>
              </div>

              <div className="company-card__states">
                {ESTADOS.map(estado => g.estados[estado] > 0 && (
                  <div key={estado} className="company-card__state">
                    <span className={`kanban-col__dot kanban-col__dot--${ESTADO_KANBAN_CLASS[estado]}`} />
                    <span>{ESTADO_CONFIG[estado].label}</span>
                    <strong>{g.estados[estado]}</strong>
                  </div>
                ))}
              </div>

              <div className="company-card__footer">
                <span className="company-card__source">{g.fuentes.join(' · ')}</span>
                <button className="panel__link" onClick={() => onNavegar('postulaciones')}>
                  Ir a postulaciones →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default EmpresasPage;
