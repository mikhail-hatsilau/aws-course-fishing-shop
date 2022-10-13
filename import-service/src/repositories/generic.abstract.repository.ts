import { Readable } from 'stream';

export abstract class GenericRepository {
  abstract getUploadUrl(fileName: string): Promise<string>;
  abstract readFile(fileName: string): Promise<Readable | undefined>;
  abstract copyFile(source: string, fileName: string): Promise<void>;
  abstract deleteFile(fileName: string): Promise<void>;
}
