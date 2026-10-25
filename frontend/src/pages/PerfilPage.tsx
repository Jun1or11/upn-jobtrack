import React, { useState } from 'react';
import type { Postulacion, SesionAuth } from '../types';
import { authApi } from '../utils/api';
import { ESTADOS, ESTADO_CONFIG } from '../constants/postulaciones';

interface PerfilPageProps {
  sesion: SesionAuth;
  postulaciones: Postulacion[];
  onSesionChange: (sesion: SesionAuth) => void;
}

const PerfilPage: React.FC<PerfilPageProps> = ({ sesion, postulaciones, onSesionChange }) => {
  const [form, setForm] = useState({
    nombre: sesion.usuario.nombre,
    ciclo: sesion.usuario.ciclo,
    carrera: sesion.usuario.carrera,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const iniciales = form.nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(parte => parte[0])
    .join('')
    .toUpperCase();

  const actualizar = (campo: keyof typeof form, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setOk('');
    setError('');
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setOk('');
    if (form.nombre.trim().length < 2 || !form.ciclo.trim() || form.carrera.trim().length < 2) {
      setError('Completa nombre, ciclo y carrera correctamente.');
      return;
    }
    setSaving(true);
    try {
      const usuario = await authApi.updateProfile({
        nombre: form.nombre.trim(),
        ciclo: form.ciclo.trim(),
        carrera: form.carrera.trim(),
      });
      onSesionChange({ ...sesion, usuario });
      setOk('Perfil actualizado correctamente.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="module-intro">
        <div>
          <h2 className="module-intro__title">Mi perfil</h2>
          <p className="module-intro__sub">
            Administra la información académica que aparece en tu cuenta.
          </p>
        </div>
      </section>

      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-card__avatar">{iniciales || 'JT'}</div>
          <h3 className="profile-card__name">{form.nombre}</h3>
          <p className="profile-card__carrera">{form.carrera}</p>
          <p className="profile-card__ciclo">{form.ciclo}</p>
          <p className="profile-card__email">{sesion.usuario.email}</p>
          <div className="profile-card__divider" />
          <div className="profile-card__stats">
            <div>
              <strong>{postulaciones.length}</strong>
              <span>Postulaciones</span>
            </div>
            <div>
              <strong>{postulaciones.filter(p => p.estado === 'Entrevista').length}</strong>
              <span>Entrevistas</span>
            </div>
            <div>
              <strong>{postulaciones.filter(p => p.estado === 'Oferta').length}</strong>
              <span>Ofertas</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Datos personales</h3>
          </div>
          <form className="profile-form" onSubmit={guardar} noValidate>
            {error && <p className="login-error" role="alert">{error}</p>}
            {ok && <p className="form-success" role="status">{ok}</p>}

            <div className="input-group">
              <label htmlFor="perfil-nombre">Nombre completo</label>
              <input id="perfil-nombre" className="form-control" value={form.nombre}
                maxLength={80} onChange={e => actualizar('nombre', e.target.value)}
                disabled={saving} />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="perfil-ciclo">Ciclo</label>
                <input id="perfil-ciclo" className="form-control" value={form.ciclo}
                  maxLength={40} onChange={e => actualizar('ciclo', e.target.value)}
                  disabled={saving} />
              </div>
              <div className="input-group">
                <label htmlFor="perfil-carrera">Carrera</label>
                <input id="perfil-carrera" className="form-control" value={form.carrera}
                  maxLength={100} onChange={e => actualizar('carrera', e.target.value)}
                  disabled={saving} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="perfil-email">Correo institucional</label>
              <input id="perfil-email" className="form-control" value={sesion.usuario.email}
                disabled readOnly />
              <span className="form-hint">
                El correo identifica tu cuenta y no se puede cambiar desde aquí.
              </span>
            </div>

            <div className="profile-form__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel panel--full">
          <div className="panel__header">
            <h3 className="panel__title">Resumen por estado</h3>
          </div>
          <div className="profile-states">
            {ESTADOS.map(estado => (
              <div key={estado} className="profile-states__item">
                <span className={`badge ${ESTADO_CONFIG[estado].clase}`}>
                  {ESTADO_CONFIG[estado].emoji} {estado}
                </span>
                <strong>{postulaciones.filter(p => p.estado === estado).length}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default PerfilPage;
