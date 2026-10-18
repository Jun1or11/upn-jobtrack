import { INestApplication } from '@nestjs/common';
import { environment } from './config';
import { validationPipe } from './common/validation';

export function setup(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableCors({ origin: environment().origin });
  app.useGlobalPipes(validationPipe());
}
