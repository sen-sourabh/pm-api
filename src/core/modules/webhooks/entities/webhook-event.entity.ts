import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ApiTags('Webhook Events')
@Entity('webhook_events')
export class WebhookEvent {
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
  @Column({
    length: 150,
    primary: true,
    generated: 'uuid',
  })
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'The name of the event',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The key of the event',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'key must be a string' })
  @IsOptional()
  key?: string;

  @ApiPropertyOptional({
    description: 'The description of the event',
    required: false,
  })
  @Column({
    type: 'mediumtext',
    nullable: true,
    default: null,
  })
  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'whether event is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether event is deleted or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '0' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'The datetime of record at creation',
    required: true,
    name: 'createdAt',
    nullable: false,
    format: 'T',
  })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @CreateDateColumn({ type: 'datetime' })
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'The datetime of record at updation',
    required: false,
    name: 'updatedAt',
    nullable: true,
    format: 'T',
  })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @UpdateDateColumn({ type: 'datetime' })
  @IsOptional()
  updatedAt?: Date;
}
