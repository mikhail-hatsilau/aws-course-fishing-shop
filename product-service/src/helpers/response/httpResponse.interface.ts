import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export interface HTTPResponseOptions {
  headers?: {
    [header: string]: boolean | number | string;
  };
  isBase64Encoded?: boolean;
  cookies?: string[];
}

export interface HandlerHTTPResponse<T>
  extends Omit<APIGatewayProxyStructuredResultV2, 'body'> {
  body?: T;
}
