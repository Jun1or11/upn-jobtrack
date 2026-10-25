import React, { useMemo, useState } from 'react';
import type { EstadoPostulacion, Postulacion } from '../types';
import { ESTADOS, ESTADO_KANBAN_CLASS } from '../constants/postulaciones';
import JobCard from './JobCard';
import ListItemPostulacion from './ListItemPostulacion';

interface PostulacionesManagerProps {
  postulaciones: Postulacion[];
  onNueva: () => void;
  onEditar: (postulacion: Postulacion) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, estado: EstadoPostulacion) => void;
}

type Vista = 'kanban' | 'lista';

const PostulacionesManager: React.FC<PostulacionesManagerProps> = ({
  postulaciones, onNueva, onEditar, onEliminar, onCambiarEstado,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [vista, setVista] = useState<Vista>('kanban');

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return postulaciones.filter(p => {
      const coincideTexto = !q ||
        p.empresa.toLowerCase().includes(q) ||
        p.cargo.toLowerCase().includes(q) ||
        p.fuente.toLowerCase().includes(q) ||
        p.proximaAccion.toLowerCase().includes(q);
      const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [postulaciones, busqueda, filtroEstado]);

  return (
    <>
      <div className="actions-bar">
        <div className="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="input-busqueda"
            type="search"
            className="form-control"
            placeholder="Buscar por empresa, cargo o fuente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            aria-label="Buscar postulaciones"
          />
        </div>

        <select
          id="select-filtro-estado"
          className="filter-select"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="Todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        <div className="view-toggle" role="group" aria-label="Modo de vista">
          <button
            id="btn-vista-kanban"
            className={`view-toggle-btn${vista === 'kanban' ? ' active' : ''}`}
            onClick={() => setVista('kanban')}
            aria-pressed={vista === 'kanban'}
            title="Vista kanban"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button
            id="btn-vista-lista"
            className={`view-toggle-btn${vista === 'lista' ? ' active' : ''}`}
            onClick={() => setVista('lista')}
            aria-pressed={vista === 'lista'}
            title="Vista lista"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>

        <span className="results-count">
          {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}
        </span>

        <button id="btn-nueva-postulacion" className="btn btn--primary" onClick={onNueva}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva postulación
        </button>
      </div>

      {vista === 'kanban' ? (
        <section className="kanban-view" aria-label="Vista kanban de postulaciones">
          {ESTADOS.map(estado => {
            const items = filtradas.filter(p => p.estado === estado);
            const dotClass = ESTADO_KANBAN_CLASS[estado];
            return (
              <div key={estado} className="kanban-col" id={`col-${dotClass}`}>
                <div className="kanban-col__header">
                  <div className="kanban-col__title">
                    <span className={`kanban-col__dot kanban-col__dot--${dotClass}`} />
                    {estado}
                  </div>
                  <span className="kanban-col__count">{items.length}</span>
                </div>
                <div className="kanban-col__body">
                  {items.length === 0 ? (
                    <div className="kanban-col__empty">
                      <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>
                        {estado === 'Oferta' ? '🎯' : '📭'}
                      </div>
                      Sin postulaciones
                    </div>
                  ) : (
                    items.map((p, i) => (
                      <JobCard key={p.id} postulacion={p} onEliminar={onEliminar}
                        onEditar={onEditar} onCambiarEstado={onCambiarEstado} delay={i * 50} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="list-view" aria-label="Vista lista de postulaciones"
          role="table" id="tabla-postulaciones">
          {filtradas.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state__icon">🔍</div>
              <div className="empty-state__title">Sin resultados</div>
              <p className="empty-state__sub">
                No se encontraron postulaciones con los filtros actuales.
                Intenta cambiar la búsqueda o el estado.
              </p>
              <button className="btn btn--secondary btn--sm"
                onClick={() => { setBusqueda(''); setFiltroEstado('Todos'); }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            filtradas.map((p, i) => (
              <ListItemPostulacion key={p.id} postulacion={p} onEliminar={onEliminar}
                onEditar={onEditar} onCambiarEstado={onCambiarEstado} delay={i * 40} />
            ))
          )}
        </section>
      )}
    </>
  );
};

export default PostulacionesManager;
