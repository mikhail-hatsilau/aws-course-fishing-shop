import { Product } from '../dto/product';

export interface ProductNotificationService {
  notifyProductsCreated(products: Product[]): Promise<void>;
}
