import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Config } from '../helpers/config';
import { CreateProductRequest, Product } from '../dto/product';
import { ProductsRepository } from './products.abstract.repository';

@Injectable()
export class DynamoProductsRepository implements ProductsRepository {
  constructor(
    @Inject('DYNAMO_CLIENT') private readonly client: DynamoDBDocument,
    private readonly config: Config,
  ) {}

  async getAll(query: Partial<Product> = {}): Promise<Product[]> {
    const { categoryId } = query;
    if (categoryId) {
      return this.queryProductsByCategoryId(categoryId);
    }

    return this.scanProducts();
  }
  async get(id: string): Promise<Product | undefined> {
    const params = {
      ExpressionAttributeValues: {
        ':id': id,
      },
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
    };
    const data = await this.client.query(params);
    return data.Items?.[0] as Product | undefined;
  }
  async insert(product: CreateProductRequest): Promise<Product> {
    const newProductItem = {
      id: uuidv4(),
      ...{
        ...product,
        images: product.images.map((image) => ({ id: uuidv4(), ...image })),
      },
    };
    const params = {
      TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
      Item: {
        id: uuidv4(),
        ...{
          ...product,
          images: product.images.map((image) => ({ id: uuidv4(), ...image })),
        },
      },
    };

    await this.client.put(params);

    return newProductItem;
  }

  private async scanProducts(): Promise<Product[]> {
    const params = {
      TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
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
      TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
    };

    const data = await this.client.query(params);

    return data.Items as Product[];
  }
}
