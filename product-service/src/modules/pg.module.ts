import { Module } from '@nestjs/common';
import { Client } from 'pg';
import { Config } from '../helpers/config';

@Module({
  providers: [
    Config,
    {
      provide: 'PG_CLIENT',
      useFactory: async (config: Config) => {
        const client = new Client({
          database: config.getEnvVariable('DB_NAME'),
          host: config.getEnvVariable('DB_HOST'),
          port: Number(config.getEnvVariable('DB_PORT')),
          user: config.getEnvVariable('DB_USER'),
          password: config.getEnvVariable('DB_SECRET'),
        });
        await client.connect();
        return client;
      },
      inject: [Config],
    },
  ],
  exports: ['PG_CLIENT'],
})
export class PGModule {}
