import { ProductNotificationService } from './productNotification.interface.service';
import { Product } from '../dto/product';
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.abstract.repository';

@Injectable()
export class DefaultProductNotificationService
  implements ProductNotificationService
{
  constructor(private readonly repository: NotificationRepository) {}

  async notifyProductsCreated(products: Product[]): Promise<void> {
    const emptyProduct = products.find((product) => !product.count);
    await this.repository.notify({
      message: this.buildMessage(products),
      subject: 'Fisherman product catalog updated',
      ...(emptyProduct
        ? {
            attributes: {
              count: {
                type: 'Number',
                stringValue: '0',
              },
            },
          }
        : {}),
    });
  }

  private buildMessage(products: Product[]) {
    return products.reduce(
      (message, product) => `${message}- ${product.title}\n`,
      'The following products were successfully added to the catalog:\n',
    );
  }
}
