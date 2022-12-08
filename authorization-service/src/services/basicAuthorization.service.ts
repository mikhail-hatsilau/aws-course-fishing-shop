import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { AuthorizationService } from './authorization.interface.service';
import { Config } from '../helpers/config';
import { MemoryUsersRepository } from '../repositories/memoryUsers.repository';
import { User } from '../dto/user';

@Injectable()
export class BasicAuthorizationService implements AuthorizationService {
  constructor(
    private readonly config: Config,
    private readonly usersRepository: MemoryUsersRepository,
  ) {}

  async findUser(token: string): Promise<User | undefined> {
    const [userName, password] = this.getCredentialsFromToken(token);
    const users = await this.usersRepository.getAll();

    const user = users.find((user) => user.username === userName);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return undefined;
  }

  private getCredentialsFromToken(token: string) {
    const decodedCredentials = this.decodeCredentials(
      this.extractCredentials(token),
    );
    return this.splitCredentials(decodedCredentials);
  }

  private extractCredentials(token: string) {
    const [, credentials] = token.split(' ');
    return credentials;
  }

  private decodeCredentials(credentialsBase64: string) {
    const buffer = Buffer.from(credentialsBase64, 'base64');
    return buffer.toString('utf8');
  }

  private splitCredentials(credentials: string) {
    return credentials.split(':');
  }
}
