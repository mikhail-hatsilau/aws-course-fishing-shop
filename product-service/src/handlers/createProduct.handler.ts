import { HttpStatus } from '@nestjs/common';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpJsonBodyParser, { Event } from '@middy/http-json-body-parser';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { bootstrap } from './bootstrap';
import httpResponseSerializer from '@middy/http-response-serializer';
import inputOutputLogger from '@middy/input-output-logger';
import { defaultSerializers } from '../helpers/serializers';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';
import {
  CreateProductRequest,
  createProductRequestSchema,
} from '../dto/product';
import { ProductsService } from '../services/products.interface.service';
import { DefaultProductsService } from '../services/products.service';

const createProductHandler = async (event: Event) => {
  try {
    const { body } = event;
    const app = await bootstrap();
    const validationService = app.get<YupValidationService>(ValidationService);

    try {
      await validationService.validate(createProductRequestSchema, body);
    } catch (error) {
      return new HTTPResponse(HttpStatus.BAD_REQUEST, error);
    }

    const product = body as CreateProductRequest;
    const productsService = app.get<ProductsService>(DefaultProductsService);
    const createdProduct = await productsService.createProduct(product);

    return new HTTPResponse(HttpStatus.OK, createdProduct);
  } catch (e) {
    console.error('Error encountered: ', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const createProduct = middy(createProductHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(httpJsonBodyParser())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
