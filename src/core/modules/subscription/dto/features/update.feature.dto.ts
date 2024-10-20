import { PickType } from '@nestjs/swagger';
import { Feature } from '../../entities/feature.entity';

export class UpdateFeatureDto extends PickType(Feature, [
  'name',
  'description',
  'isEnabled',
  'isDeleted',
]) {}
