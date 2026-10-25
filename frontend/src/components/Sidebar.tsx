import React from 'react';
import type { SesionAuth, VistaDashboard } from '../types';

interface SidebarProps {
  sesion: SesionAuth;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  onDeleteAccount: () => void;
  vistaActual: VistaDashboard;
  onNavegar: (vista: VistaDashboard) => void;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  vista: VistaDashboard;
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sesion, onLogout, isOpen, onClose, onDeleteAccount, vistaActual, onNavegar,
}) => {
  const { usuario } = sesion;
  const initials = usuario.nombre
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navItems: NavItem[] = [
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      vista: 'dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      id: 'nav-postulaciones',
      label: 'Postulaciones',
      vista: 'postulaciones',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      id: 'nav-entrevistas',
      label: 'Entrevistas',
      vista: 'entrevistas',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      id: 'nav-empresas',
      label: 'Empresas',
      vista: 'empresas',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'nav-calendario',
      label: 'Calendario',
      vista: 'calendario',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ];

  const analysisItems: NavItem[] = [
    {
      id: 'nav-estadisticas',
      label: 'Estadísticas',
      vista: 'estadisticas',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
  ];

  const accountItems: NavItem[] = [
    {
      id: 'nav-perfil',
      label: 'Mi perfil',
      vista: 'perfil',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      id: 'nav-configuracion',
      label: 'Configuración',
      vista: 'configuracion',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
  ];

  const renderItems = (items: NavItem[]) => items.map(item => (
    <button
      key={item.id}
      id={item.id}
      className={`sidebar__nav-item${vistaActual === item.vista ? ' active' : ''}`}
      onClick={() => { onNavegar(item.vista); onClose(); }}
      aria-current={vistaActual === item.vista ? 'page' : undefined}
    >
      {item.icon}
      {item.label}
      {item.badge && (
        <span className="sidebar__nav-badge">{item.badge}</span>
      )}
    </button>
  ));

  return (
    <>
      <div
        className={`sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav className={`sidebar${isOpen ? ' open' : ''}`} role="navigation"
        aria-label="Menú principal">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">JT</div>
          <span className="sidebar__logo-text">
            JOB<span>TRACK</span>
          </span>
        </div>

        <div className="sidebar__user-card">
          <div className="sidebar__user-avatar">{initials}</div>
          <div className="sidebar__user-name">{usuario.nombre}</div>
          <div className="sidebar__user-info">
            {usuario.ciclo} · {usuario.carrera}<br />
            <span style={{ fontSize: '0.7rem' }}>{usuario.email}</span>
          </div>
        </div>

        <div className="sidebar__nav">
          <div className="sidebar__nav-label">Principal</div>
          {renderItems(navItems)}

          <div className="sidebar__nav-label" style={{ marginTop: 8 }}>Análisis</div>
          {renderItems(analysisItems)}

          <div className="sidebar__nav-label" style={{ marginTop: 8 }}>Cuenta</div>
          {renderItems(accountItems)}
        </div>

        <div className="sidebar__footer">
          <button type="button" className="sidebar__logout-btn" onClick={onDeleteAccount}>
            Eliminar mi cuenta
          </button>
          <div className="sidebar__footer-note">
            JOBTRACK · UPN Chorrillos 2026
          </div>
          <button
            id="btn-cerrar-sesion"
            className="sidebar__logout-btn"
            onClick={onLogout}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
