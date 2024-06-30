// logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { buildActivityLog } from '../../helpers/serializers';
import { ActivityLogsService } from '../../modules/activity-logs/activity-logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        //To Activity Log
        const activityLog = buildActivityLog(request, response);
        await this.activityLogService.createActivityLog(activityLog);
      }),
    );
  }
}
