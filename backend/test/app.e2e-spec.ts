import 'reflect-metadata';
import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/user.entity';
import { Postulacion } from '../src/postulaciones/postulacion.entity';
import { Initial1780000000000 } from '../src/database/migrations/1780000000000-initial';

// Solo PostgreSQL real. Crea un schema exclusivo y lo elimina al finalizar.
describe('API NestJS + PostgreSQL', () => {
  let app: INestApplication;
  let db: DataSource;
  const schema = `test_${randomUUID().replace(/-/g, '')}`;
  let a: { token: string; usuario: { id: string }; expiraEn: number };
  let b: typeof a;
  let jobId: string;
  const email = `a-${randomUUID()}@upn.pe`;
  const password = 'Password123!';
  const job = { empresa: 'Empresa Prueba', cargo: 'Analista', fuente: 'LinkedIn', fecha: '2026-01-01', estado: 'Postulado', proximaAccion: '', nota: 'Prueba' };

  beforeAll(async () => {
    if (!process.env.TEST_DATABASE_URL) throw new Error('Configura TEST_DATABASE_URL con PostgreSQL real para ejecutar e2e.');
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.JWT_SECRET = 'test-only-secret-012345678901234567890';
    process.env.DEMO_PASSWORD_RESET = 'true';
    process.env.NODE_ENV = 'test';
    const { AppModule } = await import('../src/app.module');
    const { setup } = await import('../src/setup');
    const { getDataSourceToken } = await import('@nestjs/typeorm');
    db = new DataSource({ type: 'postgres', url: process.env.TEST_DATABASE_URL, entities: [User, Postulacion], installExtensions: false, extra: { options: `-c search_path=${schema}` } });
    await db.initialize();
    await db.query(`CREATE SCHEMA "${schema}"`);
    const runner = db.createQueryRunner();
    try { await new Initial1780000000000().up(runner); }
    finally { await runner.release(); }
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(getDataSourceToken()).useValue(db).compile();
    app = module.createNestApplication(); setup(app); await app.init();
  });

  afterAll(async () => {
    if (db?.isInitialized) { await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`); }
    if (app) await app.close();
    if (db?.isInitialized) await db.destroy();
  });

  const api = () => request(app.getHttpServer());
  it('registra dos cuentas y almacena bcrypt sin exponerlo', async () => {
    const profile = { password, nombre: 'Usuario Prueba', ciclo: '9', carrera: 'Sistemas' };
    a = (await api().post('/api/auth/register').send({ ...profile, email }).expect(201)).body;
    b = (await api().post('/api/auth/register').send({ ...profile, email: `b-${randomUUID()}@upn.pe` }).expect(201)).body;
    expect(a.usuario).not.toHaveProperty('passwordHash');
    const saved = await db.getRepository(User).createQueryBuilder('u').addSelect('u.passwordHash').where('u.id = :id', { id: a.usuario.id }).getOneOrFail();
    expect(saved.passwordHash).not.toBe(password);
    expect(await bcrypt.compare(password, saved.passwordHash)).toBe(true);
    await api().post('/api/auth/register').send({ ...profile, email }).expect(409);
  });

  it('valida login y exige JWT vigente', async () => {
    await api().post('/api/auth/login').send({ email, password: 'incorrecta' }).expect(401);
    a = (await api().post('/api/auth/login').send({ email, password }).expect(200)).body;
    await api().get('/api/auth/me').set('Authorization', `Bearer ${a.token}`).expect(200);
    await api().get('/api/postulaciones').expect(401);
    await api().get('/api/postulaciones').set('Authorization', 'Bearer invalid').expect(401);
    const { JwtService } = await import('@nestjs/jwt');
    const expired = await app.get(JwtService).signAsync({ sub: a.usuario.id, ver: 0 }, { expiresIn: -1 });
    await api().get('/api/postulaciones').set('Authorization', `Bearer ${expired}`).expect(401);
  });

  it('crea, lista, busca, filtra y actualiza sin aceptar ownerId del cliente', async () => {
    const auth = `Bearer ${a.token}`;
    await api().post('/api/postulaciones').set('Authorization', auth).send({ ...job, empresa: ' ' }).expect(400);
    await api().post('/api/postulaciones').set('Authorization', auth).send({ ...job, ownerId: b.usuario.id }).expect(400);
    jobId = (await api().post('/api/postulaciones').set('Authorization', auth).send(job).expect(201)).body.id;
    expect((await api().get('/api/postulaciones?q=Prueba&estado=Postulado').set('Authorization', auth).expect(200)).body).toHaveLength(1);
    const edited = await api().patch(`/api/postulaciones/${jobId}`).set('Authorization', auth).send({ estado: 'Oferta', cargo: 'Analista Senior' }).expect(200);
    expect(edited.body.cargo).toBe('Analista Senior');
    await api().patch(`/api/postulaciones/${jobId}`).set('Authorization', auth).send({ estado: null }).expect(400);
  });

  it('impide listar, consultar, editar o eliminar datos de otro propietario', async () => {
    const auth = `Bearer ${b.token}`;
    expect((await api().get('/api/postulaciones').set('Authorization', auth).expect(200)).body).toHaveLength(0);
    await api().get(`/api/postulaciones/${jobId}`).set('Authorization', auth).expect(404);
    await api().patch(`/api/postulaciones/${jobId}`).set('Authorization', auth).send({ estado: 'Oferta' }).expect(404);
    await api().delete(`/api/postulaciones/${jobId}`).set('Authorization', auth).expect(404);
  });

  it('elimina para el propietario y mantiene la lista vacía', async () => {
    await api().delete(`/api/postulaciones/${jobId}`).set('Authorization', `Bearer ${a.token}`).expect(200);
    expect((await api().get('/api/postulaciones').set('Authorization', `Bearer ${a.token}`).expect(200)).body).toEqual([]);
  });

  it('recupera contraseña con token de un uso e invalida sesiones anteriores', async () => {
    const result = await api().post('/api/auth/forgot-password').send({ email }).expect(200);
    const demoToken = result.body.demoToken;
    expect(demoToken).toMatch(/^[a-f0-9]{64}$/);
    await api().post('/api/auth/reset-password').send({ token: demoToken, password: 'NewPassword123!' }).expect(200);
    await api().post('/api/auth/reset-password').send({ token: demoToken, password }).expect(401);
    await api().get('/api/auth/me').set('Authorization', `Bearer ${a.token}`).expect(401);
    await api().post('/api/auth/login').send({ email, password }).expect(401);
    a = (await api().post('/api/auth/login').send({ email, password: 'NewPassword123!' }).expect(200)).body;
  });

  it('cierra sesión y revoca el JWT', async () => {
    await api().post('/api/auth/logout').set('Authorization', `Bearer ${a.token}`).expect(200);
    await api().get('/api/auth/me').set('Authorization', `Bearer ${a.token}`).expect(401);
    a = (await api().post('/api/auth/login').send({ email, password: 'NewPassword123!' }).expect(200)).body;
  });

  it('exige contraseña al eliminar cuenta y borra sus postulaciones en cascada', async () => {
    await api().post('/api/postulaciones').set('Authorization', `Bearer ${a.token}`).send(job).expect(201);
    await api().delete('/api/auth/account').set('Authorization', `Bearer ${a.token}`).send({ password: 'incorrecta' }).expect(401);
    await api().delete('/api/auth/account').set('Authorization', `Bearer ${a.token}`).send({ password: 'NewPassword123!' }).expect(200);
    expect(await db.getRepository(Postulacion).countBy({ ownerId: a.usuario.id })).toBe(0);
    await api().get('/api/auth/me').set('Authorization', `Bearer ${a.token}`).expect(401);
    await api().post('/api/auth/login').send({ email, password: 'NewPassword123!' }).expect(401);
  });
});
