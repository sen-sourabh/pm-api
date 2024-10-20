import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feature } from './feature.entity';

@ApiTags('Plan')
@Entity('plans')
export class Plan {
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
    description: 'The name of the plan',
    required: true,
    uniqueItems: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The heading of the plan',
    required: true,
  })
  @Column({
    length: 150,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'heading must be a string' })
  @IsOptional()
  heading?: string;

  @ApiPropertyOptional({
    description: 'The description of the plan',
    required: true,
  })
  @Column({
    type: 'mediumtext',
    nullable: false,
  })
  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The price of the plan',
    required: true,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  @IsString({ message: 'price must be a number' })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'The currency of the plan',
    required: true,
  })
  @Column({
    length: 10,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'currency must be a string' })
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'The discount percentage of the plan',
    required: false,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  @IsString({ message: 'discount percentage must be a number' })
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional({
    description: 'The discount price of the plan',
    required: false,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  @IsString({ message: 'discount price must be a number' })
  @IsOptional()
  discountPrice?: number;

  @ApiPropertyOptional({
    description: 'The features of the plan',
    required: true,
  })
  @ManyToMany(() => Feature)
  @Column({
    type: 'json',
    nullable: false,
  })
  @ValidateNested({
    each: true,
  })
  @IsString({ message: 'features must be a string array of features id seperated by comma' })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    description: 'whether plan is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether plan is deleted or not',
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
