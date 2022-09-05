import { Module } from '@nestjs/common';
import { MockProductsRepository } from './repositories/mockProducts.repository';
import { MockProductsCategoriesRepository } from './repositories/mockProductsCategories.repository';
import { ProductsRepository } from './repositories/products.abstract.repository';
import { ProductsCategoriesRepository } from './repositories/productsCategories.abstract.repository';
import { DefaultProductsService } from './services/products.service';
import { ValidationService } from './services/validation.abstract.service';
import { YupValidationService } from './services/yupValidation.service';

@Module({
  controllers: [],
  providers: [
    DefaultProductsService,
    { provide: ValidationService, useClass: YupValidationService },
    { provide: ProductsRepository, useClass: MockProductsRepository },
    {
      provide: ProductsCategoriesRepository,
      useClass: MockProductsCategoriesRepository,
    },
  ],
})
export class AppModule {}
