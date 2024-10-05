import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { getHttpStatusViaCode } from '../../helpers/serializers';
import { ApiResponseDto } from '../dtos/response.dto';
import { CustomResponse } from '../interfaces/types';
import { ApiResponseUnifiedModel } from '../models/api-response.model';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto> {
    return next.handle().pipe(
      map((data: ApiResponseUnifiedModel) => {
        const response = context.switchToHttp().getResponse() as Response;

        // Retrun final response
        return this.#serializeResponse(data, response);
      }),
    );
  }

  #serializeResponse = (data: ApiResponseUnifiedModel, response: CustomResponse) => {
    return {
      data: data?.data,
      metadata: data?.metadata,
      statusCode: data?.statusCode ?? response?.statusCode,
      status: getHttpStatusViaCode(data, response),
      message: data?.message ?? response?.message ?? 'Operation successful',
      timestamp: new Date().toISOString(),
    } as unknown as ApiResponseDto;
  };
}
