import React, { useState } from 'react';
import { validarCredenciales, crearSesion } from '../utils/storage';
import '../styles/login.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    // Simular latencia de red
    await new Promise(r => setTimeout(r, 900));

    if (validarCredenciales(email, password)) {
      crearSesion();
      onLogin();
    } else {
      setError('Correo o contraseña incorrectos. Revisa las credenciales demo.');
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('n00329808@upn.pe');
    setPassword('jobtrack-demo');
    setError('');
  };

  return (
    <div className="login-root">
      <div className="login-bg-decoration" />

      {/* Panel de branding */}
      <div className="login-branding">
        <div className="login-branding__logo">
          <div className="login-branding__logo-icon">JT</div>
          <span className="login-branding__logo-text">
            JOB<span>TRACK</span>
          </span>
        </div>

        <h1 className="login-branding__headline">
          Gestiona tus<br />
          <em>postulaciones</em><br />
          con inteligencia
        </h1>

        <p className="login-branding__sub">
          Plataforma de seguimiento de postulaciones laborales para
          estudiantes de últimos ciclos y egresados recientes de la
          Universidad Privada del Norte – Sede Chorrillos.
        </p>

        <div className="login-features">
          {[
            ['📋', 'Registra y organiza todas tus postulaciones'],
            ['📊', 'Visualiza métricas de tu búsqueda laboral'],
            ['🔔', 'Gestiona próximas acciones y entrevistas'],
            ['🎯', 'Filtra por empresa, cargo o estado'],
          ].map(([icon, text]) => (
            <div key={text} className="login-feature-item">
              <div className="login-feature-item__icon">{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de formulario */}
      <div className="login-form-panel">
        <div className="login-form-header">
          <div
            className="login-branding__logo"
            style={{ marginBottom: 20, display: 'flex' }}
          >
            <div
              className="login-branding__logo-icon"
              style={{ width: 36, height: 36, fontSize: '0.9rem' }}
            >
              JT
            </div>
            <span
              className="login-branding__logo-text"
              style={{ fontSize: '1.3rem', color: 'var(--color-primary)' }}
            >
              JOB<span style={{ color: 'var(--color-accent-dark)' }}>TRACK</span>
            </span>
          </div>
          <h2 className="login-form-header__title">Iniciar sesión</h2>
          <p className="login-form-header__sub">
            Ingresa con tus credenciales UPN para acceder al sistema.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="input-group">
            <label htmlFor="login-email">
              Correo institucional
              <span className="input-required"> *</span>
            </label>
            <div className="login-input-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="login-email"
                type="email"
                className={`form-control${error ? ' form-control--error' : ''}`}
                placeholder="n00000000@upn.pe"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <label htmlFor="login-password">
              Contraseña
              <span className="input-required"> *</span>
            </label>
            <div className="login-input-icon-wrap" style={{ position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className={`form-control${error ? ' form-control--error' : ''}`}
                placeholder="••••••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="login-form__forgot">
              <a href="#" onClick={e => e.preventDefault()}>¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Botón submit */}
          <button
            id="btn-login-submit"
            type="submit"
            className="btn btn--primary login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Verificando credenciales...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Ingresar al sistema
              </>
            )}
          </button>
        </form>

        {/* Hint de credenciales */}
        <div className="login-credentials-hint">
          <div className="login-credentials-hint__title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Credenciales de demostración
          </div>
          <div className="login-credentials-hint__row">
            <span>Correo:</span>
            <span className="login-credentials-hint__val">n00329808@upn.pe</span>
          </div>
          <div className="login-credentials-hint__row">
            <span>Contraseña:</span>
            <span className="login-credentials-hint__val">jobtrack-demo</span>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            style={{
              marginTop: 10, fontSize: '0.78rem', color: 'var(--color-primary-light)',
              background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            ↗ Autocompletar credenciales demo
          </button>
        </div>

        <div className="login-proto-badge">
          Prototipo académico – datos de demostración · UPN Chorrillos 2026
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
