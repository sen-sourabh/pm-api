import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ApiTags('Custom Fieds')
@Entity('custom_fields')
export class CustomField {
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
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  key?: string;

  @ApiPropertyOptional({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  placeholder?: string;

  @ApiPropertyOptional({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  helptext?: string;

  @ApiPropertyOptional({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  example?: string;

  @ApiPropertyOptional({
    description: 'The name of the vault',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The owner of the vault',
    required: false,
  })
  @ManyToOne(() => User)
  @Column({ name: 'updatedById', nullable: false })
  @IsString({
    message: 'user id must be a string',
  })
  @IsOptional()
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'whether custom field is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether custom field is deleted or not',
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
