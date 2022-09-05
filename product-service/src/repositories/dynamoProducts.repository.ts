import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import { CreateProductRequest, Product } from '../dto/product';
import { ProductsRepository } from './products.abstract.repository';

const PRODUCTS_TABLE_NAME = 'products-dev';

@Injectable()
export class DynamoProductsRepository implements ProductsRepository {
  constructor(
    @Inject('DYNAMO_CLIENT') private readonly client: DynamoDBDocument,
  ) {}

  async getAll(query: Partial<Product> = {}): Promise<Product[]> {
    const { categoryId } = query;
    if (categoryId) {
      return this.queryProductsByCategoryId(categoryId);
    }

    return this.scanProducts();
  }
  async get(id: string): Promise<Product | undefined> {
    return undefined;
  }
  async insert(product: CreateProductRequest): Promise<Product> {
    throw new Error('Method not implemented');
  }

  private async scanProducts(): Promise<Product[]> {
    const params = {
      TableName: PRODUCTS_TABLE_NAME,
    };

    const data = await this.client.scan(params);
    return data.Items as Product[];
  }

  private async queryProductsByCategoryId(
    categoryId: string,
  ): Promise<Product[]> {
    const params = {
      ExpressionAttributeValues: {
        ':categoryId': categoryId,
      },
      IndexName: 'ProductsCategory',
      KeyConditionExpression: '#categoryId = :categoryId',
      ExpressionAttributeNames: {
        '#categoryId': 'categoryId',
      },
      TableName: PRODUCTS_TABLE_NAME,
    };

    const data = await this.client.query(params);

    return data.Items as Product[];
  }
}
