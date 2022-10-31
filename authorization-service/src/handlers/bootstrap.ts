import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';

export const bootstrap = () => {
  return NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
    abortOnError: false,
  });
};
