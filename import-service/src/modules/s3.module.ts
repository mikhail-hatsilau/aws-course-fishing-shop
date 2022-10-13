import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [
    Config,
    {
      provide: 'S3_CLIENT',
      useFactory: async (config: Config) => {
        return new S3Client({
          region: config.getEnvVariable('REGION'),
        });
      },
      inject: [Config],
    },
  ],
  exports: ['S3_CLIENT'],
})
export class S3Module {}
