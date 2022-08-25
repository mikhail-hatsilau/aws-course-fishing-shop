import { APIGatewayProxyEvent } from 'aws-lambda';
import { DefaultProductsService } from '../services/products.service';
import { bootstrap } from './bootstrap';
import { GetProductsFilter, getProductsSchema } from '../dto/productsFilter';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { HttpStatus } from '@nestjs/common';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpResponseSerializer from '@middy/http-response-serializer';
import inputOutputLogger from '@middy/input-output-logger';
import { defaultSerializers } from '../helpers/serializers';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';

const getProductsListHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const { queryStringParameters } = event;
    const app = await bootstrap();

    const validationService = app.get<YupValidationService>(ValidationService);

    let queryParams: GetProductsFilter;
    try {
      queryParams = await validationService.validate(
        getProductsSchema,
        queryStringParameters || {},
      );
    } catch (error) {
      return new HTTPResponse(HttpStatus.BAD_REQUEST, error);
    }

    const productsService = app.get(DefaultProductsService);
    const products = await productsService.getAll({ ...queryParams });

    return new HTTPResponse(HttpStatus.OK, products);
  } catch (e) {
    console.error('Error Encountered', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const getProductsList = middy(getProductsListHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
