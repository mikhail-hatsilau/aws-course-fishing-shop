import { Injectable } from '@nestjs/common';
import { Product } from '../dto/product';
import { ProductsRepository } from './products.abstract.repository';

const products: Product[] = [
  {
    description: 'Salmo Extreme BP Feeder 090 3.60 / 3133-360',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    price: 110,
    title: 'Salmo Extreme BP Feeder 090 3.60 / 3133-360',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 1,
  },
  {
    description: 'Feeder SE F1',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 3,
    title: 'Feeder SE F1',
    categoryId: '33186d10-e4bf-4c07-9cca-df2fb2033067',
    count: 4,
  },
  {
    description: 'Feeder Concept Distance 70 3.60 / FCDI070-360',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
    price: 100,
    title: 'Feeder Concept Distance 70 3.60 / FCDI070-360',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 10,
  },
  {
    description: 'Salmo Diamond BP Feeder 090 3.90 / 4029-390',
    id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
    price: 60,
    title: 'Salmo Diamond BP Feeder 090 3.90 / 4029-390',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 3,
  },
  {
    description: 'Salmo Extreme BP Feeder 150 3.60 / 3138-360',
    id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
    price: 60,
    title: 'Salmo Extreme BP Feeder 150 3.60 / 3138-360',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 10,
  },
  {
    description: 'Robinson Carbonic Feeder 3+3g / 1CB-FE-392',
    id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
    price: 50,
    title: 'Robinson Carbonic Feeder 3+3g / 1CB-FE-392',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 2,
  },
];

@Injectable()
export class MockProductsRepository implements ProductsRepository {
  async getAll(query?: (product: Product) => boolean): Promise<Product[]> {
    return query ? products.filter(query) : products;
  }
  async get(id: string): Promise<Product | undefined> {
    return products.find((product) => product.id === id);
  }
}
