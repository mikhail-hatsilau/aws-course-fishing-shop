import { Product } from 'src/dto/product';
import { ProductsService } from '../../src/services/products.interface.service';

export class ProductsServiceMock implements ProductsService {
  getAll(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  getById(): Promise<Product | undefined> {
    throw new Error('Method not implemented.');
  }
}
