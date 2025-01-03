import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../shared/models/api-paginate.model';
import { ActivityLog } from '../entities/activity-log.entity';

export class ListQueryActivityLogsDto extends IntersectionType(
  PickType(ActivityLog, ['handler', 'method', 'ipAddress', 'responseCode', 'updatedAt']),
  ApiQueryUnifiedModel,
) {}
