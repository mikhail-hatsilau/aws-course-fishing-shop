import {
  Attribute,
  Notification,
  NotificationRepository,
} from './notification.abstract.repository';
import { Inject } from '@nestjs/common';
import { Config } from '../helpers/config';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export class SnsRepository implements NotificationRepository {
  constructor(
    @Inject('SNS_CLIENT') private readonly client: SNSClient,
    private config: Config,
  ) {}

  async notify(notification: Notification): Promise<void> {
    const { message, subject, attributes } = notification;

    const params = {
      Message: message,
      Subject: subject,
      TopicArn: this.config.getEnvVariable('SNS_ARN'),
      ...(attributes
        ? { MessageAttributes: this.castAttributesToSNS(attributes) }
        : {}),
    };

    await this.client.send(new PublishCommand(params));
  }

  private castAttributesToSNS(attributes: Record<string, Attribute>) {
    return Object.entries(attributes).reduce(
      (result, [key, value]) => ({
        ...result,
        [key]: {
          DataType: value.type,
          StringValue: value.stringValue,
          BinaryValue: value.binaryValue,
        },
      }),
      {},
    );
  }
}
