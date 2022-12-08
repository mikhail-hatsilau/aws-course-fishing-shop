import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import cors from '@middy/http-cors';
import httpResponseSerializer from '@middy/http-response-serializer';
import { bootstrap } from './bootstrap';
import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { User } from '../dto/user';
import { defaultSerializers } from '../helpers/serializers';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { HttpStatus } from '@nestjs/common';
import { Handler } from 'aws-lambda';
import { CartService } from '../services/cart.interface.service';
import { DefaultCartService } from '../services/cart.service';
import { CartError } from '../helpers/errors/productError';

const removeFromCartHandler: Handler<
  APIGatewayProxyEventV2WithRequestContext<
    APIGatewayEventRequestContextV2WithAuthorizer<User>
  >
> = async (event) => {
  try {
    const app = await bootstrap();
    const {
      requestContext: {
        authorizer: { id },
      },
      pathParameters,
    } = event;
    const { cartItemId } = pathParameters as { cartItemId: string };

    if (!cartItemId) {
      return new HTTPResponse(
        HttpStatus.BAD_REQUEST,
        'cartItemId path parameter is missing',
      );
    }

    const cartService = app.get<CartService>(DefaultCartService);
    console.log(`Deleting cart item with id ${cartItemId}`);
    await cartService.removeFromCart(id, cartItemId);
  } catch (e) {
    if (e instanceof CartError) {
      return new HTTPResponse(HttpStatus.BAD_REQUEST, e.message);
    }

    console.error('Error encountered: ', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const removeFromCart = middy(removeFromCartHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
