import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ApiQueryUnifiedModel {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @ApiPropertyOptional({
    description: 'No of records will be fetched in single page',
    example: 25,
    default: 25,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Fecth associate relation`s data via relation as true',
    example: true,
    default: false,
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  relation?: boolean;
}
