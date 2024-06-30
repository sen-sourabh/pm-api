import { PickType } from '@nestjs/swagger';
import { ActivityLog } from '../entities/activity-log.entity';

export class CreateActivityLogDto extends PickType(ActivityLog, [
  'headers',
  'request',
  'response',
  'ipAddress',
  'location',
]) {}
