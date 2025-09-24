import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Backend escuchando en http://localhost:${port}`);
  console.log(`🔑 API Key esperada: ${process.env.API_KEY ? '***' : 'NO CONFIGURADA'}`);
}
bootstrap();
