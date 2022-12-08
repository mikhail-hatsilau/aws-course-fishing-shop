import { PolicyBuilder } from './policyBuilder.interface';
import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsPolicyBuilder
  implements PolicyBuilder<APIGatewayAuthorizerResult>
{
  buildAllowPolicy(
    principal: string,
    resource: string,
  ): APIGatewayAuthorizerResult {
    return this.buildCommonPolicy(principal, resource, 'Allow');
  }

  buildDenyPolicy(
    principal: string,
    resource: string,
  ): APIGatewayAuthorizerResult {
    return this.buildCommonPolicy(principal, resource, 'Deny');
  }

  private buildCommonPolicy(
    principal: string,
    resource: string,
    effect: 'Allow' | 'Deny',
  ): APIGatewayAuthorizerResult {
    return {
      principalId: principal,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
    };
  }
}
