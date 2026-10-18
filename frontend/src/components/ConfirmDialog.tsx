import React, { useState } from 'react';

interface ConfirmDialogProps {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void | Promise<void>;
  onCancelar: () => void;
}

/**
 * Diálogo de confirmación reutilizable.
 * Reutiliza las clases globales `.overlay` y `.modal` para mantener
 * el mismo lenguaje visual del sistema (sin introducir un diseño nuevo).
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const confirm = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try { await onConfirmar(); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo eliminar.'); }
    finally { setBusy(false); }
  };
  // Cerrar con Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !busy) onCancelar(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancelar, busy]);

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onClick={e => { if (!busy && e.target === e.currentTarget) onCancelar(); }}
    >
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: 'var(--color-error-bg)',
              borderRadius: 'var(--radius-md)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-error)" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2 id="confirm-title" className="modal__title">{titulo}</h2>
          </div>
        </div>

        <div className="modal__body" style={{ paddingTop: 16, paddingBottom: 8 }}>
          {error && <p className="login-error" role="alert">{error}</p>}
          <p id="confirm-message" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            {mensaje}
          </p>
        </div>

        <div className="modal__footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancelar}
            disabled={busy}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => void confirm()}
            disabled={busy}
            id="btn-confirmar-eliminar"
            autoFocus
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            {busy ? 'Eliminando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
