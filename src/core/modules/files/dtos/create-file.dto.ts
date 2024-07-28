import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FilesModel } from '../models/file.model';

export class CreateFilesDto extends FilesModel {
  @ApiProperty({
    description: 'The entity of file where need to link',
    required: true,
  })
  @IsString()
  entityId: string;
}
