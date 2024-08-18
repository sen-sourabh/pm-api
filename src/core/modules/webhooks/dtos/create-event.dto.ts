import { PickType } from '@nestjs/swagger';
import { WebhookEvent } from '../entities/webhook-event.entity';

export class CreateEventDto extends PickType(WebhookEvent, ['name', 'description']) {}
