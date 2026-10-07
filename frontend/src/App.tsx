import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { haySession, obtenerSesion, cerrarSesion } from './utils/storage';
import type { SesionAuth } from './types';
import './styles/global.css';

type AppView = 'login' | 'dashboard';

const App: React.FC = () => {
  const [view, setView]     = useState<AppView>('login');
  const [sesion, setSesion] = useState<SesionAuth | null>(null);
  const [checking, setChecking] = useState(true);

  // Verificar sesión al montar
  useEffect(() => {
    const s = obtenerSesion();
    if (s) {
      setSesion(s);
      setView('dashboard');
    }
    setChecking(false);
  }, []);

  const handleLogin = () => {
    const s = obtenerSesion();
    if (s) {
      setSesion(s);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    setSesion(null);
    setView('login');
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
