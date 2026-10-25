import * as bcrypt from 'bcrypt';
import { dataSource } from './data-source';
import { User } from '../users/user.entity';
import { Estado, Postulacion } from '../postulaciones/postulacion.entity';

const enDias = (dias: number) => new Date(Date.now() + dias * 86_400_000).toISOString().slice(0, 10);

async function seed() {
  if (process.env.NODE_ENV === 'production') throw new Error('Seed demo disponible solo en desarrollo.');
  await dataSource.initialize();
  try {
    await dataSource.transaction(async manager => {
      // No sobrescribe cuentas, contraseñas ni postulaciones ya existentes.
      const email = (process.env.DEMO_EMAIL ?? 'n00329808@upn.pe').trim().toLowerCase();
      if (await manager.findOneBy(User, { email })) {
        console.log('Cuenta demo ya existente; no se modificó.');
        return;
      }
      const password = process.env.DEMO_PASSWORD ?? 'jobtrack-demo';
      if (password.length < 8 || Buffer.byteLength(password) > 72) throw new Error('DEMO_PASSWORD debe tener entre 8 y 72 bytes.');
      const user = await manager.save(User, manager.create(User, {
        email, nombre: 'Junior Estudiante', ciclo: '9.° ciclo', carrera: 'Ingeniería de Sistemas',
        passwordHash: await bcrypt.hash(password, 12),
      }));
      const demos: [string, string, string, string, Estado, string, string, string][] = [
        ['BCP - Banco de Crédito del Perú', 'Analista de Datos Jr.', 'LinkedIn', '2026-09-15', 'Entrevista', 'Entrevista técnica el 20/09', 'Requiere Python y SQL. Buen salario inicial.', enDias(3)],
        ['Interbank', 'Desarrollador Frontend Jr.', 'Computrabajo', '2026-09-18', 'Postulado', 'Esperar respuesta de RRHH', 'Stack React + TypeScript. Trabajo híbrido.', enDias(5)],
        ['Rimac Seguros', 'Practicante de Sistemas', 'Indeed', '2026-09-20', 'Postulado', 'Completar prueba técnica online', 'Proceso de 3 etapas. Modalidad remota.', enDias(2)],
        ['Alicorp', 'Analista de Sistemas', 'LinkedIn', '2026-09-22', 'Por postular', 'Preparar CV para esta semana', 'Solicitan experiencia en SAP. Revisar requisitos.', enDias(4)],
        ['Belcorp', 'Junior Developer', 'Bumeran', '2026-09-25', 'Oferta', 'Revisar contrato y condiciones', 'Oferta: S/. 2,500. Beneficios completos.', enDias(6)],
        ['Telefónica del Perú', 'Practicante TI', 'LinkedIn', '2026-09-28', 'Por postular', 'Actualizar carta de presentación', 'Posición de 6 meses. Buenas referencias de la empresa.', enDias(8)],
        ['Yape / BCP Digital', 'QA Tester Jr.', 'LinkedIn', '2026-10-01', 'Entrevista', 'Segunda entrevista con el equipo técnico', 'Primera entrevista fue muy bien. Equipo amigable.', enDias(1)],
        ['Falabella Perú', 'Analista Jr. de E-Commerce', 'Computrabajo', '2026-10-03', 'Postulado', 'Esperar filtro de CV', 'Interesante área de innovación digital.', enDias(9)],
      ];
      await manager.save(Postulacion, demos.map(([empresa, cargo, fuente, fecha, estado, proximaAccion, nota, fechaProximaAccion]) =>
        manager.create(Postulacion, { ownerId: user.id, empresa, cargo, fuente, fecha, estado, proximaAccion, nota, fechaProximaAccion })));
      console.log('Cuenta demo y 8 postulaciones creadas en PostgreSQL.');
    });
  } finally { await dataSource.destroy(); }
}
seed().catch(error => { console.error(error); process.exitCode = 1; });
