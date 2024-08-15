import { PickType } from '@nestjs/swagger';
import { CustomField } from '../entities/custom-field.entity';

export class UpdateCustomFieldDto extends PickType(CustomField, [
  'name',
  'type',
  'placeholder',
  'helptext',
  'description',
  'example',
  'addedBy',
  'isEnabled',
  'isDeleted',
]) {}
