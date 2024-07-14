import { Controller, Get, HttpCode, Query, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { PaginatePipe } from '../../shared/pipes/paginate.pipe';
import { QueryParamsPipe } from '../../shared/pipes/query-params.pipe';
import { ActivityLogsService } from './activity-logs.service';
import { ListQueryActivityLogsDto } from './dtos/list-log.dto';
import { ActivityLog } from './entities/activity-log.entity';

@ApiTags('Activity Logs')
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  @ApiResponse({
    description: 'returns list of activity logs',
    type: [ActivityLog],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllActivityLogs(
    @Query() listQueryActivityLogsDto?: ListQueryActivityLogsDto,
  ): Promise<ApiResponseModel<ActivityLog[]>> {
    return this.activityLogService.findAllActivityLogs(listQueryActivityLogsDto);
  }
}
