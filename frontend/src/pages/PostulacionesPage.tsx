import React from 'react';
import type { EstadoPostulacion, Postulacion } from '../types';
import { ESTADOS, ESTADO_CONFIG } from '../constants/postulaciones';
import PostulacionesManager from '../components/PostulacionesManager';

interface PostulacionesPageProps {
  postulaciones: Postulacion[];
  onNueva: () => void;
  onEditar: (postulacion: Postulacion) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, estado: EstadoPostulacion) => void;
}

const PostulacionesPage: React.FC<PostulacionesPageProps> = (props) => {
  const { postulaciones } = props;

  return (
    <>
      <div className="status-strip">
        {ESTADOS.map(estado => (
          <div key={estado} className="status-strip__item">
            <span className={`badge ${ESTADO_CONFIG[estado].clase}`}>
              {ESTADO_CONFIG[estado].emoji} {estado}
            </span>
            <strong>{postulaciones.filter(p => p.estado === estado).length}</strong>
          </div>
        ))}
      </div>
      <PostulacionesManager {...props} />
    </>
  );
};

export default PostulacionesPage;
