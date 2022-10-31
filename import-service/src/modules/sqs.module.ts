import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { SQSClient } from '@aws-sdk/client-sqs';

@Module({
  providers: [
    Config,
    {
      provide: 'SQS_CLIENT',
      useFactory: async (config: Config) => {
        return new SQSClient({
          region: config.getEnvVariable('REGION'),
        });
      },
      inject: [Config],
    },
  ],
  exports: ['SQS_CLIENT'],
})
export class SQSModule {}
