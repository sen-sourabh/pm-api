import { PickType } from '@nestjs/swagger';
import { Plan } from '../../entities/plan.entity';

export class UpdatePlanDto extends PickType(Plan, [
  'name',
  'heading',
  'description',
  'currency',
  'discountPercentage',
  'discountPrice',
  'price',
  'features',
  'isEnabled',
  'isDeleted',
]) {}
