import { Test } from '@nestjs/testing';
import { ProductsService } from '../../src/services/products.interface.service';
import { ProductsRepository } from '../../src/repositories/products.abstract.repository';
import { DefaultProductsService } from '../../src/services/products.service';

const mockProductsRepository = {
  getAll: jest.fn(),
  get: jest.fn(),
};

const productsMock = [
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
];

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [
        DefaultProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();
    productsService = moduleRef.get<ProductsService>(DefaultProductsService);
  });

  afterEach(() => {
    mockProductsRepository.getAll.mockRestore();
    mockProductsRepository.get.mockRestore();
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      mockProductsRepository.getAll.mockImplementation(() =>
        Promise.resolve(productsMock),
      );

      const products = await productsService.getAll({ categoryId: undefined });
      expect(products).toEqual(productsMock);
    });

    it('should return products filtered by passed categoryId', async () => {
      mockProductsRepository.getAll.mockImplementation((predicate) =>
        Promise.resolve(productsMock.filter(predicate)),
      );

      const products = await productsService.getAll({
        categoryId: '33186d10-e4bf-4c07-9cca-df2fb2033067',
      });
      expect(products).toEqual([productsMock[1]]);
    });
  });

  describe('getById', () => {
    it('should return found product', async () => {
      mockProductsRepository.get.mockReturnValue(
        Promise.resolve(productsMock[0]),
      );

      const product = await productsService.getById(productsMock[0].id);
      expect(product).toEqual(productsMock[0]);
    });

    it('should return undefined when product with specified id does not exist', async () => {
      mockProductsRepository.get.mockReturnValue(Promise.resolve(undefined));

      const product = await productsService.getById(
        'c8c1770a-abb1-4dba-92e0-07528757db58',
      );
      expect(product).toBeUndefined();
    });
  });
});
