import { Module } from '@nestjs/common';
import { DynamoProductsRepository } from '../repositories/dynamoProducts.repository';
import { Config } from '../helpers/config';
import { MockProductsCategoriesRepository } from '../repositories/mockProductsCategories.repository';
import { ProductsRepository } from '../repositories/products.abstract.repository';
import { ProductsCategoriesRepository } from '../repositories/productsCategories.abstract.repository';
import { DefaultProductsService } from '../services/products.service';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';
import { DynamoDBModule } from './dynamoDb.module';
import { SNSModule } from './snsModule';
import { NotificationRepository } from '../repositories/notification.abstract.repository';
import { SnsRepository } from '../repositories/sns.repository';
import { DefaultProductNotificationService } from '../services/productNotification.service';

@Module({
  providers: [
    Config,
    DefaultProductsService,
    DefaultProductNotificationService,
    { provide: ValidationService, useClass: YupValidationService },
    { provide: ProductsRepository, useClass: DynamoProductsRepository },
    {
      provide: ProductsCategoriesRepository,
      useClass: MockProductsCategoriesRepository,
    },
    {
      provide: NotificationRepository,
      useClass: SnsRepository,
    },
  ],
  imports: [DynamoDBModule, SNSModule],
})
export class AppModule {}
