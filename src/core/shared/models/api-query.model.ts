import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ApiQueryParamUnifiedModel {
  @ApiPropertyOptional({
    description: 'To fetch the entities with their relation`s data',
    type: 'boolean',
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  relation?: boolean;
}
