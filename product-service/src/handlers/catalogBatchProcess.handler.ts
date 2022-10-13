import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { SQSEvent } from 'aws-lambda';
import { bootstrap } from './bootstrap';
import { YupValidationService } from '../services/yupValidation.service';
import { ValidationService } from '../services/validation.abstract.service';
import { createProductRequestSchema, Product } from '../dto/product';
import { ProductsService } from '../services/products.interface.service';
import { DefaultProductsService } from '../services/products.service';
import { ProductError } from '../helpers/errors/productError';
import { ProductNotificationService } from '../services/productNotification.interface.service';
import { DefaultProductNotificationService } from '../services/productNotification.service';

const catalogBatchProcessHandler = async (event: SQSEvent) => {
  const app = await bootstrap();
  const validationService = app.get<YupValidationService>(ValidationService);
  const productsService = app.get<ProductsService>(DefaultProductsService);
  const productNotificationService = app.get<ProductNotificationService>(
    DefaultProductNotificationService,
  );
  const { Records: productRecords } = event;
  const products = productRecords.map((record) => JSON.parse(record.body));
  const validProducts: Product[] = [];

  console.log('Validate products...');
  try {
    await Promise.all(
      products.map(async (product) => {
        await validationService.validate(createProductRequestSchema, product);
        validProducts.push(product);
      }),
    );
  } catch (error) {
    console.error(error);
  }
  console.log(`Identified ${validProducts.length} of valid products`);
  console.log('Creating products...');

  const addedProducts: Product[] = [];
  await Promise.all(
    validProducts.map(async (product) => {
      try {
        addedProducts.push(await productsService.createProduct(product));
      } catch (e) {
        if (e instanceof ProductError) {
          console.error(e);
          return;
        }
        throw e;
      }
    }),
  );

  if (addedProducts.length) {
    console.log('Products successfully created!');
    console.log('Sending notification...');
    await productNotificationService.notifyProductsCreated(addedProducts);
    console.log('Notification sent successfully!');
  }
};

export const catalogBatchProcess = middy(catalogBatchProcessHandler).use(
  inputOutputLogger(),
);
