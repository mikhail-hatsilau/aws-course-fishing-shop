export interface FileParserService<T> {
  parseFile(fileName: string): Promise<T[]>;
}
