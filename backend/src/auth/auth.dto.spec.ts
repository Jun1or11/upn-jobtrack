import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChangePasswordDto, RegisterDto, UpdateProfileDto } from './auth.dto';
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
  it('valida la fecha opcional de próxima acción', async () => {
    const base = { empresa: 'Empresa', cargo: 'Analista', fuente: 'LinkedIn', fecha: '2026-01-01', estado: 'Postulado', proximaAccion: '', nota: '' };
    expect(await validate(plainToInstance(CreatePostulacionDto, { ...base, fechaProximaAccion: '2026-12-01' }))).toHaveLength(0);
    expect(await validate(plainToInstance(CreatePostulacionDto, { ...base, fechaProximaAccion: null }))).toHaveLength(0);
    expect((await validate(plainToInstance(CreatePostulacionDto, { ...base, fechaProximaAccion: '2026-02-30' }))).map(e => e.property)).toContain('fechaProximaAccion');
  });
  it('valida los datos de perfil y cambio de contraseña', async () => {
    expect(await validate(plainToInstance(UpdateProfileDto, { nombre: 'Ana María' }))).toHaveLength(0);
    expect((await validate(plainToInstance(UpdateProfileDto, { nombre: 'A' }))).map(e => e.property)).toContain('nombre');
    expect(await validate(plainToInstance(ChangePasswordDto, { currentPassword: 'Actual123!', newPassword: 'Nueva123!' }))).toHaveLength(0);
    expect((await validate(plainToInstance(ChangePasswordDto, { currentPassword: 'Actual123!', newPassword: 'corta' }))).map(e => e.property)).toContain('newPassword');
  });
});
