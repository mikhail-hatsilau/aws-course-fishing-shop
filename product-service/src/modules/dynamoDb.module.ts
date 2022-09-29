import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Config } from '../helpers/config';

@Module({
  providers: [
    Config,
    {
      provide: 'DYNAMO_CLIENT',
      useFactory: async (config: Config) => {
        const marshallOptions = {
          convertEmptyValues: false,
          removeUndefinedValues: false,
          convertClassInstanceToMap: false,
        };
        const unmarshallOptions = {
          wrapNumbers: false,
        };
        const client = new DynamoDBClient({
          region: config.getEnvVariable('REGION'),
        });
        return DynamoDBDocument.from(client, {
          marshallOptions,
          unmarshallOptions,
        });
      },
      inject: [Config],
    },
  ],
  exports: ['DYNAMO_CLIENT'],
})
export class DynamoDBModule {}
