import { Inject, Injectable } from '@nestjs/common';
import { GenericRepository } from './generic.abstract.repository';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Config } from '../helpers/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class S3FileRepository implements GenericRepository {
  constructor(
    @Inject('S3_CLIENT') private readonly client: S3Client,
    private readonly config: Config,
  ) {}

  async getUploadUrl(fileName: string): Promise<string> {
    const bucketParams = {
      Bucket: this.config.getEnvVariable('FILES_BUCKET_NAME'),
      Key: `${this.config.getEnvVariable('UPLOAD_FOLDER')}/${fileName}`,
    };
    const command = new PutObjectCommand(bucketParams);

    return getSignedUrl(this.client, command);
  }

  async readFile(fileName: string): Promise<Readable | undefined> {
    const bucketParams = {
      Bucket: this.config.getEnvVariable('FILES_BUCKET_NAME'),
      Key: fileName,
    };
    const command = new GetObjectCommand(bucketParams);
    const data = await this.client.send(command);
    return data.Body as Readable | undefined;
  }

  async deleteFile(fileName: string): Promise<void> {
    const bucketParams = {
      Bucket: this.config.getEnvVariable('FILES_BUCKET_NAME'),
      Key: fileName,
    };
    await this.client.send(new DeleteObjectCommand(bucketParams));
  }

  async copyFile(source: string, fileName: string): Promise<void> {
    const params = {
      Bucket: this.config.getEnvVariable('FILES_BUCKET_NAME'),
      CopySource: `/${this.config.getEnvVariable(
        'FILES_BUCKET_NAME',
      )}/${source}`,
      Key: `${this.config.getEnvVariable('PARSED_FOLDER')}/${fileName}`,
    };
    await this.client.send(new CopyObjectCommand(params));
  }
}
