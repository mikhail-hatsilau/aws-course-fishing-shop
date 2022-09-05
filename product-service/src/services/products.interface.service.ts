import { Product } from '../dto/product';
import { GetProductsFilter } from '../dto/productsFilter';

export interface ProductsService {
  getAll(filter: GetProductsFilter): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
}
