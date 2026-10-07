import React, { useState } from 'react';
import type { Postulacion, EstadoPostulacion } from '../types';
import { generarId } from '../utils/storage';

interface ModalNuevaPostulacionProps {
  onGuardar: (p: Omit<Postulacion, 'id' | 'createdAt'>) => void;
  onCerrar: () => void;
}

const ESTADOS: EstadoPostulacion[] = ['Por postular', 'Postulado', 'Entrevista', 'Oferta'];
const FUENTES = ['LinkedIn', 'Computrabajo', 'Indeed', 'Bumeran', 'Bolsa UPN', 'Referido', 'Web empresa', 'Otro'];

const initialForm: Omit<Postulacion, 'id' | 'createdAt'> = {
  empresa: '',
  cargo: '',
  fuente: 'LinkedIn',
  fecha: new Date().toISOString().slice(0, 10),
  estado: 'Por postular',
  proximaAccion: '',
  nota: '',
};

const ModalNuevaPostulacion: React.FC<ModalNuevaPostulacionProps> = ({ onGuardar, onCerrar }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialForm, string>>>({});
  const [saving, setSaving] = useState(false);

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.empresa.trim()) newErrors.empresa = 'La empresa es requerida.';
    if (!form.cargo.trim())   newErrors.cargo   = 'El cargo es requerido.';
    if (!form.fecha)          newErrors.fecha   = 'La fecha es requerida.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    onGuardar(form);
  };

  // Cerrar con Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCerrar]);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={e => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: 'rgba(26,58,107,0.1)',
              borderRadius: 'var(--radius-md)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-primary)" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <h2 id="modal-title" className="modal__title">Nueva postulación</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Registra una nueva oportunidad laboral
              </p>
            </div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onCerrar}
            id="btn-modal-cerrar" aria-label="Cerrar modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="form-grid">
              {/* Empresa */}
              <div className="input-group">
                <label htmlFor="nv-empresa">
                  Empresa <span className="input-required">*</span>
                </label>
                <input id="nv-empresa" type="text"
                  className={`form-control${errors.empresa ? ' form-control--error' : ''}`}
                  placeholder="Ej: BCP, Interbank, Alicorp..."
                  value={form.empresa}
                  onChange={e => update('empresa', e.target.value)}
                  disabled={saving}
                />
                {errors.empresa && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-error)' }}>
                    {errors.empresa}
                  </span>
                )}
              </div>

              {/* Cargo */}
              <div className="input-group">
                <label htmlFor="nv-cargo">
                  Cargo <span className="input-required">*</span>
                </label>
                <input id="nv-cargo" type="text"
                  className={`form-control${errors.cargo ? ' form-control--error' : ''}`}
                  placeholder="Ej: Analista de Datos Jr."
                  value={form.cargo}
                  onChange={e => update('cargo', e.target.value)}
                  disabled={saving}
                />
                {errors.cargo && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-error)' }}>
                    {errors.cargo}
                  </span>
                )}
              </div>

              {/* Fuente */}
              <div className="input-group">
                <label htmlFor="nv-fuente">Fuente</label>
                <select id="nv-fuente" className="form-control filter-select"
                  value={form.fuente} onChange={e => update('fuente', e.target.value)}
                  disabled={saving} style={{ width: '100%' }}>
                  {FUENTES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Fecha */}
              <div className="input-group">
                <label htmlFor="nv-fecha">
                  Fecha <span className="input-required">*</span>
                </label>
                <input id="nv-fecha" type="date"
                  className={`form-control${errors.fecha ? ' form-control--error' : ''}`}
                  value={form.fecha}
                  onChange={e => update('fecha', e.target.value)}
                  disabled={saving}
                />
                {errors.fecha && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-error)' }}>
                    {errors.fecha}
                  </span>
                )}
              </div>

              {/* Estado */}
              <div className="input-group span-2">
                <label htmlFor="nv-estado">Estado actual</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ESTADOS.map(est => (
                    <button key={est} type="button"
                      id={`nv-estado-${est.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => update('estado', est)}
                      disabled={saving}
                      style={{
                        padding: '7px 14px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem', fontWeight: 600,
                        border: '1.5px solid',
                        transition: 'all 0.18s ease',
                        cursor: 'pointer',
                        background: form.estado === est ? 'var(--color-primary)' : 'transparent',
                        color: form.estado === est ? '#fff' : 'var(--color-text-muted)',
                        borderColor: form.estado === est ? 'var(--color-primary)' : 'var(--color-border)',
                      }}>
                      {est}
                    </button>
                  ))}
                </div>
              </div>

              {/* Próxima acción */}
              <div className="input-group span-2">
                <label htmlFor="nv-prox-accion">Próxima acción</label>
                <input id="nv-prox-accion" type="text"
                  className="form-control"
                  placeholder="Ej: Completar prueba técnica el 25/09"
                  value={form.proximaAccion}
                  onChange={e => update('proximaAccion', e.target.value)}
                  disabled={saving}
                />
              </div>

              {/* Nota */}
              <div className="input-group span-2">
                <label htmlFor="nv-nota">Nota breve</label>
                <textarea id="nv-nota"
                  className="form-control"
                  placeholder="Observaciones sobre el proceso, salario, modalidad, etc."
                  value={form.nota}
                  onChange={e => update('nota', e.target.value)}
                  rows={3}
                  disabled={saving}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal__footer">
            <button type="button" id="btn-modal-cancelar"
              className="btn btn--secondary" onClick={onCerrar} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" id="btn-modal-guardar"
              className="btn btn--primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'var(--color-primary-dark)' }} />
                  Guardando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Guardar postulación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaPostulacion;
