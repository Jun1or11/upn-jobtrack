import { useState, useEffect, useCallback } from 'react';
import type { Postulacion, MetricasDashboard, EstadoPostulacion } from '../types';
import { jobsApi } from '../utils/api';

export function usePostulaciones() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setCargando(true); setError('');
    try { setPostulaciones(await jobsApi.list()); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudieron cargar las postulaciones.'); }
    finally { setCargando(false); }
  }, []);

  useEffect(() => { void recargar(); }, [recargar]);

  const agregarPostulacion = async (datos: Omit<Postulacion, 'id' | 'createdAt'>) => {
    const nueva = await jobsApi.create(datos);
    setPostulaciones(prev => [nueva, ...prev]);
    return nueva;
  };

  const eliminarPostulacion = async (id: string) => {
    await jobsApi.remove(id);
    setPostulaciones(prev => prev.filter(p => p.id !== id));
  };

  const editarPostulacion = async (id: string, datos: Partial<Omit<Postulacion, 'id' | 'createdAt'>>) => {
    const editada = await jobsApi.update(id, datos);
    setPostulaciones(prev => prev.map(p => p.id === id ? editada : p));
  };

  const actualizarEstado = (id: string, estado: EstadoPostulacion) => editarPostulacion(id, { estado });

  const metricas: MetricasDashboard = {
    total: postulaciones.length,
    porPostular: postulaciones.filter(p => p.estado === 'Por postular').length,
    postulado: postulaciones.filter(p => p.estado === 'Postulado').length,
    entrevista: postulaciones.filter(p => p.estado === 'Entrevista').length,
    oferta: postulaciones.filter(p => p.estado === 'Oferta').length,
  };

  return { postulaciones, cargando, error, recargar, metricas,
    agregarPostulacion, editarPostulacion, eliminarPostulacion, actualizarEstado };
}
