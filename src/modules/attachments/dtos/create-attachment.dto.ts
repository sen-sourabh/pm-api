import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CategoryEnum, FileFormatEnum } from '../../../core/modules/files/enums/category.enum';

export class CreateAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'The attachment category',
    required: true,
    enum: CategoryEnum,
  })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;
}

export class CreateAttachmentInternalDto extends CreateAttachmentDto {
  @ApiProperty({
    description: 'The attachment name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The attachment file format',
    required: true,
    enum: FileFormatEnum,
  })
  @IsEnum(FileFormatEnum)
  fileFormat: FileFormatEnum;

  @ApiProperty({
    description: 'The attachment key',
    required: true,
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'The attachment url',
    required: true,
  })
  @IsString()
  url: string;
}

@ApiTags('CreateUsersAttachment')
export class CreateUsersAttachmentDto extends CreateAttachmentDto {
  @ApiProperty({
    description: 'The user of the attachment',
    required: true,
  })
  @IsString()
  user: string;
}

export class CreateUsersAttachmentInternalDto extends CreateAttachmentInternalDto {
  @ApiProperty({
    description: 'The user of the attachment',
    required: true,
  })
  @IsString()
  user: string;
}

@ApiTags('CreateVaultsAttachment')
export class CreateVaultsAttachmentDto extends CreateAttachmentDto {
  @ApiProperty({
    description: 'The vault of the attachment',
    required: true,
  })
  @IsString()
  vault: string;
}

export class CreateVaultsAttachmentInternalDto extends CreateAttachmentInternalDto {
  @ApiProperty({
    description: 'The vault of the attachment',
    required: true,
  })
  @IsString()
  vault: string;
}
