import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryEnum, FileFormatEnum } from '../../../core/modules/files/enums/category.enum';

export class CreateAttachmentInternalDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'The attachment category',
    required: true,
    enum: CategoryEnum,
  })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;
}

export class CreateAttachmentDto extends CreateAttachmentInternalDto {
  @ApiProperty({
    description: 'The attachment name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The attachment file format',
    required: false,
    enum: FileFormatEnum,
  })
  @IsEnum(FileFormatEnum)
  @IsOptional()
  fileFormat?: FileFormatEnum;

  @ApiProperty({
    description: 'The attachment key',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    description: 'The attachment url',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'The vault of the attachment',
    required: false,
  })
  @IsString()
  @IsOptional()
  vault?: string;

  @ApiProperty({
    description: 'The user of the attachment',
    required: false,
  })
  @IsString()
  @IsOptional()
  user?: string;
}
