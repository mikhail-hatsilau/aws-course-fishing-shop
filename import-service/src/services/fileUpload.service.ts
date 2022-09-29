import { FileUploadService } from './fileUpload.interface.service';
import { Injectable } from '@nestjs/common';
import { GenericRepository } from '../repositories/generic.abstract.repository';

@Injectable()
export class DefaultFileUploadService implements FileUploadService {
  constructor(private readonly fileRepository: GenericRepository) {}

  getUploadUrl(fileName: string): Promise<string> {
    return this.fileRepository.getUploadUrl(fileName);
  }

  async moveFile(sourceFileName: string, fileName: string): Promise<void> {
    await this.fileRepository.copyFile(sourceFileName, fileName);
    await this.fileRepository.deleteFile(sourceFileName);
  }
}
