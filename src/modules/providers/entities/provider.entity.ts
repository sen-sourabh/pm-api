import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
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
import { Vault } from '../../vaults/entities/vault.entity';

@ApiTags('Provider')
@Entity('providers')
export class Provider {
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
    description: 'The vault where provider belongs to.',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => Vault)
  @Column({ name: 'vaultId', nullable: false })
  @IsString()
  @IsOptional()
  vault?: string;

  @ApiPropertyOptional({
    description: 'The name of the provider',
    required: false,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the provider',
    required: false,
  })
  @Column({
    length: 255,
    type: 'varchar',
    nullable: true,
    default: null,
  })
  @IsString({
    message: 'description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "The date time of provider's last access",
    required: false,
    name: 'lastAccess',
    nullable: true,
    format: 'T',
  })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @Column({ type: 'datetime', default: null, nullable: true })
  @IsOptional()
  lastAccessed?: Date;

  @ApiPropertyOptional({
    description: 'The user who added the provider',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => User)
  @Column({ name: 'addedById', nullable: false })
  @IsString()
  @IsOptional()
  addedBy?: string;

  @ApiPropertyOptional({
    description: 'whether provider is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1', nullable: false })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether provider is deleted or not',
    required: true,
  })
  @Column({ type: 'tinyint', default: '0', nullable: false })
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
