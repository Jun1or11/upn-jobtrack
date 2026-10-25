import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { NormalizeEmail, Trim } from '../common/validation';

export class EmailDto {
  @NormalizeEmail() @IsEmail() @MaxLength(254) email!: string;
}

export class LoginDto extends EmailDto {
  @IsString() @Length(1, 72) @Matches(/^[\x20-\x7E]+$/, { message: 'La contraseña debe usar caracteres ASCII imprimibles.' }) password!: string;
}

export class RegisterDto extends EmailDto {
  @IsString() @Length(8, 72) @Matches(/^[\x20-\x7E]+$/, { message: 'La contraseña debe usar caracteres ASCII imprimibles.' }) password!: string;
  @Trim() @IsString() @Length(2, 80) nombre!: string;
  @Trim() @IsString() @Length(1, 40) ciclo!: string;
  @Trim() @IsString() @Length(2, 100) carrera!: string;
}

export class ResetPasswordDto {
  @IsString() @Matches(/^[a-f0-9]{64}$/) token!: string;
  @IsString() @Length(8, 72) @Matches(/^[\x20-\x7E]+$/) password!: string;
}

export class DeleteAccountDto {
  @IsString() @Length(1, 72) @Matches(/^[\x20-\x7E]+$/) password!: string;
}

export class UpdateProfileDto {
  @IsOptional() @Trim() @IsString() @Length(2, 80) nombre?: string;
  @IsOptional() @Trim() @IsString() @Length(1, 40) ciclo?: string;
  @IsOptional() @Trim() @IsString() @Length(2, 100) carrera?: string;
}

export class ChangePasswordDto {
  @IsString() @Length(1, 72) @Matches(/^[\x20-\x7E]+$/, { message: 'La contraseña debe usar caracteres ASCII imprimibles.' }) currentPassword!: string;
  @IsString() @Length(8, 72) @Matches(/^[\x20-\x7E]+$/, { message: 'La contraseña debe usar caracteres ASCII imprimibles.' }) newPassword!: string;
}
