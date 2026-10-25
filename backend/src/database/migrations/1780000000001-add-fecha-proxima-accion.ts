import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFechaProximaAccion1780000000001 implements MigrationInterface {
  async up(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE postulaciones ADD COLUMN "fechaProximaAccion" date');
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query('ALTER TABLE postulaciones DROP COLUMN "fechaProximaAccion"');
  }
}
