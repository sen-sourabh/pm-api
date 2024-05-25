import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseDto } from '../../dtos/response/response.dto';
import { ApiResponseModel } from '../../models/api-response.model';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ApiResponseModel) => {
        const response = context.switchToHttp().getResponse();

        return {
          statusCode: data?.statusCode ?? response?.statusCode,
          status: data?.message ?? response?.statusMessage ?? 'OK',
          message: data?.message ?? response?.message ?? 'Operation successful',
          data: data?.data,
          metadata: data?.metadata,
          timestamp: new Date().toISOString(),
        } as unknown as ResponseDto;
      }),
    );
  }
}
