import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CustomField } from '../entities/custom-field.entity';

export class CreateCustomFieldDto extends PickType(CustomField, [
  'type',
  'placeholder',
  'helptext',
  'description',
  'example',
  'addedBy',
]) {
  @ApiProperty({
    description: 'The name of the field',
    required: true,
  })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}
