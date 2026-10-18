import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true, length: 254 }) email!: string;
  @Column({ length: 80 }) nombre!: string;
  @Column({ length: 40 }) ciclo!: string;
  @Column({ length: 100 }) carrera!: string;
  @Column({ select: false }) passwordHash!: string;
  @Column({ default: 0 }) tokenVersion!: number;
  @Column({ type: 'varchar', nullable: true, select: false }) resetTokenHash!: string | null;
  @Column({ type: 'timestamptz', nullable: true, select: false }) resetExpiresAt!: Date | null;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
}

export function publicUser(user: User) {
  return { id: user.id, email: user.email, nombre: user.nombre, ciclo: user.ciclo, carrera: user.carrera };
}
