import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostulacionesModule } from './postulaciones/postulaciones.module';
import { User } from './users/user.entity';
import { Postulacion } from './postulaciones/postulacion.entity';
import { environment } from './config';
import { HealthController } from './health.controller';

@Module({ imports: [
  TypeOrmModule.forRootAsync({ useFactory: () => ({
    type: 'postgres', url: environment().databaseUrl, entities: [User, Postulacion],
    synchronize: false, installExtensions: false, retryAttempts: 5, retryDelay: 3000,
  }) }), AuthModule, PostulacionesModule,
], controllers: [HealthController] })
export class AppModule {}
