import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationService } from '../services/validation.abstract.service';
import { Config } from '../helpers/config';
import { CartModule } from './cart.module';
import { YupValidationService } from '../services/yupValidation.service';

@Module({
  providers: [
    Config,
    { provide: ValidationService, useClass: YupValidationService },
  ],
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        type: 'postgres',
        host: config.getEnvVariable('DB_HOST'),
        port: Number(config.getEnvVariable('DB_PORT')),
        username: config.getEnvVariable('DB_USER'),
        password: config.getEnvVariable('DB_SECRET'),
        database: config.getEnvVariable('DB_NAME'),
        autoLoadEntities: true,
      }),
      extraProviders: [Config],
    }),
    CartModule,
  ],
})
export class AppModule {}
