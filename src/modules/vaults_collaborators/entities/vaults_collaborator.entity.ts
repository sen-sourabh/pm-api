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
import { Role } from '../../roles/entities/role.entity';
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
  @Column({ name: 'userId', nullable: false })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiPropertyOptional({
    description: 'The shared vault',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => Vault)
  @Column({ name: 'vaultId', nullable: false })
  @IsString()
  @IsOptional()
  vault?: string;

  @ApiPropertyOptional({
    description: 'The access of the vault',
    required: false,
  })
  @ManyToOne(() => Role)
  @Column({ name: 'roleId', type: 'int', default: 3, nullable: false }) // Default: admin
  @Type(() => Number)
  @IsOptional()
  role: number;

  @ApiPropertyOptional({
    description: 'The user who given the access',
    required: false,
    nullable: false,
  })
  @ManyToOne(() => User)
  @Column({ name: 'addedById', nullable: false })
  @IsString()
  @IsOptional()
  addedBy?: string;

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
