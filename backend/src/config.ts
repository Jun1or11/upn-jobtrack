import 'dotenv/config';

export function environment() {
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  if (!databaseUrl?.startsWith('postgresql://') && !databaseUrl?.startsWith('postgres://')) {
    throw new Error('Configura DATABASE_URL de PostgreSQL en backend/.env.');
  }
  if (!jwtSecret || jwtSecret.length < 32 || jwtSecret.includes('replace-with')) {
    throw new Error('Configura JWT_SECRET con al menos 32 caracteres aleatorios.');
  }
  const expires = Number(process.env.JWT_EXPIRES_SECONDS ?? 28800);
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(expires) || expires < 60 || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT o JWT_EXPIRES_SECONDS inválidos.');
  }
  const demoReset = process.env.DEMO_PASSWORD_RESET === 'true';
  if (demoReset && process.env.NODE_ENV === 'production') {
    throw new Error('DEMO_PASSWORD_RESET no está permitido en producción.');
  }
  return { databaseUrl, jwtSecret, expires, port, demoReset,
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' };
}
