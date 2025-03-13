import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4000', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Include if you need to allow credentials
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
