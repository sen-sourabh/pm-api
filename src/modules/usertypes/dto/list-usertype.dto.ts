import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { FindManyOptions } from 'typeorm';

export class ListQueryUsertypesDto implements FindManyOptions {
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
  readonly isDefault?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  readonly isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  readonly isDeleted?: boolean;

  // @ApiPropertyOptional()
  // @IsDateString()
  // @IsOptional()
  // readonly createdAt?: Date;

  // @ApiPropertyOptional()
  // @IsDateString()
  // @IsOptional()
  // readonly updatedAt?: Date;

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
