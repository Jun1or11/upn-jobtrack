import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config';
import { setup } from './setup';

async function bootstrap() {
  const config = environment();
  const app = await NestFactory.create(AppModule);
  setup(app);
  app.enableShutdownHooks();
  await app.listen(config.port, '0.0.0.0');
  console.log(`JOBTRACK API: http://localhost:${config.port}/api`);
}
bootstrap().catch(error => { console.error(error); process.exitCode = 1; });
