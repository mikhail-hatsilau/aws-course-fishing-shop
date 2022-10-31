import { AuthorizationService } from './authorization.interface.service';
import { Injectable } from '@nestjs/common';
import { Config } from '../helpers/config';

@Injectable()
export class BasicAuthorizationService implements AuthorizationService {
  constructor(private readonly config: Config) {}

  validateCredentials(token: string): boolean {
    const [userName, password] = this.getCredentialsFromToken(token);
    const [allowedUserName, allowedPassword] = this.splitCredentials(
      this.config.getEnvVariable('CREDENTIALS'),
    );
    return userName === allowedUserName && password === allowedPassword;
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
