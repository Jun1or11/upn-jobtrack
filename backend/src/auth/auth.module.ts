import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { environment } from '../config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.registerAsync({ useFactory: () => ({
    secret: environment().jwtSecret,
    signOptions: { algorithm: 'HS256', issuer: 'jobtrack', audience: 'jobtrack-web' },
    verifyOptions: { algorithms: ['HS256'], issuer: 'jobtrack', audience: 'jobtrack-web' },
  }) })],
  controllers: [AuthController], providers: [AuthService, JwtGuard], exports: [JwtGuard, JwtModule, TypeOrmModule],
})
export class AuthModule {}
