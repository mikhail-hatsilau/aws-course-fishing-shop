export interface FileUploadService {
  getUploadUrl(fileName: string): Promise<string>;
  moveFile(sourceFileName: string, fileName: string): Promise<void>;
}
