import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response } from 'express';
import { buildActivityLog } from '../../helpers/serializers';
import { ActivityLogsService } from '../../modules/activity-logs/activity-logs.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = isArray(exception.getResponse()?.['message'])
      ? exception.getResponse()?.['message']?.[0]
      : exception.message;

    const exceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message ?? HttpStatus[status],
      path: request.url,
    };

    //To Activity Logs
    const activityLog = buildActivityLog('HttpExceptionFilter', request, exceptionResponse);
    await this.activityLogService.createActivityLog(activityLog);

    response.status(status).json(exceptionResponse);
  }
}
