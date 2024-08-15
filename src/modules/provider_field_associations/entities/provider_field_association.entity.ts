import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomField } from '../../../core/modules/custom-fields/entities/custom-field.entity';
import { Provider } from '../../providers/entities/provider.entity';

@ApiTags('ProviderFieldAssociations')
@Entity('provider_field_associations')
export class ProviderFieldAssociation {
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
    description: 'The field of the provider',
    required: false,
  })
  @ManyToOne(() => Provider)
  @Column({ name: 'providerId', nullable: false })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({
    description: 'The custom field id',
    required: false,
  })
  @ManyToOne(() => CustomField)
  @Column({ name: 'customFieldId', nullable: false })
  @IsString()
  @IsOptional()
  customField?: string;

  @ApiPropertyOptional({
    description: 'The value of the field',
    required: false,
  })
  @Column({
    length: 255,
    type: 'varchar',
    nullable: true,
    default: null,
  })
  @IsString({ message: 'value must be a string' })
  @IsOptional()
  value?: string;

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
