import React, { useState, useMemo } from 'react';
import type { EstadoPostulacion, SesionAuth } from '../types';
import { usePostulaciones } from '../hooks/usePostulaciones';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import ListItemPostulacion from '../components/ListItemPostulacion';
import ModalNuevaPostulacion from '../components/ModalNuevaPostulacion';
import BadgeEstado from '../components/BadgeEstado';
import '../styles/dashboard.css';

interface DashboardPageProps {
  sesion: SesionAuth;
  onLogout: () => void;
}

type Vista = 'kanban' | 'lista';

const ESTADOS: EstadoPostulacion[] = ['Por postular', 'Postulado', 'Entrevista', 'Oferta'];

const KANBAN_COL_STYLES: Record<EstadoPostulacion, string> = {
  'Por postular': 'por-postular',
  'Postulado':    'postulado',
  'Entrevista':   'entrevista',
  'Oferta':       'oferta',
};

const DashboardPage: React.FC<DashboardPageProps> = ({ sesion, onLogout }) => {
  const { postulaciones, metricas, agregarPostulacion, eliminarPostulacion } = usePostulaciones();

  const [busqueda, setBusqueda]         = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [vista, setVista]               = useState<Vista>('kanban');
  const [modalOpen, setModalOpen]       = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  // Filtrado
  const postulacionesFiltradas = useMemo(() => {
    return postulaciones.filter(p => {
      const q = busqueda.toLowerCase();
      const matchBusqueda =
        !q ||
        p.empresa.toLowerCase().includes(q) ||
        p.cargo.toLowerCase().includes(q) ||
        p.fuente.toLowerCase().includes(q);
      const matchEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
      return matchBusqueda && matchEstado;
    });
  }, [postulaciones, busqueda, filtroEstado]);

  const handleGuardar = (nueva: Parameters<typeof agregarPostulacion>[0]) => {
    agregarPostulacion(nueva);
    setModalOpen(false);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <Sidebar
        sesion={sesion}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenido principal */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header__left">
            <button
              className="header__menu-btn"
              id="btn-menu-movil"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Abrir menú"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <div className="header__title">Dashboard de Postulaciones</div>
              <div className="header__subtitle">Seguimiento de tu búsqueda laboral</div>
            </div>
          </div>
          <div className="header__right">
            <span className="header__proto-badge">
              ⚗️ Prototipo académico – datos de demostración
            </span>
            <div className="header__user-chip">
              <div className="header__user-dot" />
              {sesion.usuario.nombre.split(' ')[0]}
            </div>
          </div>
        </header>

        {/* Página */}
        <main className="page-body" id="main-dashboard">
          {/* ── Métricas ─────────────────────────────────────────────── */}
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

          {/* ── Barra de acciones ─────────────────────────────────── */}
          <div className="actions-bar">
            {/* Búsqueda */}
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
                placeholder="Buscar por empresa o cargo..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                aria-label="Buscar postulaciones"
              />
            </div>

            {/* Filtro por estado */}
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

            {/* Toggle de vista */}
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

            {/* Resultado count */}
            <span className="results-count">
              {postulacionesFiltradas.length} resultado{postulacionesFiltradas.length !== 1 ? 's' : ''}
            </span>

            {/* Botón nueva postulación */}
            <button
              id="btn-nueva-postulacion"
              className="btn btn--primary"
              onClick={() => setModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva postulación
            </button>
          </div>

          {/* ── Vista Kanban ──────────────────────────────────────── */}
          {vista === 'kanban' && (
            <section className="kanban-view" aria-label="Vista kanban de postulaciones">
              {ESTADOS.map(estado => {
                const items = postulacionesFiltradas.filter(p => p.estado === estado);
                const dotClass = KANBAN_COL_STYLES[estado];
                return (
                  <div key={estado} className="kanban-col"
                    id={`col-${dotClass}`}>
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
                          <JobCard
                            key={p.id}
                            postulacion={p}
                            onEliminar={eliminarPostulacion}
                            delay={i * 50}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ── Vista Lista ───────────────────────────────────────── */}
          {vista === 'lista' && (
            <section className="list-view" aria-label="Vista lista de postulaciones"
              role="table" id="tabla-postulaciones">
              {postulacionesFiltradas.length === 0 ? (
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
                postulacionesFiltradas.map((p, i) => (
                  <ListItemPostulacion
                    key={p.id}
                    postulacion={p}
                    onEliminar={eliminarPostulacion}
                    delay={i * 40}
                  />
                ))
              )}
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="proto-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-text-light)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="proto-footer__text">
            Prototipo académico – datos de demostración · JOBTRACK v0.1 · UPN Chorrillos 2026
          </span>
        </footer>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalNuevaPostulacion
          onGuardar={handleGuardar}
          onCerrar={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
