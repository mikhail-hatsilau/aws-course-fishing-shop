import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import cors from '@middy/http-cors';
import httpResponseSerializer from '@middy/http-response-serializer';
import { bootstrap } from './bootstrap';
import { DefaultCartService } from '../services/cart.service';
import {
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { User } from '../dto/user';
import { defaultSerializers } from '../helpers/serializers';
import { CartService } from '../services/cart.interface.service';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { HttpStatus } from '@nestjs/common';
import { Handler } from 'aws-lambda';

const listCartHandler: Handler<
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
    } = event;
    const cartService = app.get<CartService>(DefaultCartService);
    console.log(`Type: ${typeof id}`);
    console.log(`Getting cart for user ${id}`);
    const cart = await cartService.getUserCart(id);

    if (!cart) {
      return new HTTPResponse(HttpStatus.NO_CONTENT);
    }

    return new HTTPResponse(HttpStatus.OK, cart);
  } catch (e) {
    console.error('Error encountered: ', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const listCart = middy(listCartHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
