import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './auth.dto';
import { CreatePostulacionDto, UpdatePostulacionDto } from '../postulaciones/postulacion.dto';

describe('Validación de entradas', () => {
  it('normaliza correo y rechaza contraseña corta', async () => {
    const dto = plainToInstance(RegisterDto, { email: '  USER@UPN.PE ', password: '123', nombre: 'Ana', ciclo: '9', carrera: 'Sistemas' });
    expect(dto.email).toBe('user@upn.pe');
    expect((await validate(dto)).map(e => e.property)).toContain('password');
  });
  it('permite PATCH de solo estado, pero no null ni estados desconocidos', async () => {
    expect(await validate(plainToInstance(UpdatePostulacionDto, { estado: 'Oferta' }))).toHaveLength(0);
    expect((await validate(plainToInstance(UpdatePostulacionDto, { estado: null }))).length).toBeGreaterThan(0);
    expect((await validate(plainToInstance(UpdatePostulacionDto, { estado: 'Inventado' }))).length).toBeGreaterThan(0);
  });
  it('rechaza empresa vacía, fechas inválidas y futuras', async () => {
    for (const fecha of ['2026-02-30', '2999-01-01']) {
      const dto = plainToInstance(CreatePostulacionDto, { empresa: ' ', cargo: 'Analista', fuente: 'LinkedIn', fecha, estado: 'Postulado', proximaAccion: '', nota: '' });
      const fields = (await validate(dto)).map(e => e.property);
      expect(fields).toContain('empresa'); expect(fields).toContain('fecha');
    }
  });
});
