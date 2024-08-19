import { PickType } from '@nestjs/swagger';
import { Webhook } from '../entities/webhook.entity';

export class UpdateWebhookDto extends PickType(Webhook, [
  'name',
  'secret',
  'targetUrl',
  'secret',
]) {}
