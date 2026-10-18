import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1780000000000 implements MigrationInterface {
  async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email varchar(254) NOT NULL UNIQUE,
      nombre varchar(80) NOT NULL, ciclo varchar(40) NOT NULL, carrera varchar(100) NOT NULL,
      "passwordHash" varchar NOT NULL, "tokenVersion" integer NOT NULL DEFAULT 0,
      "resetTokenHash" varchar, "resetExpiresAt" timestamptz,
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(`CREATE TABLE postulaciones (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), "ownerId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      empresa varchar(80) NOT NULL, cargo varchar(80) NOT NULL, fuente varchar(40) NOT NULL,
      fecha date NOT NULL, estado varchar(20) NOT NULL CHECK (estado IN ('Por postular', 'Postulado', 'Entrevista', 'Oferta')),
      "proximaAccion" varchar(120) NOT NULL DEFAULT '', nota varchar(300) NOT NULL DEFAULT '',
      "createdAt" timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query('CREATE INDEX postulaciones_owner_idx ON postulaciones ("ownerId")');
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query('DROP TABLE postulaciones');
    await q.query('DROP TABLE users');
  }
}
