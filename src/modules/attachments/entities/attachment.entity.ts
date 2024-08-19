import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEnum, FileFormatEnum } from '../../../core/modules/files/enums';
import { User } from '../../users/entities/user.entity';
import { Vault } from '../../vaults/entities/vault.entity';

@ApiTags('Attachments')
@Entity('attachments')
export class Attachment {
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
    description: 'The attachment name',
    required: true,
  })
  @Column({
    length: 255,
    type: 'varchar',
    nullable: true,
    default: null,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The attachment file format',
    required: true,
    enum: FileFormatEnum,
  })
  @Column({
    type: 'enum',
    enum: FileFormatEnum,
    nullable: false,
    default: FileFormatEnum.Jpeg,
  })
  @IsEnum(FileFormatEnum)
  @IsOptional()
  fileFormat?: FileFormatEnum;

  @ApiPropertyOptional({
    description: 'The attachment category',
    required: true,
    enum: CategoryEnum,
  })
  @Column({
    type: 'enum',
    enum: CategoryEnum,
    nullable: false,
    default: CategoryEnum.Additional,
  })
  @IsEnum(CategoryEnum)
  @IsOptional()
  category?: CategoryEnum;

  @ApiPropertyOptional({
    description: 'The attachment key',
    required: true,
  })
  @Column({
    length: 255,
    type: 'varchar',
    unique: true,
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiPropertyOptional({
    description: 'The attachment url',
    required: true,
  })
  @Column({
    type: 'mediumtext',
    nullable: true,
    default: null,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: 'The user of the attachment',
    required: false,
  })
  @ManyToOne(() => User)
  @Column({ name: 'userId', type: 'varchar', nullable: true, default: null })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiPropertyOptional({
    description: 'The vault of the attachment',
    required: false,
  })
  @ManyToOne(() => Vault)
  @Column({ name: 'vaultId', type: 'varchar', nullable: true, default: null })
  @IsString()
  @IsOptional()
  vault?: string;

  @ApiPropertyOptional({
    description: 'The attachment is archived or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '0' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiPropertyOptional({
    description: "The date time of attachment's last accessed",
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
    description: 'With record create it`ll be auto generated',
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
    description: 'With record update it`ll be auto generated',
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
