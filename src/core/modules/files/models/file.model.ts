import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Readable } from 'stream';
import { CategoryEnum, FileFormatEnum } from '../enums';

export class FileUploadModel {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

export class FilesModel extends FileUploadModel {
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
  @ApiPropertyOptional({
    description: 'The url of uploaded file',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: 'The key of uploded file',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;
}

export class EntityFileResponseModel extends FilesResponseModel {
  @ApiPropertyOptional({
    description: 'The record id where is file uploaded',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;
}
