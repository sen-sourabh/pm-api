import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../../modules/users/entities/user.entity';
import { FieldTypeEnum } from '../enums';

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
    description: 'The key of the field',
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
    description: 'The name of the field',
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
    description: 'The type of the field',
    required: false,
    enum: FieldTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: FieldTypeEnum,
    nullable: false,
    default: FieldTypeEnum.Text,
  })
  @IsEnum(FieldTypeEnum)
  @Validate(() => FieldTypeEnum)
  @IsOptional()
  type?: FieldTypeEnum;

  @ApiPropertyOptional({
    description: 'The placeholder of the field',
    required: false,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: true,
    default: null,
  })
  @IsString({ message: 'placeholder must be a string' })
  @IsOptional()
  placeholder?: string;

  @ApiPropertyOptional({
    description: 'The helptext of the field',
    required: true,
  })
  @Column({
    length: 100,
    type: 'varchar',
    nullable: true,
    default: null,
  })
  @IsString({ message: 'helptext must be a string' })
  @IsOptional()
  helptext?: string;

  @ApiPropertyOptional({
    description: 'The example value of the field',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  @IsString({ message: 'example must be a string' })
  @IsOptional()
  example?: string;

  @ApiPropertyOptional({
    description: 'The description of the field',
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
    description: 'The user who updated the field at last',
    required: false,
  })
  @ManyToOne(() => User)
  @Column({ name: 'addedById', nullable: false })
  @IsString({
    message: 'addedBy must be a string and valid user id',
  })
  @IsNotEmpty()
  @IsOptional()
  addedBy?: string;

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
