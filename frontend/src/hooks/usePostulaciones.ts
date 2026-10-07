import { useState, useEffect } from 'react';
import type { Postulacion, MetricasDashboard, EstadoPostulacion } from '../types';
import { postulacionesDemo } from '../data/postulacionesDemo';
import { cargarPostulaciones, guardarPostulaciones, generarId } from '../utils/storage';

// ── Hook de postulaciones ──────────────────────────────────────────────────
export function usePostulaciones() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar desde localStorage o inicializar con demo data
  useEffect(() => {
    const almacenadas = cargarPostulaciones() as Postulacion[] | null;
    if (almacenadas && almacenadas.length > 0) {
      setPostulaciones(almacenadas);
    } else {
      setPostulaciones(postulacionesDemo);
      guardarPostulaciones(postulacionesDemo);
    }
    setCargando(false);
  }, []);

  // Persistir al cambiar
  useEffect(() => {
    if (!cargando) {
      guardarPostulaciones(postulaciones);
    }
  }, [postulaciones, cargando]);

  const agregarPostulacion = (nueva: Omit<Postulacion, 'id' | 'createdAt'>) => {
    const postulacion: Postulacion = {
      ...nueva,
      id: generarId(),
      createdAt: new Date().toISOString(),
    };
    setPostulaciones(prev => [postulacion, ...prev]);
    return postulacion;
  };

  const eliminarPostulacion = (id: string) => {
    setPostulaciones(prev => prev.filter(p => p.id !== id));
  };

  const actualizarEstado = (id: string, estado: EstadoPostulacion) => {
    setPostulaciones(prev =>
      prev.map(p => (p.id === id ? { ...p, estado } : p))
    );
  };

  const metricas: MetricasDashboard = {
    total: postulaciones.length,
    porPostular: postulaciones.filter(p => p.estado === 'Por postular').length,
    postulado: postulaciones.filter(p => p.estado === 'Postulado').length,
    entrevista: postulaciones.filter(p => p.estado === 'Entrevista').length,
    oferta: postulaciones.filter(p => p.estado === 'Oferta').length,
  };

  return {
    postulaciones,
    cargando,
    metricas,
    agregarPostulacion,
    eliminarPostulacion,
    actualizarEstado,
  };
}
