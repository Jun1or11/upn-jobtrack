import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Postulacion } from './postulacion.entity';
import { PostulacionesService } from './postulaciones.service';

describe('PostulacionesService: consultas limitadas por propietario', () => {
  const repo = { findOneBy: jest.fn(), update: jest.fn(), delete: jest.fn() };
  const service = new PostulacionesService(repo as unknown as Repository<Postulacion>);
  beforeEach(() => jest.resetAllMocks());

  it('no actualiza una postulación ajena', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.update('usuario-b', 'id-ajeno', { estado: 'Oferta' } as never)).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'id-ajeno', ownerId: 'usuario-b' });
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('elimina utilizando id y propietario en la misma consulta', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove('usuario-b', 'id-ajeno')).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.delete).toHaveBeenCalledWith({ id: 'id-ajeno', ownerId: 'usuario-b' });
  });
});
