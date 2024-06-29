import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ApiPaginateUnifiedModel {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @ApiPropertyOptional({
    description: 'No of records will be fetched in single request',
    example: 25,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageSize?: number;
}
