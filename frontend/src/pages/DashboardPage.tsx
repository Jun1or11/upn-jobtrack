import React, { useEffect, useState } from 'react';
import type { EstadoPostulacion, Postulacion, SesionAuth, VistaDashboard } from '../types';
import AccountModal from '../components/AccountModal';
import { usePostulaciones } from '../hooks/usePostulaciones';
import Sidebar from '../components/Sidebar';
import ModalNuevaPostulacion from '../components/ModalNuevaPostulacion';
import ConfirmDialog from '../components/ConfirmDialog';
import DashboardHome from './DashboardHome';
import PostulacionesPage from './PostulacionesPage';
import EntrevistasPage from './EntrevistasPage';
import EmpresasPage from './EmpresasPage';
import CalendarioPage from './CalendarioPage';
import EstadisticasPage from './EstadisticasPage';
import PerfilPage from './PerfilPage';
import ConfiguracionPage from './ConfiguracionPage';
import '../styles/dashboard.css';
import '../styles/modules.css';

interface DashboardPageProps {
  sesion: SesionAuth;
  onLogout: () => Promise<void>;
  onSesionChange: (sesion: SesionAuth) => void;
}

const VISTAS: VistaDashboard[] = [
  'dashboard', 'postulaciones', 'entrevistas', 'empresas', 'calendario',
  'estadisticas', 'perfil', 'configuracion',
];

const TITULOS: Record<VistaDashboard, { titulo: string; subtitulo: string }> = {
  dashboard: { titulo: 'Dashboard de Postulaciones', subtitulo: 'Resumen de tu búsqueda laboral' },
  postulaciones: { titulo: 'Postulaciones', subtitulo: 'Gestiona todas tus oportunidades' },
  entrevistas: { titulo: 'Entrevistas', subtitulo: 'Procesos en etapa de entrevista' },
  empresas: { titulo: 'Empresas', subtitulo: 'Resumen de empresas contactadas' },
  calendario: { titulo: 'Calendario', subtitulo: 'Fechas y próximas acciones' },
  estadisticas: { titulo: 'Estadísticas', subtitulo: 'Análisis de tu embudo de postulación' },
  perfil: { titulo: 'Mi perfil', subtitulo: 'Información de tu cuenta' },
  configuracion: { titulo: 'Configuración', subtitulo: 'Seguridad y datos de la cuenta' },
};

const leerVista = (): VistaDashboard => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return VISTAS.includes(hash as VistaDashboard) ? hash as VistaDashboard : 'dashboard';
};

const DashboardPage: React.FC<DashboardPageProps> = ({ sesion, onLogout, onSesionChange }) => {
  const {
    postulaciones, metricas, cargando, error, recargar,
    agregarPostulacion, editarPostulacion, eliminarPostulacion, actualizarEstado,
  } = usePostulaciones();

  const [vista, setVista] = useState<VistaDashboard>(leerVista);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editando, setEditando] = useState<Postulacion | null>(null);
  const [porEliminar, setPorEliminar] = useState<Postulacion | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const onHashChange = () => setVista(leerVista());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navegar = (destino: VistaDashboard) => {
    setVista(destino);
    window.location.hash = `/${destino}`;
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirNueva = () => {
    setEditando(null);
    setModalOpen(true);
  };

  const abrirEdicion = (p: Postulacion) => {
    setEditando(p);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
  };

  const handleGuardar = async (datos: Omit<Postulacion, 'id' | 'createdAt'>) => {
    if (editando) {
      await editarPostulacion(editando.id, datos);
    } else {
      await agregarPostulacion(datos);
    }
    cerrarModal();
  };

  const solicitarEliminar = (id: string) => {
    const objetivo = postulaciones.find(p => p.id === id) ?? null;
    setPorEliminar(objetivo);
  };

  const confirmarEliminar = async () => {
    if (!porEliminar || deleting) return;
    setDeleting(true); setActionError('');
    try { await eliminarPostulacion(porEliminar.id); setPorEliminar(null); }
    catch (e) { setActionError(e instanceof Error ? e.message : 'No se pudo eliminar.'); throw e; }
    finally { setDeleting(false); }
  };

  const cambiarEstado = (id: string, estado: EstadoPostulacion) => {
    setActionError('');
    void actualizarEstado(id, estado)
      .catch(e => setActionError(e instanceof Error ? e.message : 'No se pudo cambiar el estado.'));
  };

  const handleLogout = () => {
    void onLogout().catch(() => { /* App limpia la sesión local en finally. */ });
  };

  const { titulo, subtitulo } = TITULOS[vista];
  const primerNombre = sesion.usuario.nombre.split(' ')[0];

  const renderVista = () => {
    switch (vista) {
      case 'postulaciones':
        return (
          <PostulacionesPage
            postulaciones={postulaciones}
            onNueva={abrirNueva}
            onEditar={abrirEdicion}
            onEliminar={solicitarEliminar}
            onCambiarEstado={cambiarEstado}
          />
        );
      case 'entrevistas':
        return (
          <EntrevistasPage
            postulaciones={postulaciones}
            onEditar={abrirEdicion}
            onCambiarEstado={cambiarEstado}
          />
        );
      case 'empresas':
        return <EmpresasPage postulaciones={postulaciones} onNavegar={navegar} />;
      case 'calendario':
        return <CalendarioPage postulaciones={postulaciones} onEditar={abrirEdicion} />;
      case 'estadisticas':
        return <EstadisticasPage postulaciones={postulaciones} />;
      case 'perfil':
        return (
          <PerfilPage
            sesion={sesion}
            postulaciones={postulaciones}
            onSesionChange={onSesionChange}
          />
        );
      case 'configuracion':
        return (
          <ConfiguracionPage
            sesion={sesion}
            postulaciones={postulaciones}
            onSesionChange={onSesionChange}
            onDeleteAccount={() => setAccountOpen(true)}
          />
        );
      default:
        return (
          <DashboardHome
            metricas={metricas}
            postulaciones={postulaciones}
            onNavegar={navegar}
            onNueva={abrirNueva}
          />
        );
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar
        sesion={sesion}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onDeleteAccount={() => setAccountOpen(true)}
        vistaActual={vista}
        onNavegar={navegar}
      />

      <div className="main-content">
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
              <div className="header__title">{titulo}</div>
              <div className="header__subtitle">{subtitulo}</div>
            </div>
          </div>
          <div className="header__right">
            <span className="header__proto-badge">PostgreSQL · JWT</span>
            <div className="header__user-chip">
              <div className="header__user-dot" />
              {primerNombre}
            </div>
          </div>
        </header>

        <main className="page-body" id="main-dashboard">
          {cargando && <p className="loading-line" role="status">Cargando postulaciones...</p>}
          {(error || actionError) && (
            <div className="login-error" role="alert">
              {error || actionError}
              {error && (
                <button className="btn btn--secondary btn--sm" onClick={() => void recargar()}>
                  Reintentar
                </button>
              )}
            </div>
          )}
          {renderVista()}
        </main>

        <footer className="proto-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-text-light)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="proto-footer__text">
            JOBTRACK v0.3 · Datos persistentes en PostgreSQL · UPN Chorrillos 2026
          </span>
        </footer>
      </div>

      {accountOpen && <AccountModal mode="delete" onClose={() => setAccountOpen(false)} />}
      {modalOpen && (
        <ModalNuevaPostulacion
          key={editando?.id ?? 'nueva'}
          postulacion={editando ?? undefined}
          onGuardar={handleGuardar}
          onCerrar={cerrarModal}
        />
      )}

      {porEliminar && (
        <ConfirmDialog
          titulo="Eliminar postulación"
          mensaje={`¿Seguro que deseas eliminar "${porEliminar.cargo}" en ${porEliminar.empresa}? Esta acción no se puede deshacer.`}
          textoConfirmar="Eliminar postulación"
          onConfirmar={confirmarEliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
