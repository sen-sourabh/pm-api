import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CustomField } from '../entities/custom-field.entity';

export class CreateCustomFieldDto extends PickType(CustomField, [
  'type',
  'placeholder',
  'helptext',
  'description',
  'example',
  'updatedBy',
]) {
  @ApiProperty({
    description: 'The name of the field',
    required: true,
  })
  @IsString({ message: 'name must be a string' })
  name?: string;
}
