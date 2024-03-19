import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
const userAgent = require('express-useragent');

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(userAgent.express());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });
  await app.listen(3000);
}
bootstrap();
