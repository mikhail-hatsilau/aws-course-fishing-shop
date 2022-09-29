import { Injectable } from '@nestjs/common';
import { ProductCategory } from 'src/dto/productCategory';
import { ProductsCategoriesRepository } from './productsCategories.abstract.repository';

const productCategories: ProductCategory[] = [
  {
    id: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
    title: 'Rods',
    parentId: null,
  },
  {
    id: 'c8c1770a-abb1-4dba-92e0-07528757db58',
    title: 'Feeder Rods',
    parentId: 'fbf7b857-c7d5-492d-a1aa-ff835effa02e',
  },
  {
    id: 'c6d8845f-ba43-43ba-8f29-f7d3bd559cb8',
    title: 'Lure',
    parentId: null,
  },
  {
    id: '33186d10-e4bf-4c07-9cca-df2fb2033067',
    title: 'Feeder',
    parentId: 'c6d8845f-ba43-43ba-8f29-f7d3bd559cb8',
  },
];

@Injectable()
export class MockProductsCategoriesRepository
  implements ProductsCategoriesRepository
{
  async getAll(): Promise<ProductCategory[]> {
    return productCategories;
  }
  async get(id: string): Promise<ProductCategory | undefined> {
    return productCategories.find((category) => category.id === id);
  }
  insert(_data: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    throw new Error('Method not implemented.');
  }
}
