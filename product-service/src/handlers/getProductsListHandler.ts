import { APIGatewayProxyEvent } from 'aws-lambda';
import { ProductsService } from '../services/products.service';
import { bootstrap } from './bootstrap';

export const getProductsList = async (event: APIGatewayProxyEvent) => {
  const { queryStringParameters } = event;
  const app = await bootstrap();
  const productsService = app.get(ProductsService);
  const products = await productsService.getAll({ ...queryStringParameters });

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
