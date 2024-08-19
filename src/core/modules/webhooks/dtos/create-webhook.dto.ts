import { PickType } from '@nestjs/swagger';
import { Webhook } from '../entities/webhook.entity';

export class CreateWebhookDto extends PickType(Webhook, [
  'name',
  'event',
  'secret',
  'targetUrl',
  'user',
]) {}
