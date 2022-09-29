import { ProductCategory } from '../dto/productCategory';
import { GenericRepository } from './generic.abstract.repository';

export abstract class ProductsCategoriesRepository
  implements GenericRepository<ProductCategory>
{
  abstract getAll(): Promise<ProductCategory[]>;
  abstract get(id: string): Promise<ProductCategory | undefined>;
  abstract insert(data: Omit<ProductCategory, 'id'>): Promise<ProductCategory>;
}
