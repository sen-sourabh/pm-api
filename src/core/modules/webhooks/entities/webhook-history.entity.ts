import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsJSON, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WebhookStatusEnum } from '../enums';
import { Webhook } from './webhook.entity';

@ApiTags('Webhook History')
@Entity('webhook_histories')
export class WebhookHistory {
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
    description: 'The id of the webhook',
    required: false,
  })
  @ManyToOne(() => Webhook)
  @Column({ name: 'webhookId', nullable: false })
  @IsString({
    message: 'webhook id must be a string',
  })
  @IsOptional()
  webhook?: string;

  @ApiPropertyOptional({
    description: 'http status code of the final response',
    required: true,
  })
  @Column({ type: 'int', default: null, nullable: true })
  @IsNumber()
  @IsOptional()
  responseCode?: number;

  @ApiPropertyOptional({
    description: 'The status of the webhook',
    required: true,
    enum: WebhookStatusEnum,
  })
  @Column({
    type: 'enum',
    enum: WebhookStatusEnum,
    nullable: false,
    default: WebhookStatusEnum.Success,
  })
  @IsEnum(WebhookStatusEnum)
  @IsOptional()
  status?: WebhookStatusEnum;

  @ApiPropertyOptional({
    description: 'The date time of webhook when next triggered',
    required: false,
    name: 'nextTriggered',
    nullable: true,
    default: null,
    format: 'T',
  })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @Column({ type: 'datetime', nullable: true, default: null })
  @IsOptional()
  nextTrigger?: Date;

  @ApiPropertyOptional({
    description: 'payoad of the webhook request',
    required: true,
  })
  @Column({ type: 'json', default: null })
  @IsJSON()
  @IsOptional()
  payload?: Record<string, unknown>;

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
}
