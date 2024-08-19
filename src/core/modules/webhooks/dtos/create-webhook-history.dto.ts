import { PickType } from '@nestjs/swagger';
import { WebhookHistory } from '../entities/webhook-history.entity';

export class CreateWebhookHistoryDto extends PickType(WebhookHistory, [
  'webhook',
  'responseCode',
  'status',
  'payload',
  'nextTrigger',
]) {}
