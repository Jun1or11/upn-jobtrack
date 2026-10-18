import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { obtenerSesion, cerrarSesion } from './utils/storage';
import { api } from './utils/api';
import type { SesionAuth, Usuario } from './types';
import './styles/global.css';

type AppView = 'login' | 'dashboard';

const App: React.FC = () => {
  const [view, setView]     = useState<AppView>('login');
  const [sesion, setSesion] = useState<SesionAuth | null>(null);
  const [checking, setChecking] = useState(true);

  // Verificar sesión al montar
  useEffect(() => {
    let active = true;
    const s = obtenerSesion();
    if (s) {
      api<Usuario>('/auth/me').then(usuario => {
        if (active) { setSesion({ ...s, usuario }); setView('dashboard'); }
      }).catch(() => { /* El cliente API informa sesiones vencidas. */ })
        .finally(() => { if (active) setChecking(false); });
    } else {
      setChecking(false);
    }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const reset = () => { setSesion(null); setView('login'); };
    window.addEventListener('jobtrack:logout', reset);
    const sync = (e: StorageEvent) => { if (e.key === 'jobtrack_session' && !obtenerSesion()) reset(); };
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('jobtrack:logout', reset); window.removeEventListener('storage', sync); };
  }, []);

  useEffect(() => {
    if (!sesion) return;
    const timer = window.setTimeout(cerrarSesion, Math.max(0, sesion.expiraEn - Date.now()));
    return () => window.clearTimeout(timer);
  }, [sesion]);

  const handleLogin = () => {
    const s = obtenerSesion();
    if (s) {
      setSesion(s);
      setView('dashboard');
    }
  };

  const handleLogout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); }
    finally { cerrarSesion(); }
  };

  // Splash screen mientras verifica sesión
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-dark)',
        flexDirection: 'column',
        gap: 20,
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          width: 60, height: 60,
          background: 'var(--color-accent)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 800,
          color: 'var(--color-primary-dark)',
          animation: 'pulse 1.5s ease infinite',
          boxShadow: '0 0 30px rgba(245,197,24,0.5)',
        }}>
          JT
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
          Cargando JOBTRACK...
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  if (view === 'dashboard' && sesion) {
    return <DashboardPage sesion={sesion} onLogout={handleLogout} />;
  }

  return <LoginPage onLogin={handleLogin} />;
};

export default App;
