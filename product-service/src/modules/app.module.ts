import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { MockProductsCategoriesRepository } from '../repositories/mockProductsCategories.repository';
import { PgProductsRepository } from '../repositories/pgProducts.repository';
import { ProductsRepository } from '../repositories/products.abstract.repository';
import { ProductsCategoriesRepository } from '../repositories/productsCategories.abstract.repository';
import { DefaultProductsService } from '../services/products.service';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';
import { PGModule } from './pg.module';

@Module({
  providers: [
    Config,
    DefaultProductsService,
    { provide: ValidationService, useClass: YupValidationService },
    { provide: ProductsRepository, useClass: PgProductsRepository },
    {
      provide: ProductsCategoriesRepository,
      useClass: MockProductsCategoriesRepository,
    },
  ],
  imports: [PGModule],
})
export class AppModule {}
