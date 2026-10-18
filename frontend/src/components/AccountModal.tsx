import { useState } from 'react';
import { api, register } from '../utils/api';
import { cerrarSesion } from '../utils/storage';

interface Props {
  mode: 'register' | 'recover' | 'delete';
  onClose: () => void;
  onLogin?: () => void;
}

export default function AccountModal({ mode, onClose, onLogin }: Props) {
  const [form, setForm] = useState({ email: '', nombre: '', ciclo: '', carrera: '', password: '', confirm: '', token: '' });
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const update = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const needsEmail = mode === 'register' || (mode === 'recover' && step === 'email');
  const needsPassword = mode !== 'recover' || step === 'reset';
  const title = mode === 'register' ? 'Crear cuenta' : mode === 'delete' ? 'Eliminar cuenta' : 'Recuperar contraseña';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setMessage('');
    if (needsEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError('Ingresa un correo válido.'); return; }
    if (needsPassword && (!form.password || form.password.length > 72 || !/^[\x20-\x7E]+$/.test(form.password))) {
      setError('Usa una contraseña de hasta 72 caracteres ASCII imprimibles.'); return;
    }
    if (needsPassword && mode !== 'delete' && (form.password.length < 8 || form.password !== form.confirm)) {
      setError('La contraseña debe tener al menos 8 caracteres y coincidir con su confirmación.'); return;
    }
    if (mode === 'register' && (form.nombre.trim().length < 2 || !form.ciclo.trim() || form.carrera.trim().length < 2)) {
      setError('Completa nombre, ciclo y carrera.'); return;
    }
    if (mode === 'recover' && step === 'reset' && !/^[a-f0-9]{64}$/.test(form.token)) {
      setError('Ingresa el token de recuperación de 64 caracteres.'); return;
    }
    setBusy(true);
    try {
      if (mode === 'register') {
        await register({ email: form.email.trim().toLowerCase(), nombre: form.nombre.trim(), ciclo: form.ciclo.trim(), carrera: form.carrera.trim(), password: form.password });
        onLogin?.(); onClose();
      } else if (mode === 'delete') {
        await api('/auth/account', { method: 'DELETE', body: JSON.stringify({ password: form.password }) });
        cerrarSesion(); onClose();
      } else if (step === 'email') {
        const result = await api<{ message: string; demoToken: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: form.email.trim().toLowerCase() }) }, false);
        update('token', result.demoToken); setStep('reset'); setMessage(result.message);
      } else {
        const result = await api<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: form.token, password: form.password }) }, false);
        setMessage(result.message); setStep('email'); setForm(prev => ({ ...prev, password: '', confirm: '', token: '' }));
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo completar la operación.'); }
    finally { setBusy(false); }
  };

  const field = (key: keyof typeof form, label: string, maxLength: number, type = 'text') => (
    <div className="input-group" key={key}>
      <label htmlFor={`account-${key}`}>{label}</label>
      <input id={`account-${key}`} className="form-control" type={type} maxLength={maxLength}
        value={form[key]} onChange={e => update(key, e.target.value)} required
        autoComplete={key === 'password' ? mode === 'delete' ? 'current-password' : 'new-password' : key === 'email' ? 'email' : 'off'} />
    </div>
  );

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="account-title"
      onClick={e => { if (!busy && e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal__header">
          <h2 id="account-title" className="modal__title">{title}</h2>
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy} aria-label="Cerrar">×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <fieldset className="modal__body account-fields" disabled={busy}>
            {mode === 'delete' && <p>Confirma con tu contraseña. Se eliminarán tu cuenta y todas tus postulaciones de forma permanente.</p>}
            {mode === 'recover' && <p>Recuperación académica: el token se muestra aquí, no se envía un correo. Vence en 15 minutos.</p>}
            {needsEmail && field('email', 'Correo', 254, 'email')}
            {mode === 'register' && <>
              {field('nombre', 'Nombre completo', 80)}
              {field('ciclo', 'Ciclo', 40)}
              {field('carrera', 'Carrera', 100)}
            </>}
            {mode === 'recover' && step === 'reset' && field('token', 'Token demo de recuperación', 64)}
            {needsPassword && field('password', mode === 'delete' ? 'Contraseña actual' : 'Contraseña (8–72 caracteres ASCII)', 72, 'password')}
            {needsPassword && mode !== 'delete' && field('confirm', 'Confirmar contraseña', 72, 'password')}
            {error && <p className="login-error" role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
          </fieldset>
          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={busy}>Cancelar</button>
            <button type="submit" className={`btn ${mode === 'delete' ? 'btn--danger' : 'btn--primary'}`} disabled={busy}>
              {busy ? 'Procesando...' : mode === 'recover' ? step === 'email' ? 'Obtener token demo' : 'Actualizar contraseña' : title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
