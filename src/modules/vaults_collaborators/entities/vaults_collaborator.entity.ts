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
import { RolesEnum } from '../../../core/shared/enums';
import { User } from '../../users/entities/user.entity';
import { Vault } from '../../vaults/entities/vault.entity';

@ApiTags('VaultsCollaborators')
@Entity('vaults_collaborators')
export class VaultsCollaborator {
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
    description: 'The collaborator of the vault',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => User)
  @IsString()
  @IsOptional()
  user?: User;

  @ApiPropertyOptional({
    description: 'The shared vault',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => Vault)
  @IsString()
  @IsOptional()
  vault?: Vault;

  @ApiPropertyOptional({
    description: 'The access of the vault',
    required: false,
    enum: RolesEnum,
  })
  @Column({
    type: 'enum',
    enum: RolesEnum,
    nullable: false,
  })
  @IsEnum(RolesEnum)
  @IsOptional()
  access?: RolesEnum;

  @ApiPropertyOptional({
    description: 'The user who given the access',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => User)
  @IsString()
  @IsOptional()
  addedBy?: User;

  @ApiPropertyOptional({
    description: 'whether collaborator is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

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
