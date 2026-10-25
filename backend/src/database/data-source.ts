import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Postulacion } from '../postulaciones/postulacion.entity';
import { Initial1780000000000 } from './migrations/1780000000000-initial';
import { AddFechaProximaAccion1780000000001 } from './migrations/1780000000001-add-fecha-proxima-accion';

if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL en backend/.env antes de migrar o ejecutar el seed.');

export const dataSource = new DataSource({
  type: 'postgres', url: process.env.DATABASE_URL,
  entities: [User, Postulacion], migrations: [Initial1780000000000, AddFechaProximaAccion1780000000001],
  synchronize: false, installExtensions: false,
});
