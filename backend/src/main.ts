import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
NestFactory.create(AppModule).then(async (app) => {
  app.enableCors(); app.setGlobalPrefix('api'); await app.listen(4000);
});
