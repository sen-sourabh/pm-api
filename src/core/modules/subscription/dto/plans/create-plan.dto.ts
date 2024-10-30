import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Plan } from '../../entities/plan.entity';

export class CreatePlanDto extends PickType(Plan, [
  'description',
  'heading',
  'price',
  'currency',
  'discountPercentage',
  'discountPrice',
]) {
  @ApiPropertyOptional({
    description: 'The name of the plan',
    required: true,
    uniqueItems: true,
  })
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiPropertyOptional({
    description: 'The features of the plan',
    required: true,
  })
  @IsString({ message: 'features must be a string array of features id seperated by comma' })
  @Transform(({ value }: { value: string[] }) => {
    return value.toString();
  })
  features: string;
}
