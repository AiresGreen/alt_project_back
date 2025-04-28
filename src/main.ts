import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, enableDebugMessages: true}));
  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.JWT_ACCESS_SECRET);
  console.log(process.env.JWT_REFRESH_SECRET);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
