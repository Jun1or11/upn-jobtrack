import { ValidationPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const Trim = () => Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value);
export const NormalizeEmail = () => Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim().toLowerCase() : value);

export const validationPipe = () => new ValidationPipe({
  transform: true, whitelist: true, forbidNonWhitelisted: true,
});
