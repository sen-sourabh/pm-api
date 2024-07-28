import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Readable } from 'stream';
import { CategoryEnum } from '../enums/category.enum';
import { FileFormatEnum } from '../enums/file-format.enum';

export class FileUploadModel {
  file: Express.Multer.File;
}

export class CoreFileModel implements Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export class FilesModel {
  @ApiPropertyOptional({
    description: 'The name of file',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The file_format of file',
    required: false,
  })
  @IsEnum(FileFormatEnum)
  @IsString()
  @IsOptional()
  file_format?: string;

  @ApiPropertyOptional({
    description: 'The category of file',
    required: false,
  })
  @IsEnum(CategoryEnum)
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'The entity of file where need to link',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityId?: string;
}

export class FilesResponseModel {
  url?: string;
}

export class EntityFileResponseModel extends FilesResponseModel {
  id?: string;
}
