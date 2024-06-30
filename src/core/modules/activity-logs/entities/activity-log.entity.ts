import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsJSON, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @ApiPropertyOptional({
    description: 'Id is the unique uuid identifier',
    example: 'e762634c-3e41-11eb-b897-0862660ccbd4',
    type: 'string',
    required: true,
    default: 'uuid',
    name: 'id',
    nullable: false,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  @Column({ length: 150, primary: true, generated: 'uuid' })
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'module where on this request happen',
    required: true,
  })
  @Column({ default: null })
  @IsString()
  @IsOptional()
  handler?: string;

  @ApiPropertyOptional({
    description: 'method of the request',
    required: true,
  })
  @Column({ default: null })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiPropertyOptional({
    description: 'http status code of the final response',
    required: true,
  })
  @Column({ type: 'int', default: null })
  @IsNumber()
  @IsOptional()
  responseCode?: number;

  @ApiPropertyOptional({
    description: 'header of the request',
    required: true,
  })
  @Column({ type: 'json', default: null })
  @IsJSON()
  @IsOptional()
  headers?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'actual request that includes query/body/path params',
    required: true,
  })
  @Column({ type: 'json', default: null })
  @IsJSON()
  @IsOptional()
  request?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'response of the request',
    required: true,
  })
  @Column({ type: 'json', default: null })
  @IsJSON()
  @IsOptional()
  response?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'ipAddress of the request',
    required: true,
  })
  @Column({ default: null })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'location of the request',
    required: true,
  })
  @Column({ default: null })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'With record create it`ll be auto generated',
    required: true,
    name: 'createdAt',
    nullable: false,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @CreateDateColumn({ type: 'datetime' })
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'With record update it`ll be auto generated',
    required: false,
    name: 'updatedAt',
    nullable: true,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @UpdateDateColumn({ type: 'datetime' })
  @IsOptional()
  updatedAt?: Date;
}
