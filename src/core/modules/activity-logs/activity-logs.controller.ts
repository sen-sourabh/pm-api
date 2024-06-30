import { Controller } from '@nestjs/common';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLog } from './entities/activity-log.entity';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  findAllActivityLogs(): Promise<ApiResponseModel<ActivityLog[]>> {
    return this.activityLogService.findAllActivityLogs();
  }
}
