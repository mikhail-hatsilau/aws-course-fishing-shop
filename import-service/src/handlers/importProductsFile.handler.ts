import { HttpStatus } from '@nestjs/common';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { HTTPResponse } from '../helpers/response/httpResponse';
import { bootstrap } from './bootstrap';
import httpResponseSerializer from '@middy/http-response-serializer';
import inputOutputLogger from '@middy/input-output-logger';
import { defaultSerializers } from '../helpers/serializers';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';
import { fileNameQuerySchema } from '../dto/file';
import { FileUploadService } from '../services/fileUpload.interface.service';
import { DefaultFileUploadService } from '../services/fileUpload.service';
import { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from 'aws-lambda/trigger/api-gateway-proxy';
import { User } from '../dto/user';

const importProductsFileHandler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<
  User
> = async (event) => {
  try {
    const { queryStringParameters } = event;
    const app = await bootstrap();
    const validationService = app.get<YupValidationService>(ValidationService);

    let fileName: string;
    try {
      const validatedParams = await validationService.validate(
        fileNameQuerySchema,
        queryStringParameters,
      );
      fileName = validatedParams.fileName;
    } catch (error) {
      return new HTTPResponse(HttpStatus.BAD_REQUEST, error);
    }

    const fileUploadServiceService = app.get<FileUploadService>(
      DefaultFileUploadService,
    );
    const url = await fileUploadServiceService.getUploadUrl(fileName);

    return new HTTPResponse(HttpStatus.OK, url);
  } catch (e) {
    console.error('Error encountered: ', e);
    return new HTTPResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const importProductsFile = middy(importProductsFileHandler)
  .use(cors())
  .use(inputOutputLogger())
  .use(
    httpResponseSerializer({
      serializers: defaultSerializers,
      defaultContentType: 'application/json',
    }),
  );
