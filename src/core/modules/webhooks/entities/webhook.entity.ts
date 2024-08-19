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
import { User } from '../../../../modules/users/entities/user.entity';
import { WebhookEventEnum } from '../enums';

@ApiTags('Webhooks')
@Entity('webhooks')
export class Webhook {
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
    description: 'The name of the webhook',
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
    description: 'The event of the webhook',
    required: true,
    enum: WebhookEventEnum,
  })
  @Column({
    type: 'enum',
    enum: WebhookEventEnum,
    nullable: false,
    default: WebhookEventEnum.UserCreated,
  })
  @IsEnum(WebhookEventEnum)
  @IsOptional()
  event?: WebhookEventEnum;

  @ApiPropertyOptional({
    description: 'The target url of the webhook',
    required: false,
  })
  @Column({
    type: 'mediumtext',
    nullable: false,
  })
  @IsString({ message: 'target url must be a string' })
  @IsOptional()
  targetUrl?: string;

  @ApiPropertyOptional({
    description: 'The secret of the webhook',
    required: false,
  })
  @Column({
    type: 'mediumtext',
    nullable: false,
  })
  @IsString({ message: 'secret must be a string' })
  @IsOptional()
  secret?: string;

  @ApiPropertyOptional({
    description: 'The owner of the webhook',
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
    description: 'The date time of webhook when last triggered',
    required: false,
    name: 'lastTriggered',
    nullable: true,
    format: 'T',
  })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  lastTriggered?: Date;

  @ApiPropertyOptional({
    // INFO: It’ll retry sending the last payload five times otherwise
    // INFO: It’ll be disabled and at every unsuccess email of fail will be triggered
    description: 'whether webhook is enabled or not',
    required: false,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether webhook is deleted or not',
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
