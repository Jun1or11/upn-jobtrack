import React, { useMemo, useState } from 'react';
import type { Postulacion } from '../types';
import { fechaRelativa, formatearFechaLarga, hoyISO, parseFecha } from '../utils/fechas';

interface CalendarioPageProps {
  postulaciones: Postulacion[];
  onEditar: (postulacion: Postulacion) => void;
}

interface EventoCalendario {
  fecha: string;
  tipo: 'postulacion' | 'accion';
  postulacion: Postulacion;
}

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const pad = (n: number) => String(n).padStart(2, '0');
const clave = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

const CalendarioPage: React.FC<CalendarioPageProps> = ({ postulaciones, onEditar }) => {
  const hoy = new Date();
  const [mes, setMes] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });
  const [seleccion, setSeleccion] = useState(hoyISO());

  const eventos = useMemo(() => {
    const lista: EventoCalendario[] = [];
    for (const p of postulaciones) {
      lista.push({ fecha: p.fecha, tipo: 'postulacion', postulacion: p });
      if (p.fechaProximaAccion) {
        lista.push({ fecha: p.fechaProximaAccion, tipo: 'accion', postulacion: p });
      }
    }
    return lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [postulaciones]);

  const porFecha = useMemo(() => {
    const mapa = new Map<string, EventoCalendario[]>();
    for (const e of eventos) {
      const actual = mapa.get(e.fecha) ?? [];
      actual.push(e);
      mapa.set(e.fecha, actual);
    }
    return mapa;
  }, [eventos]);

  const celdas = useMemo(() => {
    const primerDia = new Date(mes.year, mes.month, 1);
    const inicio = (primerDia.getDay() + 6) % 7;
    const totalDias = new Date(mes.year, mes.month + 1, 0).getDate();
    const lista: Array<string | null> = Array(inicio).fill(null);
    for (let dia = 1; dia <= totalDias; dia += 1) lista.push(clave(mes.year, mes.month, dia));
    while (lista.length % 7 !== 0) lista.push(null);
    return lista;
  }, [mes]);

  const eventosDelMes = eventos.filter(e => e.fecha.startsWith(`${mes.year}-${pad(mes.month + 1)}`));
  const eventosSeleccion = porFecha.get(seleccion) ?? [];
  const tituloMes = new Date(mes.year, mes.month, 1).toLocaleDateString('es-PE', {
    month: 'long', year: 'numeric',
  });

  const cambiarMes = (delta: number) => {
    const d = new Date(mes.year, mes.month + delta, 1);
    setMes({ year: d.getFullYear(), month: d.getMonth() });
  };

  const irHoy = () => {
    const d = new Date();
    setMes({ year: d.getFullYear(), month: d.getMonth() });
    setSeleccion(hoyISO());
  };

  return (
    <>
      <section className="module-intro">
        <div>
          <h2 className="module-intro__title">Calendario de actividad</h2>
          <p className="module-intro__sub">
            Fechas de postulación y próximas acciones de todos tus procesos.
          </p>
        </div>
        <div className="module-intro__stats">
          <div className="mini-stat">
            <span className="mini-stat__value">{eventosDelMes.length}</span>
            <span className="mini-stat__label">Eventos del mes</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat__value">{eventos.filter(e => e.tipo === 'accion').length}</span>
            <span className="mini-stat__label">Próximas acciones</span>
          </div>
        </div>
      </section>

      <div className="calendar-layout">
        <section className="calendar-card">
          <div className="calendar-card__header">
            <button className="btn btn--ghost btn--sm" onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior">←</button>
            <h3 className="calendar-card__title">{tituloMes}</h3>
            <div className="calendar-card__nav">
              <button className="btn btn--ghost btn--sm" onClick={irHoy}>Hoy</button>
              <button className="btn btn--ghost btn--sm" onClick={() => cambiarMes(1)}
                aria-label="Mes siguiente">→</button>
            </div>
          </div>

          <div className="calendar-grid calendar-grid--head">
            {DIAS.map(dia => <div key={dia} className="calendar-head">{dia}</div>)}
          </div>
          <div className="calendar-grid">
            {celdas.map((fecha, indice) => {
              if (!fecha) return <div key={`vacio-${indice}`} className="calendar-day calendar-day--empty" />;
              const delDia = porFecha.get(fecha) ?? [];
              const esHoy = fecha === hoyISO();
              const activo = fecha === seleccion;
              return (
                <button
                  key={fecha}
                  className={`calendar-day${esHoy ? ' calendar-day--today' : ''}${activo ? ' calendar-day--selected' : ''}${delDia.length ? ' calendar-day--has-events' : ''}`}
                  onClick={() => setSeleccion(fecha)}
                  aria-label={`${formatearFechaLarga(fecha)}, ${delDia.length} eventos`}
                >
                  <span className="calendar-day__number">{Number(fecha.slice(8, 10))}</span>
                  {delDia.length > 0 && (
                    <span className="calendar-day__dots">
                      {delDia.slice(0, 3).map((e, i) => (
                        <span key={i} className={`calendar-dot calendar-dot--${e.tipo}`} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span><i className="calendar-dot calendar-dot--postulacion" /> Postulación</span>
            <span><i className="calendar-dot calendar-dot--accion" /> Próxima acción</span>
          </div>
        </section>

        <aside className="calendar-side">
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">
                {formatearFechaLarga(seleccion)}
              </h3>
            </div>
            {eventosSeleccion.length === 0 ? (
              <div className="panel__empty">No hay eventos este día.</div>
            ) : (
              <ul className="calendar-event-list">
                {eventosSeleccion.map((e, i) => (
                  <li key={`${e.postulacion.id}-${e.tipo}-${i}`}>
                    <button className="calendar-event" onClick={() => onEditar(e.postulacion)}>
                      <span className={`calendar-dot calendar-dot--${e.tipo}`} />
                      <span className="calendar-event__body">
                        <strong>{e.postulacion.cargo}</strong>
                        <small>
                          {e.postulacion.empresa} · {e.tipo === 'accion'
                            ? (e.postulacion.proximaAccion || 'Próxima acción')
                            : 'Postulación enviada'}
                        </small>
                      </span>
                      <span className="calendar-event__relative">{fechaRelativa(e.fecha)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Agenda del mes</h3>
              <span className="panel__meta">{eventosDelMes.length}</span>
            </div>
            {eventosDelMes.length === 0 ? (
              <div className="panel__empty">Sin eventos registrados en este mes.</div>
            ) : (
              <ul className="calendar-event-list">
                {eventosDelMes.map((e, i) => (
                  <li key={`${e.postulacion.id}-${e.tipo}-mes-${i}`}>
                    <button className="calendar-event" onClick={() => {
                      setSeleccion(e.fecha);
                      const d = parseFecha(e.fecha);
                      setMes({ year: d.getFullYear(), month: d.getMonth() });
                      onEditar(e.postulacion);
                    }}>
                      <span className="calendar-event__date">
                        {e.fecha.slice(8, 10)}/{e.fecha.slice(5, 7)}
                      </span>
                      <span className="calendar-event__body">
                        <strong>{e.postulacion.empresa}</strong>
                        <small>
                          {e.tipo === 'accion' ? 'Próxima acción' : 'Postulación'} · {e.postulacion.cargo}
                        </small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default CalendarioPage;
