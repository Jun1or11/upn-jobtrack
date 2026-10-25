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
  fecha: string;             // ISO date string  YYYY-MM-DD
  estado: EstadoPostulacion;
  proximaAccion: string;
  fechaProximaAccion?: string | null; // ISO date string opcional
  nota: string;
  createdAt: string;         // timestamp de creación
}

export type VistaDashboard =
  | 'dashboard'
  | 'postulaciones'
  | 'entrevistas'
  | 'empresas'
  | 'calendario'
  | 'estadisticas'
  | 'perfil'
  | 'configuracion';

export interface Usuario {
  id: string;
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
