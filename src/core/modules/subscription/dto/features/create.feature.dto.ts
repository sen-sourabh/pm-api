import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Feature } from '../../entities/feature.entity';

export class CreateFeatureDto extends PickType(Feature, ['description']) {
  @ApiPropertyOptional({
    description: 'The name of the feature',
    required: true,
  })
  @IsString({ message: 'name must be a string' })
  name: string;
}
