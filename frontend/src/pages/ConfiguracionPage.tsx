import React, { useState } from 'react';
import type { Postulacion, SesionAuth } from '../types';
import { authApi } from '../utils/api';
import { hoyISO } from '../utils/fechas';

interface ConfiguracionPageProps {
  sesion: SesionAuth;
  postulaciones: Postulacion[];
  onSesionChange: (sesion: SesionAuth) => void;
  onDeleteAccount: () => void;
}

const ConfiguracionPage: React.FC<ConfiguracionPageProps> = ({
  sesion, postulaciones, onSesionChange, onDeleteAccount,
}) => {
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const actualizar = (campo: keyof typeof form, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setError(''); setOk('');
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setOk('');
    if (!form.actual) { setError('Ingresa tu contraseña actual.'); return; }
    if (form.nueva.length < 8 || form.nueva.length > 72) {
      setError('La nueva contraseña debe tener entre 8 y 72 caracteres.');
      return;
    }
    if (form.nueva !== form.confirmar) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }
    if (form.nueva === form.actual) {
      setError('La nueva contraseña debe ser diferente a la actual.');
      return;
    }
    setSaving(true);
    try {
      const nuevaSesion = await authApi.changePassword(form.actual, form.nueva);
      onSesionChange(nuevaSesion);
      setForm({ actual: '', nueva: '', confirmar: '' });
      setOk('Contraseña actualizada. Las demás sesiones fueron revocadas.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar la contraseña.');
    } finally {
      setSaving(false);
    }
  };

  const exportarCSV = () => {
    const cabeceras = ['Empresa', 'Cargo', 'Fuente', 'Fecha', 'Estado', 'Próxima acción', 'Fecha próxima acción', 'Nota'];
    const escapar = (valor: string | null | undefined) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
    const filas = postulaciones.map(p => [
      p.empresa, p.cargo, p.fuente, p.fecha, p.estado, p.proximaAccion, p.fechaProximaAccion ?? '', p.nota,
    ].map(escapar).join(';'));
    const contenido = `\uFEFF${cabeceras.join(';')}\n${filas.join('\n')}`;
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `jobtrack-postulaciones-${hoyISO()}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setOk('Archivo CSV generado con tus postulaciones.');
  };

  return (
    <>
      <section className="module-intro">
        <div>
          <h2 className="module-intro__title">Configuración</h2>
          <p className="module-intro__sub">
            Seguridad, datos y opciones de tu cuenta.
          </p>
        </div>
      </section>

      <div className="settings-grid">
        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Cambiar contraseña</h3>
          </div>
          <form className="settings-form" onSubmit={cambiarPassword} noValidate>
            {error && <p className="login-error" role="alert">{error}</p>}
            {ok && <p className="form-success" role="status">{ok}</p>}

            <div className="input-group">
              <label htmlFor="pass-actual">Contraseña actual</label>
              <input id="pass-actual" type="password" className="form-control"
                autoComplete="current-password" value={form.actual}
                onChange={e => actualizar('actual', e.target.value)} disabled={saving} />
            </div>
            <div className="input-group">
              <label htmlFor="pass-nueva">Nueva contraseña</label>
              <input id="pass-nueva" type="password" className="form-control"
                autoComplete="new-password" maxLength={72} value={form.nueva}
                onChange={e => actualizar('nueva', e.target.value)} disabled={saving} />
              <span className="form-hint">Entre 8 y 72 caracteres ASCII imprimibles.</span>
            </div>
            <div className="input-group">
              <label htmlFor="pass-confirmar">Confirmar nueva contraseña</label>
              <input id="pass-confirmar" type="password" className="form-control"
                autoComplete="new-password" maxLength={72} value={form.confirmar}
                onChange={e => actualizar('confirmar', e.target.value)} disabled={saving} />
            </div>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </section>

        <div className="settings-column">
          <section className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Sesión y cuenta</h3>
            </div>
            <div className="settings-list">
              <div className="settings-row">
                <span>Correo</span>
                <strong>{sesion.usuario.email}</strong>
              </div>
              <div className="settings-row">
                <span>Ciclo</span>
                <strong>{sesion.usuario.ciclo}</strong>
              </div>
              <div className="settings-row">
                <span>Sesión válida hasta</span>
                <strong>{new Date(sesion.expiraEn).toLocaleString('es-PE')}</strong>
              </div>
              <div className="settings-row">
                <span>Almacenamiento</span>
                <strong>PostgreSQL · JWT</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Mis datos</h3>
            </div>
            <p className="settings-description">
              Descarga un archivo CSV con todas tus postulaciones para respaldarlas o analizarlas
              en Excel.
            </p>
            <button className="btn btn--secondary" onClick={exportarCSV}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exportar {postulaciones.length} postulación{postulaciones.length !== 1 ? 'es' : ''}
            </button>
          </section>

          <section className="panel panel--danger">
            <div className="panel__header">
              <h3 className="panel__title">Zona de peligro</h3>
            </div>
            <p className="settings-description">
              Eliminar tu cuenta borra permanentemente tu perfil y todas tus postulaciones.
              Esta acción no se puede deshacer.
            </p>
            <button className="btn btn--danger" onClick={onDeleteAccount}>
              Eliminar mi cuenta
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default ConfiguracionPage;
