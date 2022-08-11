import { Injectable } from '@nestjs/common';
import { ProductsCategoriesRepository } from '../repositories/productsCategories.abstract.repository';
import { ProductCategory } from '../dto/productCategory';
import { ProductsCategoriesService } from './productsCategories.interface.service';

@Injectable()
export class DefaultProductsCategoriesService
  implements ProductsCategoriesService
{
  constructor(private readonly repository: ProductsCategoriesRepository) {}

  async getAll(): Promise<ProductCategory[]> {
    return this.repository.getAll();
  }
  async getById(categoryId: string): Promise<ProductCategory | undefined> {
    return this.repository.get(categoryId);
  }
}
