import { QueueRepository } from './queue.abstract.repository';
import { Inject } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Config } from '../helpers/config';

export class SqsRepository<T> implements QueueRepository<T> {
  constructor(
    @Inject('SQS_CLIENT') private readonly client: SQSClient,
    private readonly config: Config,
  ) {}

  async send(message: T): Promise<void> {
    const params = {
      QueueUrl: this.config.getEnvVariable('SQS_URL'),
      MessageBody: JSON.stringify(message),
    };

    await this.client.send(new SendMessageCommand(params));
  }
}
