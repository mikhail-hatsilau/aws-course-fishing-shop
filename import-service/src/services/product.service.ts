import { ProductService } from './product.interface.service';
import { Injectable } from '@nestjs/common';
import { ParsedProduct, Product } from '../dto/product';
import { QueueRepository } from '../repositories/queue.abstract.repository';

const IMAGE_ITEM_SPLITTER = ';';
const IMAGE_SPLITTER = '|';

@Injectable()
export class DefaultProductService implements ProductService {
  constructor(private readonly repository: QueueRepository<Product>) {}

  normalizeProduct(product: ParsedProduct): Product {
    const { images } = product;
    const imagesList = images.split(IMAGE_ITEM_SPLITTER);
    return {
      ...product,
      count: Number(product.count),
      price: Number(product.price),
      images: imagesList.map((imageItem) => {
        const [source, isMain] = imageItem.split(IMAGE_SPLITTER);
        return { source, main: isMain === 'true' };
      }),
    };
  }

  async sendImportedProducts(products: Product[]): Promise<void> {
    await Promise.all(products.map((product) => this.repository.send(product)));
  }
}
