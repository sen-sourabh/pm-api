// logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { buildActivityLog } from '../../helpers/serializers';
import { ActivityLogResponse } from '../../helpers/serializers/types';
import { ActivityLogsService } from '../../modules/activity-logs/activity-logs.service';
import { CustomRequest } from '../interfaces/types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handler = context?.getClass()?.name?.toString();

    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest() as CustomRequest;
        const response = context.switchToHttp().getResponse() as Response;

        //To Activity Log
        const activityLog = buildActivityLog(handler, request, response) as ActivityLogResponse;
        await this.activityLogService.createActivityLog(activityLog);
      }),
    );
  }
}
