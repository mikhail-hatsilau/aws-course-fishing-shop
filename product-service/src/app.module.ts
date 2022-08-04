import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';

@Module({
  controllers: [],
  providers: [ProductsService],
})
export class AppModule {}
