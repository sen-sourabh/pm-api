import { Controller, Get, HttpCode, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../shared/enums';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { ApiQueryParamUnifiedModel } from '../../shared/models/api-query.model';
import { PaginatePipe } from '../../shared/pipes/paginate.pipe';
import { PathParamsPipe } from '../../shared/pipes/path-params.pipe';
import { QueryParamsPipe } from '../../shared/pipes/query-params.pipe';
import { ActivityLogsService } from './activity-logs.service';
import { ListQueryActivityLogsDto } from './dtos/list-log.dto';
import { ActivityLog } from './entities/activity-log.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Activity Logs')
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  @ApiOperation({
    summary: 'Get all the activity_logs',
  })
  @ApiResponse({
    description: 'Return the list of activity_logs',
    type: [ActivityLog],
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.Unauthorized, ApiXResponsesEnum.BadRequest)
  @UsePipes(new QueryParamsPipe(), new PaginatePipe())
  @HttpCode(200)
  @Get()
  findAllActivityLogs(
    @Req() request: Request,
    @Query()
    listQueryActivityLogsData?: ListQueryActivityLogsDto,
  ): Promise<ApiResponseModel<ActivityLog[]>> {
    return this.activityLogService.findAllActivityLogs({ request, listQueryActivityLogsData });
  }

  @ApiOperation({
    summary: 'Get a activity_logs',
  })
  @ApiResponse({
    description: 'Return the activity_logs with the given identifier',
    type: ActivityLog,
    status: 200,
  })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.NotFound,
  )
  @UsePipes(new PathParamsPipe())
  @HttpCode(200)
  @Get(':id')
  findOneActivityLog(
    @Req() request: Request,
    @Param('id') id: string,
    @Query() query?: ApiQueryParamUnifiedModel,
  ) {
    return this.activityLogService.findOneActivityLog({ request, id, query });
  }
}
