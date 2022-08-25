import { HttpStatus } from '@nestjs/common';
import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import {
  GetProductByIdPathParams,
  getProductByIdPathParamsSchema,
} from '../dto/productsFilter';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { DefaultProductsService } from '../services/products.service';
import { bootstrap } from './bootstrap';
import httpResponseSerializer from '@middy/http-response-serializer';
import inputOutputLogger from '@middy/input-output-logger';
import { defaultSerializers } from '../helpers/serializers';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';

const getProductByIdHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const { pathParameters } = event;
    const app = await bootstrap();
    const validationService = app.get<YupValidationService>(ValidationService);

    let pathParams: GetProductByIdPathParams;
    try {
      pathParams = await validationService.validate(
        getProductByIdPathParamsSchema,
        pathParameters,
      );
    } catch (error) {
      return new HTTPResponse(HttpStatus.BAD_REQUEST, error);
    }

    const productsService = await app.resolve(DefaultProductsService);
    const product = await productsService.getById(pathParams.id);

    if (!product) {
      return new HTTPResponse(
        HttpStatus.NOT_FOUND,
        `Product with id ${pathParameters?.id} does not exist or out of stock`,
      );
    }

    return new HTTPResponse(HttpStatus.OK, product);
  } catch (e) {
    console.error('Error encountered: ', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const getProductById = middy(getProductByIdHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
