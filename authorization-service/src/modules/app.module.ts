import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { BasicAuthorizationService } from '../services/basicAuthorization.service';
import { AwsPolicyBuilder } from '../helpers/awsPolicyBuilder';
import { MemoryUsersRepository } from '../repositories/memoryUsers.repository';

@Module({
  providers: [
    Config,
    BasicAuthorizationService,
    AwsPolicyBuilder,
    MemoryUsersRepository,
  ],
})
export class AppModule {}
