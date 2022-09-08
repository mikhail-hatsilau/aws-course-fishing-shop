import { CreateProductRequest, Product } from '../../src/dto/product';
import { ProductsRepository } from '../../src/repositories/products.abstract.repository';

export class MockProductsRepository implements ProductsRepository {
  getAll(query?: Partial<Product>): Promise<Product[]> {
    throw new Error('Method not implemented');
  }
  get(id: string): Promise<Product | undefined> {
    throw new Error('Method not implemented');
  }
  insert(data: CreateProductRequest): Promise<Product> {
    throw new Error('Method not implemented');
  }
}
