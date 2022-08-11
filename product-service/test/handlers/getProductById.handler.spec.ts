import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from '../../src/dto/product';
import { getProductById } from '../../src/handlers/getProductById.handler';
import { DefaultProductsService } from '../../src/services/products.service';

const mockEvent: APIGatewayProxyEvent = {
  body: '',
  resource: 'products/{id}',
  path: 'products/7567ec4b-b10c-48c5-9345-fc73c48a80aa',
  httpMethod: 'GET',
  isBase64Encoded: false,
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  pathParameters: {
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
  },
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
    path: 'products/7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    resourcePath: 'products/{id}',
    httpMethod: 'GET',
    apiId: '1234567890',
    protocol: 'HTTP/1.1',
  },
};

const context = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'getProductsList',
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
};

describe('getProductByIdHandler', () => {
  let getByIdSpy: jest.SpyInstance<Promise<Product | undefined>>;

  beforeEach(async () => {
    getByIdSpy = jest.spyOn(DefaultProductsService.prototype, 'getById');
  });

  afterEach(() => {
    getByIdSpy.mockRestore();
  });

  it('should return successful response with product', async () => {
    getByIdSpy.mockImplementation(() => Promise.resolve(productMock));
    const response = await getProductById(mockEvent, context);

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify(productMock),
      }),
    );
  });

  it('should set CORS headers', async () => {
    getByIdSpy.mockImplementation(() => Promise.resolve(productMock));
    const response = await getProductById(mockEvent, context);

    expect(response).toEqual(
      expect.objectContaining({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('should return 404 error when id of non existing product is passed', async () => {
    getByIdSpy.mockImplementation(() => Promise.resolve(undefined));

    const response = await getProductById(
      {
        ...mockEvent,
        pathParameters: {
          id: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        },
        path: 'products/c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestContext: {
          ...mockEvent.requestContext,
          path: 'products/c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        },
      },
      context,
    );

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 404,
        body: 'Product with id c6af9ac6-7b61-11e6-9a41-93e8deadbeef does not exist',
      }),
    );
  });

  it('should return "Bad request" error when id path param has incorrect format', async () => {
    getByIdSpy.mockImplementation(() => Promise.resolve(undefined));

    const response = await getProductById(
      {
        ...mockEvent,
        pathParameters: {
          id: '123',
        },
        path: 'products/123',
        requestContext: {
          ...mockEvent.requestContext,
          path: 'products/123',
        },
      },
      context,
    );

    const expectedErrorBody = {
      value: { id: '123' },
      path: 'id',
      type: 'uuid',
      errors: ['id must be a valid UUID'],
      params: { value: '123', originalValue: '123', path: 'id', regex: {} },
      inner: [],
      name: 'ValidationError',
      message: 'id must be a valid UUID',
    };

    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 400,
        body: JSON.stringify(expectedErrorBody),
      }),
    );
  });
});
