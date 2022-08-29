import { Client } from 'pg';
import { Inject, Injectable } from '@nestjs/common';
import getProductsQuery from '../scripts/getProducts.sql';
import getProductsByCategoryId from '../scripts/getProductsByCategoryId.sql';
import getProductById from '../scripts/getProductById.sql';
import createProduct from '../scripts/createProduct.sql';
import createImage from '../scripts/createImage.sql';
import createStock from '../scripts/createStock.sql';
import {
  CreateProductRequest,
  Product,
  ProductImage,
  ProductRow,
} from '../dto/product';
import { ProductsRepository } from './products.abstract.repository';

@Injectable()
export class PgProductsRepository implements ProductsRepository {
  constructor(@Inject('PG_CLIENT') private readonly client: Client) {}

  async getAll(query: Partial<Product> = {}): Promise<Product[]> {
    const { categoryId } = query;
    const sqlQuery = categoryId
      ? { text: getProductsByCategoryId, values: [categoryId] }
      : { text: getProductsQuery };
    const products = await this.client.query<ProductRow>(sqlQuery);
    return this.normalizeProductsResponse(products.rows);
  }
  async get(id: string): Promise<Product | undefined> {
    const productResult = await this.client.query<ProductRow>(getProductById, [
      id,
    ]);

    return this.normalizeProductsResponse(productResult.rows)[0];
  }

  async insert(product: CreateProductRequest): Promise<Product> {
    try {
      await this.client.query('BEGIN');
      const insertedProduct = await this.insertProduct(product);
      const finalProduct = await this.insertImages(insertedProduct);

      await this.client.query(createStock, [insertedProduct.id, product.count]);
      await this.client.query('COMMIT');

      return finalProduct;
    } catch (e) {
      await this.client.query('ROLLBACK');
      throw e;
    }
  }

  private async insertProduct(
    product: CreateProductRequest,
  ): Promise<CreateProductRequest & { id: string }> {
    const insertProductResponse = await this.client.query<{ id: string }>(
      createProduct,
      [product.title, product.description, product.price, product.categoryId],
    );

    return {
      ...product,
      id: insertProductResponse.rows[0].id,
    };
  }

  private async insertImages(
    product: CreateProductRequest & { id: string },
  ): Promise<Product> {
    const insertImagesResponse = await Promise.all(
      product.images.map((image) =>
        this.client.query<{ id: string }>(createImage, [
          image.source,
          product.id,
          image.main,
        ]),
      ),
    );

    return {
      ...product,
      images: insertImagesResponse.map((imageResponse, index) => ({
        ...product.images[index],
        id: imageResponse.rows[0].id,
      })),
    };
  }

  private normalizeProductsResponse(rows: ProductRow[]): Product[] {
    const groupedProductsWithImages = rows.reduce(
      (aggregator, row) => ({
        ...aggregator,
        [row.id]: aggregator[row.id]
          ? {
              ...aggregator[row.id],
              images: [
                ...aggregator[row.id].images,
                {
                  id: row.image_id,
                  source: row.image_source,
                  main: row.main_image,
                },
              ],
            }
          : {
              ...row,
              images: [
                {
                  id: row.image_id,
                  source: row.image_source,
                  main: row.main_image,
                },
              ],
            },
      }),
      {} as Record<string, ProductRow & { images: ProductImage[] }>,
    );

    return Object.values(groupedProductsWithImages).map(
      ({ id, title, description, count, images, category_id, price }) => ({
        id,
        title,
        description,
        count,
        categoryId: category_id,
        images,
        price,
      }),
    );
  }
}
