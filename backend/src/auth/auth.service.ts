import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { publicUser, User } from '../users/user.entity';
import { environment } from '../config';
import { ChangePasswordDto, RegisterDto, UpdateProfileDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService, private readonly db: DataSource) {}

  private async session(user: User) {
    const expires = environment().expires;
    return {
      token: await this.jwt.signAsync({ sub: user.id, ver: user.tokenVersion }, { expiresIn: expires }),
      expiraEn: Date.now() + expires * 1000, usuario: publicUser(user),
    };
  }

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const { password: _password, ...profile } = dto;
      const user = await this.users.save(this.users.create({ ...profile, passwordHash }));
      return await this.session(user);
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new ConflictException('El correo ya está registrado.');
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.users.createQueryBuilder('u').addSelect('u.passwordHash')
      .where('u.email = :email', { email }).getOne();
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
    return this.session(user);
  }

  async logout(id: string) {
    await this.users.increment({ id }, 'tokenVersion', 1);
    return { message: 'Sesiones cerradas.' };
  }

  async forgot(email: string) {
    if (!environment().demoReset) {
      throw new ServiceUnavailableException('Recuperación demo deshabilitada. El envío de correo aún no está configurado.');
    }
    const user = await this.users.findOneBy({ email });
    const token = randomBytes(32).toString('hex');
    if (user) await this.users.update(user.id, {
      resetTokenHash: createHash('sha256').update(token).digest('hex'),
      resetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    return { message: 'Modo académico: usa este token en 15 minutos. Sin envío de correo.', demoToken: token };
  }

  async reset(token: string, password: string) {
    const hash = createHash('sha256').update(token).digest('hex');
    const passwordHash = await bcrypt.hash(password, 12);
    await this.db.transaction(async manager => {
      const user = await manager.getRepository(User).createQueryBuilder('u')
        .where('u.resetTokenHash = :hash AND u.resetExpiresAt > :now', { hash, now: new Date() })
        .setLock('pessimistic_write').getOne();
      if (!user) throw new UnauthorizedException('Token inválido, usado o vencido.');
      await manager.update(User, user.id, {
        passwordHash, resetTokenHash: null, resetExpiresAt: null, tokenVersion: user.tokenVersion + 1,
      });
    });
    return { message: 'Contraseña actualizada. Inicia sesión de nuevo.' };
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const patch: Partial<User> = {};
    if (dto.nombre !== undefined) patch.nombre = dto.nombre;
    if (dto.ciclo !== undefined) patch.ciclo = dto.ciclo;
    if (dto.carrera !== undefined) patch.carrera = dto.carrera;
    if (Object.keys(patch).length) await this.users.update(id, patch);
    const user = await this.users.findOneBy({ id });
    if (!user) throw new UnauthorizedException('Usuario no encontrado.');
    return publicUser(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.users.createQueryBuilder('u').addSelect('u.passwordHash')
      .where('u.id = :id', { id }).getOne();
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new BadRequestException('La contraseña actual es incorrecta.');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('La nueva contraseña debe ser diferente a la actual.');
    }
    user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    user.tokenVersion += 1;
    await this.users.save(user);
    return this.session(user);
  }

  async deleteAccount(id: string, password: string) {
    const user = await this.users.createQueryBuilder('u').addSelect('u.passwordHash').where('u.id = :id', { id }).getOne();
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }
    await this.users.delete(id);
    return { message: 'Cuenta y postulaciones eliminadas.' };
  }
}
