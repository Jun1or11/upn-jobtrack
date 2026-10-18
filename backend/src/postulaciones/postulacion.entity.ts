import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

export const ESTADOS = ['Por postular', 'Postulado', 'Entrevista', 'Oferta'] as const;
export type Estado = typeof ESTADOS[number];
export const FUENTES = ['LinkedIn', 'Computrabajo', 'Indeed', 'Bumeran', 'Bolsa UPN', 'Referido', 'Web empresa', 'Otro'];

@Entity('postulaciones')
export class Postulacion {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid') ownerId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' }) owner!: User;
  @Column({ length: 80 }) empresa!: string;
  @Column({ length: 80 }) cargo!: string;
  @Column({ length: 40 }) fuente!: string;
  @Column({ type: 'date' }) fecha!: string;
  @Column({ type: 'varchar', length: 20 }) estado!: Estado;
  @Column({ length: 120, default: '' }) proximaAccion!: string;
  @Column({ length: 300, default: '' }) nota!: string;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
}
