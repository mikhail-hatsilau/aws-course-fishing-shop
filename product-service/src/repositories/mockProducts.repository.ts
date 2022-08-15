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
    images: [
      {
        id: 'fba6311a-f62e-47b0-84a3-9747adf18e91',
        source:
          'https://d3l7qw9cnbm9m7.cloudfront.net/salmo_extreme_feeder_bp_090.webp',
        main: true,
      },
    ],
  },
  {
    description: 'RS Sport Feeder',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 3,
    title: 'RS Sport Feeder',
    categoryId: '33186d10-e4bf-4c07-9cca-df2fb2033067',
    count: 4,
    images: [
      {
        id: 'fba6311a-f62e-47b0-84a3-9747adf18e91',
        source:
          'https://d3l7qw9cnbm9m7.cloudfront.net/rs_sport_feeder_reka.webp',
        main: true,
      },
    ],
  },
  {
    description: 'Feeder Concept Distance 70 3.60 / FCDI070-360',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
    price: 100,
    title: 'Feeder Concept Distance 70 3.60 / FCDI070-360',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 10,
    images: [
      {
        id: 'fba6311a-f62e-47b0-84a3-9747adf18e91',
        source:
          'https://d3l7qw9cnbm9m7.cloudfront.net/feeder_concept_distance_70.webp',
        main: true,
      },
    ],
  },
  {
    description: 'Salmo Diamond BP Feeder 090 3.90 / 4029-390',
    id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
    price: 60,
    title: 'Salmo Diamond BP Feeder 090 3.90 / 4029-390',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 3,
    images: [
      {
        id: 'fba6311a-f62e-47b0-84a3-9747adf18e91',
        source:
          'https://d3l7qw9cnbm9m7.cloudfront.net/salmo_diamond_bp_feeder_090.webp',
        main: true,
      },
    ],
  },
  {
    description: 'Salmo Extreme BP Feeder 150 3.60 / 3138-360',
    id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
    price: 60,
    title: 'Salmo Extreme BP Feeder 150 3.60 / 3138-360',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 10,
    images: [
      {
        id: 'fba6311a-f62e-47b0-84a3-9747adf18e91',
        source:
          'https://d3l7qw9cnbm9m7.cloudfront.net/salmo_extreme_bp_feeder_150.webp',
        main: true,
      },
    ],
  },
  {
    description: 'Robinson Carbonic Feeder 3+3g / 1CB-FE-392',
    id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
    price: 50,
    title: 'Robinson Carbonic Feeder 3+3g / 1CB-FE-392',
    categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    count: 2,
    images: [
      {
        id: 'fba6311a-f62e-47b0-84a3-9747adf18e91',
        source:
          'https://d3l7qw9cnbm9m7.cloudfront.net/robinson_carbonic_feeder_3_3_g.webp',
        main: true,
      },
    ],
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
