import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import cors from '@middy/http-cors';
import httpResponseSerializer from '@middy/http-response-serializer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { bootstrap } from './bootstrap';
import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { User } from '../dto/user';
import { defaultSerializers } from '../helpers/serializers';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { HttpStatus } from '@nestjs/common';
import { CartService } from '../services/cart.interface.service';
import { DefaultCartService } from '../services/cart.service';
import {
  UpdateCartItemRequest,
  updateCartItemRequestSchema,
} from '../dto/cart';
import { ValidationService } from '../services/validation.abstract.service';

const updateCartHandler: Handler<
  Omit<
    APIGatewayEvent &
      APIGatewayProxyEventV2WithRequestContext<
        APIGatewayEventRequestContextV2WithAuthorizer<User>
      >,
    'body'
  > & { body: UpdateCartItemRequest; rawBody: string }
> = async (event) => {
  try {
    const app = await bootstrap();
    const {
      requestContext: {
        authorizer: { id },
      },
      body: cartItemRequest,
    } = event;

    const validationService =
      app.get<ValidationService<typeof updateCartItemRequestSchema>>(
        ValidationService,
      );

    try {
      await validationService.validate(
        updateCartItemRequestSchema,
        cartItemRequest,
      );
    } catch (e) {
      return new HTTPResponse(HttpStatus.BAD_REQUEST, e);
    }

    const cartService = app.get<CartService>(DefaultCartService);
    console.log(`Updating cart item with id ${cartItemRequest.id}`);
    const updatedItem = await cartService.updateCartItem(id, cartItemRequest);

    return new HTTPResponse(HttpStatus.OK, updatedItem);
  } catch (e) {
    console.error('Error encountered: ', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const updateCart = middy(updateCartHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(httpJsonBodyParser())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
