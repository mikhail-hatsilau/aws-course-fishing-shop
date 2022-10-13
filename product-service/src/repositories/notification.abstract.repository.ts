export interface Attribute {
  type: string;
  binaryValue?: string;
  stringValue?: string;
}

export interface Notification {
  message: string;
  subject: string;
  attributes?: Record<string, Attribute>;
}

export abstract class NotificationRepository {
  abstract notify(notification: Notification): Promise<void>;
}
