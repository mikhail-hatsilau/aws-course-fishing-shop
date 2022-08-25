import { Product } from '../dto/product';
import { GenericRepository } from './generic.abstract.repository';

export abstract class ProductsRepository
  implements GenericRepository<Product, (product: Product) => boolean>
{
  abstract getAll(): Promise<Product[]>;
  abstract getAll(query: Partial<Product>): Promise<Product[]>;
  abstract get(id: string): Promise<Product | undefined>;
}
