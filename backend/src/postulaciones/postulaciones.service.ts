import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './postulacion.entity';
import { CreatePostulacionDto, FilterPostulacionesDto, UpdatePostulacionDto } from './postulacion.dto';

@Injectable()
export class PostulacionesService {
  constructor(@InjectRepository(Postulacion) private readonly jobs: Repository<Postulacion>) {}

  list(ownerId: string, filter: FilterPostulacionesDto) {
    const query = this.jobs.createQueryBuilder('p').where('p.ownerId = :ownerId', { ownerId });
    if (filter.estado) query.andWhere('p.estado = :estado', { estado: filter.estado });
    if (filter.q) query.andWhere('(p.empresa ILIKE :q OR p.cargo ILIKE :q OR p.fuente ILIKE :q)', { q: `%${filter.q}%` });
    return query.orderBy('p.createdAt', 'DESC').addOrderBy('p.id', 'DESC').getMany();
  }

  async find(ownerId: string, id: string) {
    const job = await this.jobs.findOneBy({ id, ownerId });
    if (!job) throw new NotFoundException('Postulación no encontrada.');
    return job;
  }

  create(ownerId: string, dto: CreatePostulacionDto) {
    return this.jobs.save(this.jobs.create({ ...dto, ownerId }));
  }

  async update(ownerId: string, id: string, dto: UpdatePostulacionDto) {
    await this.find(ownerId, id);
    if (Object.keys(dto).length) await this.jobs.update({ id, ownerId }, dto);
    return this.find(ownerId, id);
  }

  async remove(ownerId: string, id: string) {
    const result = await this.jobs.delete({ id, ownerId });
    if (!result.affected) throw new NotFoundException('Postulación no encontrada.');
    return { message: 'Postulación eliminada.' };
  }
}
