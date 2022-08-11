import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from '../../src/dto/product';
import { getProductsList } from '../../src/handlers/getProductsList.handler';
import { DefaultProductsService } from '../../src/services/products.service';

const mockEvent: APIGatewayProxyEvent = {
  body: '',
  resource: 'products/',
  path: '',
  httpMethod: 'GET',
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
    resourcePath: '',
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
  getRemainingTimeInMillis: jest.fn().mockReturnValue(0),
  done: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn(),
};

const getAllProductsServiceMockData = [
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

describe('getProductsListHandler', () => {
  let getAllSpy: jest.SpyInstance<Promise<Product[]>>;

  beforeEach(async () => {
    getAllSpy = jest
      .spyOn(DefaultProductsService.prototype, 'getAll')
      .mockImplementation(() => Promise.resolve(getAllProductsServiceMockData));
  });

  afterEach(() => {
    getAllSpy.mockRestore();
  });

  it('should return success response with the list of products', async () => {
    const response = await getProductsList(mockEvent, context);

    expect(response).toEqual(
      expect.objectContaining({
        body: JSON.stringify(getAllProductsServiceMockData),
      }),
    );
  });

  it('should return success response when valid categoryId query params is passed', async () => {
    const response = await getProductsList(
      {
        ...mockEvent,
        queryStringParameters: {
          categoryId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbee1',
        },
      },
      context,
    );

    expect(response).toEqual(
      expect.objectContaining({
        body: JSON.stringify(getAllProductsServiceMockData),
      }),
    );
  });

  it('should set CORS headers', async () => {
    const response = await getProductsList(mockEvent, context);

    expect(response).toEqual(
      expect.objectContaining({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('should set CORS headers with "Bad request" response', async () => {
    const response = await getProductsList(
      {
        ...mockEvent,
        queryStringParameters: {
          categoryId: '123',
        },
      },
      context,
    );

    expect(response).toEqual(
      expect.objectContaining({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('should return "Bad request" response when incorrect categoryId query param is passed', async () => {
    const response = await getProductsList(
      {
        ...mockEvent,
        queryStringParameters: {
          categoryId: '123',
        },
      },
      context,
    );

    const expectedErrorBody = {
      value: { categoryId: '123' },
      path: 'categoryId',
      type: 'uuid',
      errors: ['categoryId must be a valid UUID'],
      params: {
        value: '123',
        originalValue: '123',
        path: 'categoryId',
        regex: {},
      },
      inner: [],
      name: 'ValidationError',
      message: 'categoryId must be a valid UUID',
    };

    expect(response).toEqual(
      expect.objectContaining({
        body: JSON.stringify(expectedErrorBody),
        statusCode: 400,
      }),
    );
  });
});
