import { ProductCategory } from 'src/dto/productCategory';

export interface ProductsCategoriesService {
  getAll(): Promise<ProductCategory[]>;
  getById(id: string): Promise<ProductCategory | undefined>;
}
