import { S3Handler } from 'aws-lambda';
import { bootstrap } from './bootstrap';
import { DefaultFileParserService } from '../services/fileParser.service';
import { FileParserService } from '../services/fileParser.interface.service';
import { Product } from '../dto/product';
import { FileUploadService } from '../services/fileUpload.interface.service';
import { DefaultFileUploadService } from '../services/fileUpload.service';

export const importFileParser: S3Handler = async (event) => {
  const app = await bootstrap();
  const fileParserService = app.get<FileParserService<Product>>(
    DefaultFileParserService,
  );
  const fileUploadService = app.get<FileUploadService>(
    DefaultFileUploadService,
  );

  await Promise.all(
    event.Records.map(async (record) => {
      console.log(`Start parsing the file ${record.s3.object.key}`);
      const parsedFileData = await fileParserService.parseFile(
        record.s3.object.key,
      );
      console.log(`File ${record.s3.object.key} was successfully parsed`);
      console.log('Parsed file data:', JSON.stringify(parsedFileData));
      console.log(
        `Moving ${record.s3.object.key}  file to the parsed directory`,
      );
      const filePathParts = record.s3.object.key.split('/');
      await fileUploadService.moveFile(
        record.s3.object.key,
        filePathParts[filePathParts.length - 1],
      );
      console.log(
        `File ${record.s3.object.key} was successfully moved to the parsed directory`,
      );
    }),
  );
};
