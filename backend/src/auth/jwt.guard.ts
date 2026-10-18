import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

export type AuthRequest = Request & { user: User };

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, @InjectRepository(User) private readonly users: Repository<User>) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Inicia sesión.');
    try {
      const claims = await this.jwt.verifyAsync<{ sub: string; ver: number }>(token);
      if (typeof claims.sub !== 'string' || !/^[0-9a-f-]{36}$/i.test(claims.sub) || !Number.isInteger(claims.ver)) {
        throw new UnauthorizedException();
      }
      const user = await this.users.findOneBy({ id: claims.sub });
      if (!user || user.tokenVersion !== claims.ver) throw new UnauthorizedException();
      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o vencida.');
    }
  }
}
