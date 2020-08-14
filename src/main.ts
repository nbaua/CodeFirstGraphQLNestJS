import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT;
  await app.listen(port);
  console.log(`Nest application started on port ${port}`);
}
bootstrap();
