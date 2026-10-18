import { IsDateString, IsIn, IsOptional, IsString, Length, MaxLength, Validate, ValidateIf, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Trim } from '../common/validation';
import { ESTADOS, Estado, FUENTES } from './postulacion.entity';

@ValidatorConstraint({ name: 'pastDate', async: false })
class PastDate implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= new Date().toISOString().slice(0, 10);
  }
  defaultMessage() { return 'La fecha debe tener formato YYYY-MM-DD y no ser futura.'; }
}

export class CreatePostulacionDto {
  @Trim() @IsString() @Length(2, 80) empresa!: string;
  @Trim() @IsString() @Length(3, 80) cargo!: string;
  @IsIn(FUENTES) fuente!: string;
  @IsDateString({ strict: true }) @Validate(PastDate) fecha!: string;
  @IsIn(ESTADOS) estado!: Estado;
  @Trim() @IsString() @MaxLength(120) proximaAccion!: string;
  @Trim() @IsString() @MaxLength(300) nota!: string;
}

// PATCH omite campos ausentes; null no es un valor válido.
export class UpdatePostulacionDto extends CreatePostulacionDto {
  @ValidateIf((_o, value) => value !== undefined) declare empresa: string;
  @ValidateIf((_o, value) => value !== undefined) declare cargo: string;
  @ValidateIf((_o, value) => value !== undefined) declare fuente: string;
  @ValidateIf((_o, value) => value !== undefined) declare fecha: string;
  @ValidateIf((_o, value) => value !== undefined) declare estado: Estado;
  @ValidateIf((_o, value) => value !== undefined) declare proximaAccion: string;
  @ValidateIf((_o, value) => value !== undefined) declare nota: string;
}

export class FilterPostulacionesDto {
  @IsOptional() @Trim() @IsString() @MaxLength(254) q?: string;
  @IsOptional() @IsIn(ESTADOS) estado?: Estado;
}
