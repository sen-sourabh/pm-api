import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { FindManyOptions } from 'typeorm';

export class ListQueryRolesDto implements FindManyOptions {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  readonly is_default?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  readonly is_enabled?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  readonly is_deleted?: boolean;

  // @ApiPropertyOptional()
  // @IsDateString()
  // @IsOptional()
  // readonly created_at?: Date;

  // @ApiPropertyOptional()
  // @IsDateString()
  // @IsOptional()
  // readonly updated_at?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take?: number;

  // @ApiPropertyOptional()
  // @IsNumber() // Remove this if order is not a number
  // @IsEnum(Order, { always: true, message: 'order should be ASC or DESC' })
  // @IsOptional()
  // order?: typeof Order;
}
