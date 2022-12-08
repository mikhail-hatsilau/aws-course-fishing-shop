import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { Handler } from 'aws-lambda';
import { bootstrap } from './bootstrap';
import { AuthorizationService } from '../services/authorization.interface.service';
import { BasicAuthorizationService } from '../services/basicAuthorization.service';
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda/trigger/api-gateway-authorizer';
import { PolicyBuilder } from '../helpers/policyBuilder.interface';
import { AwsPolicyBuilder } from '../helpers/awsPolicyBuilder';

const basicAuthorizerHandler: Handler<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
> = async (event) => {
  const app = await bootstrap();
  const { authorizationToken, methodArn } = event;
  const authorizationService = app.get<AuthorizationService>(
    BasicAuthorizationService,
  );
  const policyBuilder =
    app.get<PolicyBuilder<APIGatewayAuthorizerResult>>(AwsPolicyBuilder);

  if (!authorizationToken) {
    throw new Error('Unauthorized');
  }

  if (authorizationService.validateCredentials(authorizationToken)) {
    return policyBuilder.buildAllowPolicy(authorizationToken, methodArn);
  }

  return policyBuilder.buildDenyPolicy(authorizationToken, methodArn);
};

export const basicAuthorizer = middy(basicAuthorizerHandler).use(
  inputOutputLogger(),
);
