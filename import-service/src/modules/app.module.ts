import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';
import { S3Module } from './s3.module';
import { DefaultFileUploadService } from '../services/fileUpload.service';
import { GenericRepository } from '../repositories/generic.abstract.repository';
import { S3FileRepository } from '../repositories/s3File.repository';
import { DefaultFileParserService } from '../services/fileParser.service';

@Module({
  providers: [
    Config,
    DefaultFileUploadService,
    DefaultFileParserService,
    { provide: ValidationService, useClass: YupValidationService },
    { provide: GenericRepository, useClass: S3FileRepository },
  ],
  imports: [S3Module],
})
export class AppModule {}
