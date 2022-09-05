import { Injectable } from '@nestjs/common';
import { BaseSchema } from 'yup';
import { ValidationService } from './validation.abstract.service';

@Injectable()
export class YupValidationService implements ValidationService<BaseSchema> {
  async validate<S extends BaseSchema, T>(schema: S, data: T) {
    return schema.validate(data);
  }
}
