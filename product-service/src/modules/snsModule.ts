import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { SNSClient } from '@aws-sdk/client-sns';

@Module({
  providers: [
    Config,
    {
      provide: 'SNS_CLIENT',
      useFactory: async (config: Config) => {
        return new SNSClient({ region: config.getEnvVariable('REGION') });
      },
      inject: [Config],
    },
  ],
  exports: ['SNS_CLIENT'],
})
export class SNSModule {}
