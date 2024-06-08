import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseDto } from '../../dtos/response/response.dto';
import { ApiResponseModel } from '../../models/api-response.model';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // console.log('Before from Interceptor:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
    // console.log('request.query: ', request.query);
    // console.log('request.body: ', request.body);
    // console.log('request.params: ', request.params);
    // console.log('request.headers: ', request.headers);

    return next.handle().pipe(
      map((data: ApiResponseModel) => {
        const response = context.switchToHttp().getResponse();
        // console.log('After from Interceptor:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');

        return {
          data: data?.data,
          metadata: data?.metadata,
          statusCode: data?.statusCode ?? response?.statusCode,
          status: data?.status ?? response?.statusMessage ?? 'OK',
          message: data?.message ?? response?.message ?? 'Operation successful',
          timestamp: new Date().toISOString(),
        } as unknown as ResponseDto;
      }),
    );
  }
}
