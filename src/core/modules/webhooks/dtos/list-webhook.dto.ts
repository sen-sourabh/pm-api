import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../shared/models/api-paginate.model';
import { Webhook } from '../entities/webhook.entity';

export class ListQueryWebhooksDto extends IntersectionType(
  PickType(Webhook, ['event', 'isEnabled', 'lastTriggered', 'updatedAt', 'user']),
  ApiPaginateUnifiedModel,
) {}
