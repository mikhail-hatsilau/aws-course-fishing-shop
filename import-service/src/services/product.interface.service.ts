import { ParsedProduct, Product } from '../dto/product';

export interface ProductService {
  sendImportedProducts(products: Product[]): Promise<void>;
  normalizeProduct(product: ParsedProduct): Product;
}
