const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha local en formato YYYY-MM-DD (evita el desfase UTC). */
export function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseFecha(fecha: string): Date {
  return new Date(`${fecha}T12:00:00`);
}

export function formatearFecha(fecha: string): string {
  return parseFecha(fecha).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatearFechaLarga(fecha: string): string {
  return parseFecha(fecha).toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function mesClave(fecha: string): string {
  return fecha.slice(0, 7);
}

export function nombreMes(clave: string): string {
  const [anio, mes] = clave.split('-').map(Number);
  const texto = new Date(anio, mes - 1, 1).toLocaleDateString('es-PE', {
    month: 'short', year: 'numeric',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function sumarDias(fecha: string, dias: number): string {
  const d = parseFecha(fecha);
  d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function diasHasta(fecha: string): number {
  const hoy = parseFecha(hoyISO()).getTime();
  const objetivo = parseFecha(fecha).getTime();
  return Math.round((objetivo - hoy) / 86_400_000);
}

export function fechaRelativa(fecha: string): string {
  const dias = diasHasta(fecha);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  if (dias === -1) return 'Ayer';
  if (dias > 1 && dias <= 7) return `En ${dias} días`;
  if (dias < -1 && dias >= -7) return `Hace ${Math.abs(dias)} días`;
  return formatearFecha(fecha);
}
