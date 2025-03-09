import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // what is globalPipes will do it will simply provide this functionality to all modules and controllers we do not have it manually
  // whitelist will not allow any data that is not in the dto
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
