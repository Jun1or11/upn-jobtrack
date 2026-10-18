import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Postulacion } from './postulacion.entity';
import { PostulacionesController } from './postulaciones.controller';
import { PostulacionesService } from './postulaciones.service';

@Module({ imports: [AuthModule, TypeOrmModule.forFeature([Postulacion])],
  controllers: [PostulacionesController], providers: [PostulacionesService] })
export class PostulacionesModule {}
