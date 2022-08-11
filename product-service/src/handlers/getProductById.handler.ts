import { HttpStatus } from '@nestjs/common';
import { APIGatewayProxyEvent } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import {
  GetProductByIdPathParams,
  getProductByIdPathParamsSchema,
} from '../dto/productsFilter';
import { HTTPResponse } from '../response/httpResponse';
import { DefaultProductsService } from '../services/products.service';
import { bootstrap } from './bootstrap';
import httpErrorHandler from '@middy/http-error-handler';
import httpResponseSerializer from '@middy/http-response-serializer';
import createHttpError from 'http-errors';
import { defaultSerializers } from '../utils/serializers';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';

const getProductByIdHandler = async (event: APIGatewayProxyEvent) => {
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
    throw createHttpError(HttpStatus.BAD_REQUEST, {
      message: JSON.stringify(error),
    });
  }

  const productsService = await app.resolve(DefaultProductsService);
  const product = await productsService.getById(pathParams.id);

  if (!product) {
    throw createHttpError(
      HttpStatus.NOT_FOUND,
      `Product with id ${pathParameters?.id} does not exist`,
    );
  }

  return new HTTPResponse(HttpStatus.OK, product);
};

export const getProductById = middy(getProductByIdHandler)
  .use(cors())
  .use(httpErrorHandler())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
