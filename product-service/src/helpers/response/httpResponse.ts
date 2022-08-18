import { HttpStatus } from '@nestjs/common';
import {
  HandlerHTTPResponse,
  HTTPResponseOptions,
} from './httpResponse.interface';

export class HTTPResponse<T> implements HandlerHTTPResponse<T> {
  public statusCode?: number;
  public headers?: {
    [header: string]: boolean | number | string;
  };
  public body?: T;
  public isBase64Encoded?: boolean;
  public cookies?: string[];

  constructor(code: HttpStatus, body?: T, options: HTTPResponseOptions = {}) {
    const { headers, isBase64Encoded, cookies } = options;
    this.statusCode = code;
    this.body = body;
    this.headers = headers;
    this.isBase64Encoded = isBase64Encoded;
    this.cookies = cookies;
  }
}
