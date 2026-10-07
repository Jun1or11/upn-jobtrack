// ── Tipos principales de JOBTRACK ──────────────────────────────────────────

export type EstadoPostulacion =
  | 'Por postular'
  | 'Postulado'
  | 'Entrevista'
  | 'Oferta';

export interface Postulacion {
  id: string;
  empresa: string;
  cargo: string;
  fuente: string;
  fecha: string;          // ISO date string  YYYY-MM-DD
  estado: EstadoPostulacion;
  proximaAccion: string;
  nota: string;
  createdAt: string;      // timestamp de creación
}

export interface Usuario {
  email: string;
  nombre: string;
  ciclo: string;
  carrera: string;
}

export interface SesionAuth {
  usuario: Usuario;
  token: string;
  expiraEn: number;       // timestamp UNIX
}

export interface MetricasDashboard {
  total: number;
  porPostular: number;
  postulado: number;
  entrevista: number;
  oferta: number;
}
