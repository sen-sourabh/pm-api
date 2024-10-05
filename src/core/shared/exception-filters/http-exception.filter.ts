import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';
import { buildActivityLog } from '../../helpers/serializers';
import { ActivityLogsService } from '../../modules/activity-logs/activity-logs.service';
import { CustomRequest, CustomResponse } from '../interfaces/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly activityLogService: ActivityLogsService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<CustomRequest>();
    const status = exception.getStatus();

    const message = isArray(exception.getResponse()?.['message'])
      ? ((exception.getResponse()?.['message'] as string[])?.[0] as string)
      : (exception.message as string);

    const exceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message ?? HttpStatus[status],
      path: request.url,
    } as unknown as CustomResponse;

    //To Activity Logs
    const activityLog = buildActivityLog('HttpExceptionFilter', request, exceptionResponse);
    await this.activityLogService.createActivityLog(activityLog);

    response.status(status).json(exceptionResponse);
  }
}
