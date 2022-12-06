import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.dirname(__dirname);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync(`${ROOT_DIR}/ca/server.key`),
      cert: fs.readFileSync(`${ROOT_DIR}/ca/server.crt`),
    },
  });
  await app.listen(3000);
}

bootstrap();
