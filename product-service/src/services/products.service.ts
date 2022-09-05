import { Injectable } from '@nestjs/common';
import { GetProductsFilter } from '../dto/productsFilter';
import { Product } from '../dto/product';
import { ProductsService } from './products.interface.service';
import { ProductsRepository } from '../repositories/products.abstract.repository';

@Injectable()
export class DefaultProductsService implements ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async getAll(filter: GetProductsFilter): Promise<Product[]> {
    const { categoryId } = filter;
    return categoryId
      ? this.repository.getAll((product) => product.categoryId === categoryId)
      : this.repository.getAll();
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.repository.get(id);
  }
}
