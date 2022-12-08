import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { BasicAuthorizationService } from '../services/basicAuthorization.service';
import { AwsPolicyBuilder } from '../helpers/awsPolicyBuilder';

@Module({
  providers: [Config, BasicAuthorizationService, AwsPolicyBuilder],
})
export class AppModule {}
