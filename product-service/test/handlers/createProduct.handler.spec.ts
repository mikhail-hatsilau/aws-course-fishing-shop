import { Product } from '../../src/dto/product';
import { bootstrap } from '../../src/handlers/bootstrap';
import { createProduct } from '../../src/handlers/createProduct.handler';
import { DefaultProductsService } from '../../src/services/products.service';
import { ProductsRepository } from '../../src/repositories/products.abstract.repository';
import { MockProductsRepository } from '../mocks/productsMock.repository';
import { Config } from '../../src/helpers/config';
import { ValidationService } from '../../src/services/validation.abstract.service';
import { YupValidationService } from '../../src/services/yupValidation.service';
import { Test } from '@nestjs/testing';
import { Event } from '@middy/http-json-body-parser';

jest.mock('../../src/handlers/bootstrap', () => {
  return {
    bootstrap: jest.fn(),
  };
});

const mockEvent: Event = {
  rawBody: '{}',
  body: {},
  resource: 'products/',
  path: 'products/',
  httpMethod: 'POST',
  isBase64Encoded: false,
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  pathParameters: {},
  stageVariables: {},
  headers: {},
  multiValueHeaders: {},
  requestContext: {
    authorizer: null,
    accountId: '123456789012',
    resourceId: '123456',
    stage: 'dev',
    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
    requestTime: '09/Apr/2015:12:34:56 +0000',
    requestTimeEpoch: 1428582896000,
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      accessKey: null,
      sourceIp: '127.0.0.1',
      apiKey: '',
      apiKeyId: '',
      clientCert: null,
      principalOrgId: '',
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'Custom User Agent String',
      user: null,
    },
    path: 'products/',
    resourcePath: 'products/',
    httpMethod: 'GET',
    apiId: '1234567890',
    protocol: 'HTTP/1.1',
  },
};

const context = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'createProduct',
  functionVersion: '1',
  invokedFunctionArn: 'arn',
  memoryLimitInMB: '100',
  awsRequestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
  logGroupName: 'logGroup',
  logStreamName: 'streamName',
  getRemainingTimeInMillis: jest.fn(),
  done: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
};

const productMock = {
  description: 'Salmo Extreme BP Feeder 090 3.60 / 3133-360',
  id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
  price: 110,
  title: 'Salmo Extreme BP Feeder 090 3.60 / 3133-360',
  categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
  count: 1,
  images: [],
};

describe('createProductHandler', () => {
  let createProductSpy: jest.SpyInstance<Promise<Product | undefined>>;

  beforeEach(async () => {
    (bootstrap as jest.Mock).mockImplementation(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [],
        providers: [
          Config,
          DefaultProductsService,
          { provide: ValidationService, useClass: YupValidationService },
          { provide: ProductsRepository, useClass: MockProductsRepository },
        ],
      }).compile();
      return moduleRef;
    });
    createProductSpy = jest.spyOn(
      DefaultProductsService.prototype,
      'createProduct',
    );
  });

  afterEach(() => {
    createProductSpy.mockRestore();
  });

  it('should create product successfully', async () => {
    createProductSpy.mockImplementation(() => Promise.resolve(productMock));
    const event = {
      ...mockEvent,
      rawBody: JSON.stringify(productMock),
      body: productMock,
    };
    const response = await createProduct(event, context);

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(productMock),
      }),
    );
  });

  it('should set CORS headers', async () => {
    createProductSpy.mockImplementation(() => Promise.resolve(productMock));
    const response = await createProduct(mockEvent, context);

    expect(response).toEqual(
      expect.objectContaining({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('should return 400 when incorrect product is passed', async () => {
    createProductSpy.mockImplementation(() => Promise.resolve(undefined));

    const incorrectProduct = {
      description: 'Salmo Extreme BP Feeder 090 3.60 / 3133-360',
      categoryId: 'c8c1770a-abb1-4dba-92e0-07528757db58',
      count: 1,
      images: [],
    };
    const response = await createProduct(
      {
        ...mockEvent,
        rawBody: JSON.stringify(incorrectProduct),
        body: incorrectProduct,
      },
      context,
    );

    expect(response).toMatchSnapshot();
  });
});
