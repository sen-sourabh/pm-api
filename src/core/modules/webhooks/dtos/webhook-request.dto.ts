import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class WebhookRequestDto {
  @ApiPropertyOptional({
    description: 'The event of the webhook that is built-in',
    required: false,
    example: 'user:created',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'payload data for webhook',
    required: true,
  })
  @IsObject({
    message: 'The payload should be an plain object',
  })
  @IsOptional()
  payload?: Record<string, unknown>;
}
