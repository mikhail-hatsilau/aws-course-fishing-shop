import { DynamoDBDocument, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Config } from '../helpers/config';
import { CreateProductRequest, Product } from '../dto/product';
import { ProductsRepository } from './products.abstract.repository';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import {
  ProductError,
  ProductErrorCodes,
} from '../helpers/errors/productError';

@Injectable()
export class DynamoProductsRepository implements ProductsRepository {
  constructor(
    @Inject('DYNAMO_CLIENT') private readonly client: DynamoDBDocument,
    private readonly config: Config,
  ) {}

  async getAll(query: Partial<Product> = {}): Promise<Product[]> {
    if (Object.keys(query).length) {
      return this.queryProductsByKeys(query);
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
      TransactItems: [
        {
          Put: {
            TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
            ConditionExpression: 'attribute_not_exists(id)',
            Item: newProductItem,
          },
        },
        {
          Put: {
            TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
            ConditionExpression: 'attribute_not_exists(id)',
            Item: {
              id: `title#${newProductItem.title}`,
              title: newProductItem.title,
            },
          },
        },
      ],
    };

    try {
      await this.client.transactWrite(params);
    } catch (e) {
      if (
        e instanceof TransactionCanceledException &&
        e.CancellationReasons?.[1]?.Code === 'ConditionalCheckFailed'
      ) {
        throw new ProductError(ProductErrorCodes.NOT_UNIQ, e.message);
      }
      throw e;
    }

    return newProductItem;
  }

  private async scanProducts(): Promise<Product[]> {
    const params = {
      TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
      FilterExpression: '#count > :count',
      IndexName: 'ProductsCount',
      ExpressionAttributeNames: {
        '#count': 'count',
      },
      ExpressionAttributeValues: {
        ':count': 0,
      },
    };

    const data = await this.client.scan(params);
    return data.Items as Product[];
  }

  private async queryProductsByKeys(
    query: Partial<Product>,
  ): Promise<Product[]> {
    const params = {
      ...Object.keys(query).reduce(
        (result, key) => ({
          ...result,
          ExpressionAttributeValues: {
            ...result.ExpressionAttributeValues,
            [`:${key}`]: query[key as keyof typeof query],
          },
          ExpressionAttributeNames: {
            ...result.ExpressionAttributeNames,
            [`#${key}`]: key,
          },
        }),
        {} as QueryCommandInput,
      ),
      IndexName: 'ProductsCategory', // TODO: use dynamic indexes for dynamic expressions
      KeyConditionExpression: Object.keys(query).reduce(
        (result, key) =>
          result ? `${result} and #${key} = :${key}` : `#${key} = :${key}`,
        '',
      ),
      TableName: this.config.getEnvVariable('PRODUCTS_TABLE_NAME'),
    };

    const data = await this.client.query(params);

    return data.Items as Product[];
  }
}
