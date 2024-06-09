import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { getHttpStatusViaCode } from '../../../helpers/serializers';
import { ApiResponseDto } from '../../dtos/response.dto';
import { ApiResponseUnifiedModel } from '../../models/api-response.model';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // console.log(
    //   'Before from Interceptor:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
    // );
    // console.log('request.query: ', request.query);
    // console.log('request.body: ', request.body);
    // console.log('request.params: ', request.params);
    // console.log('request.headers: ', request.headers);

    return next.handle().pipe(
      map((data: ApiResponseUnifiedModel) => {
        const response = context.switchToHttp().getResponse();
        // console.log(
        //   'After from Interceptor:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
        // );

        return this.serializeResponse(data, response);
      }),
    );
  }

  serializeResponse = (data: ApiResponseUnifiedModel, response: any) => {
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
