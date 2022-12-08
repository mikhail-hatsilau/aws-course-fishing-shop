import { Injectable } from '@nestjs/common';
import { EnvVariables } from '../types/envVariables';

@Injectable()
export class Config {
  getEnvVariable(name: keyof EnvVariables) {
    return process.env[name] as EnvVariables[typeof name];
  }
}
