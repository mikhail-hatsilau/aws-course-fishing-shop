import { Injectable } from '@nestjs/common';
import { ProductsFilter } from '../interfaces/productsFilter';
import { Product } from '../dto/product';

const products: Product[] = [
  {
    description: 'Shimano SLX Casting Rod',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    price: 24,
    title: 'ProductOne',
    categoryId: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
  },
  {
    description: 'Short Product Description7',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 15,
    title: 'ProductTitle',
    categoryId: '33186d10-e4bf-4c07-9cca-df2fb2033067',
  },
  {
    description: 'Short Product Description2',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
    price: 23,
    title: 'Product',
    categoryId: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
  },
  {
    description: 'Short Product Description4',
    id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
    price: 15,
    title: 'ProductTest',
    categoryId: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
  },
  {
    description: 'Short Product Descriptio1',
    id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
    price: 23,
    title: 'Product2',
    categoryId: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
  },
  {
    description: 'Short Product Description7',
    id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
    price: 15,
    title: 'ProductName',
    categoryId: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
  },
];

@Injectable()
export class ProductsService {
  async getAll(filter: ProductsFilter): Promise<Product[]> {
    const { categoryId } = filter;
    return categoryId
      ? products.filter((product) => product.categoryId === categoryId)
      : products;
  }
}
