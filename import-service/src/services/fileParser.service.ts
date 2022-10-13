import csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { FileParserService } from './fileParser.interface.service';
import { GenericRepository } from '../repositories/generic.abstract.repository';
import { Readable } from 'stream';

@Injectable()
export class DefaultFileParserService<T> implements FileParserService<T> {
  constructor(private readonly fileRepository: GenericRepository) {}

  async parseFile(fileName: string): Promise<T[]> {
    const fileStream = await this.fileRepository.readFile(fileName);

    if (!fileStream) {
      throw new Error(`Can not find file with the name ${fileName}`);
    }

    return this.convertStreamToJson(fileStream);
  }

  private async convertStreamToJson(fileStream: Readable): Promise<T[]> {
    const results: T[] = [];
    return new Promise<T[]>((resolve) => {
      fileStream
        .pipe(csv())
        .on('data', (item) => results.push(item))
        .on('end', () => {
          resolve(results);
        });
    });
  }
}
