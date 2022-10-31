import { Module } from '@nestjs/common';
import { Config } from '../helpers/config';
import { ValidationService } from '../services/validation.abstract.service';
import { YupValidationService } from '../services/yupValidation.service';
import { S3Module } from './s3.module';
import { DefaultFileUploadService } from '../services/fileUpload.service';
import { GenericRepository } from '../repositories/generic.abstract.repository';
import { S3FileRepository } from '../repositories/s3File.repository';
import { DefaultFileParserService } from '../services/fileParser.service';
import { SQSModule } from './sqs.module';
import { QueueRepository } from '../repositories/queue.abstract.repository';
import { SqsRepository } from '../repositories/sqs.repository';
import { DefaultProductService } from '../services/product.service';

@Module({
  providers: [
    Config,
    DefaultFileUploadService,
    DefaultFileParserService,
    DefaultProductService,
    { provide: ValidationService, useClass: YupValidationService },
    { provide: GenericRepository, useClass: S3FileRepository },
    { provide: QueueRepository, useClass: SqsRepository },
  ],
  imports: [S3Module, SQSModule],
})
export class AppModule {}
