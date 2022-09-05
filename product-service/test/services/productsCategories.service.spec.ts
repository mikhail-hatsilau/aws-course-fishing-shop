import { Test } from '@nestjs/testing';
import { DefaultProductsCategoriesService } from '../../src/services/productCategories.service';
import { ProductsCategoriesService } from '../../src/services/productsCategories.interface.service';
import { ProductsCategoriesRepository } from '../../src/repositories/productsCategories.abstract.repository';
import { ProductsService } from '../../src/services/products.interface.service';
import { DefaultProductsService } from '../../src/services/products.service';

const mockProductsCategoriesRepository = {
  getAll: jest.fn(),
  get: jest.fn(),
};

const categoriesMock = [
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
];

describe('ProductsCategoriesService', () => {
  let productsCategoriesService: ProductsCategoriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [
        DefaultProductsCategoriesService,
        {
          provide: ProductsCategoriesRepository,
          useValue: mockProductsCategoriesRepository,
        },
      ],
    }).compile();
    productsCategoriesService = moduleRef.get<ProductsCategoriesService>(
      DefaultProductsCategoriesService,
    );
  });

  afterEach(() => {
    mockProductsCategoriesRepository.getAll.mockRestore();
    mockProductsCategoriesRepository.get.mockRestore();
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      mockProductsCategoriesRepository.getAll.mockImplementation(() =>
        Promise.resolve(categoriesMock),
      );

      const categories = await productsCategoriesService.getAll();
      expect(categories).toEqual(categoriesMock);
    });
  });

  describe('getById', () => {
    it('should return found category', async () => {
      mockProductsCategoriesRepository.get.mockReturnValue(
        Promise.resolve(categoriesMock[0]),
      );

      const category = await productsCategoriesService.getById(
        categoriesMock[0].id,
      );
      expect(category).toEqual(categoriesMock[0]);
    });

    it('should return undefined when category with specified id does not exist', async () => {
      mockProductsCategoriesRepository.get.mockReturnValue(
        Promise.resolve(undefined),
      );

      const category = await productsCategoriesService.getById(
        'a8c1770a-abb1-4dba-92e0-07528757db58',
      );
      expect(category).toBeUndefined();
    });
  });
});
