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

@ApiTags('Vault')
@Entity('vaults')
export class Vault {
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
  name?: string;

  @ApiPropertyOptional({
    description: 'The caption of the vault',
    required: false,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: true,
  })
  @IsString({
    message: 'caption must be a string',
  })
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({
    description: 'The small description about the vault',
    required: false,
  })
  @Column({
    length: 255,
    type: 'varchar',
    nullable: true,
  })
  @IsString({
    message: 'description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'whether vault is private or not, Default vault will be private',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiPropertyOptional({
    description: 'The owner of the vault',
    required: false,
  })
  @ManyToOne(() => User)
  @Column({ name: 'userId', nullable: false })
  @IsString({
    message: 'user id must be a string',
  })
  @IsOptional()
  user?: string;

  @ApiPropertyOptional({
    description: "The date time of vault's last access",
    required: false,
    name: 'lastAccessed',
    nullable: true,
    format: 'T',
  })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  lastAccessed?: Date;

  @ApiPropertyOptional({
    description: 'whether vault is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether vault is deleted or not',
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
