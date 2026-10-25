import React, { useMemo } from 'react';
import type { Postulacion } from '../types';
import { ESTADOS, ESTADO_CONFIG } from '../constants/postulaciones';
import { mesClave, nombreMes } from '../utils/fechas';

interface EstadisticasPageProps {
  postulaciones: Postulacion[];
  onNavegar?: () => void;
}

const pct = (parte: number, total: number) => total ? Math.round((parte / total) * 100) : 0;
const pad = (n: number) => String(n).padStart(2, '0');

const EstadisticasPage: React.FC<EstadisticasPageProps> = ({ postulaciones }) => {
  const datos = useMemo(() => {
    const total = postulaciones.length;
    const porEstado = Object.fromEntries(
      ESTADOS.map(e => [e, postulaciones.filter(p => p.estado === e).length]),
    ) as Record<(typeof ESTADOS)[number], number>;
    const conRespuesta = porEstado.Postulado + porEstado.Entrevista + porEstado.Oferta;
    const entrevistas = porEstado.Entrevista + porEstado.Oferta;
    const ofertas = porEstado.Oferta;

    const porFuente = new Map<string, number>();
    for (const p of postulaciones) porFuente.set(p.fuente, (porFuente.get(p.fuente) ?? 0) + 1);
    const fuentes = [...porFuente.entries()].sort((a, b) => b[1] - a[1]);

    const porEmpresa = new Map<string, number>();
    for (const p of postulaciones) porEmpresa.set(p.empresa, (porEmpresa.get(p.empresa) ?? 0) + 1);
    const empresas = [...porEmpresa.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    const hoy = new Date();
    const meses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - 5 + i, 1);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    });
    const porMes = meses.map(mes => ({
      mes,
      total: postulaciones.filter(p => mesClave(p.fecha) === mes).length,
    }));
    const maxMes = Math.max(1, ...porMes.map(m => m.total));

    return {
      total, porEstado, conRespuesta, entrevistas, ofertas, fuentes, empresas, porMes, maxMes,
    };
  }, [postulaciones]);

  const embudo = [
    { label: 'Registradas', value: datos.total, color: 'primary' },
    { label: 'Con respuesta', value: datos.conRespuesta, color: 'info' },
    { label: 'Entrevistas', value: datos.entrevistas, color: 'warning' },
    { label: 'Ofertas', value: datos.ofertas, color: 'success' },
  ];

  if (datos.total === 0) {
    return (
      <div className="empty-state card">
        <div className="empty-state__icon">📊</div>
        <div className="empty-state__title">Aún no hay datos para analizar</div>
        <p className="empty-state__sub">
          Registra tus primeras postulaciones y aquí verás tu embudo, fuentes y evolución mensual.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="module-intro">
        <div>
          <h2 className="module-intro__title">Análisis de tu búsqueda</h2>
          <p className="module-intro__sub">
            Métricas calculadas en tiempo real a partir de tus postulaciones.
          </p>
        </div>
      </section>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-card__label">Total postulaciones</span>
          <span className="kpi-card__value">{datos.total}</span>
          <span className="kpi-card__hint">Registros en PostgreSQL</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card__label">Tasa de respuesta</span>
          <span className="kpi-card__value">{pct(datos.conRespuesta, datos.total)}%</span>
          <span className="kpi-card__hint">{datos.conRespuesta} postulaciones avanzaron</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card__label">Tasa de entrevista</span>
          <span className="kpi-card__value">{pct(datos.entrevistas, datos.total)}%</span>
          <span className="kpi-card__hint">{datos.entrevistas} llegaron a entrevista</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card__label">Ofertas</span>
          <span className="kpi-card__value">{datos.ofertas}</span>
          <span className="kpi-card__hint">
            {datos.total ? `${pct(datos.ofertas, datos.total)}% del total` : 'Sin datos'}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Embudo de conversión</h3>
          </div>
          <div className="funnel">
            {embudo.map(etapa => (
              <div key={etapa.label} className="funnel__row">
                <div className="funnel__labels">
                  <span>{etapa.label}</span>
                  <strong>{etapa.value} <small>({pct(etapa.value, datos.total)}%)</small></strong>
                </div>
                <div className="funnel__track">
                  <div className={`funnel__bar funnel__bar--${etapa.color}`}
                    style={{ width: `${Math.max(etapa.value ? 4 : 0, pct(etapa.value, datos.total))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Distribución por estado</h3>
          </div>
          <div className="bar-list">
            {ESTADOS.map(estado => (
              <div key={estado} className="bar-row">
                <span className={`badge ${ESTADO_CONFIG[estado].clase}`}>
                  {ESTADO_CONFIG[estado].emoji} {estado}
                </span>
                <div className="bar-row__track">
                  <div className="bar-row__fill"
                    style={{ width: `${Math.max(datos.porEstado[estado] ? 3 : 0, pct(datos.porEstado[estado], datos.total))}%` }} />
                </div>
                <strong>{datos.porEstado[estado]}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Postulaciones por mes</h3>
            <span className="panel__meta">Últimos 6 meses</span>
          </div>
          <div className="month-chart">
            {datos.porMes.map(m => (
              <div key={m.mes} className="month-bar">
                <span className="month-bar__value">{m.total}</span>
                <div className="month-bar__track">
                  <div className="month-bar__fill"
                    style={{ height: `${Math.max(m.total ? 8 : 0, Math.round((m.total / datos.maxMes) * 100))}%` }} />
                </div>
                <span className="month-bar__label">{nombreMes(m.mes)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3 className="panel__title">Fuentes de postulación</h3>
          </div>
          {datos.fuentes.length === 0 ? (
            <div className="panel__empty">Sin datos.</div>
          ) : (
            <div className="bar-list">
              {datos.fuentes.map(([fuente, cantidad]) => (
                <div key={fuente} className="bar-row">
                  <span className="bar-row__label">{fuente}</span>
                  <div className="bar-row__track">
                    <div className="bar-row__fill bar-row__fill--accent"
                      style={{ width: `${Math.max(3, pct(cantidad, datos.total))}%` }} />
                  </div>
                  <strong>{cantidad}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel panel--full">
          <div className="panel__header">
            <h3 className="panel__title">Empresas con más postulaciones</h3>
          </div>
          <div className="company-ranking">
            {datos.empresas.map(([empresa, cantidad], indice) => (
              <div key={empresa} className="company-ranking__item">
                <span className="company-ranking__position">{indice + 1}</span>
                <span className="company-ranking__name">{empresa}</span>
                <span className="company-ranking__bar">
                  <span style={{ width: `${pct(cantidad, datos.empresas[0][1])}%` }} />
                </span>
                <strong>{cantidad}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default EstadisticasPage;
