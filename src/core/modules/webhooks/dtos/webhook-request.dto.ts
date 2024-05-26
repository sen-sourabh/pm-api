import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class WebhookRequestDto {
  @ApiPropertyOptional({
    description: 'type of webhook request that is built-in',
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
  @IsOptional()
  payload?: Record<string, unknown>;
}
