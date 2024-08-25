import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseUnifiedModel } from '../models/api-response.model';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //Cache fecthing will be implement here

    return next.handle().pipe(
      map((data: ApiResponseUnifiedModel) => {
        const response = context.switchToHttp().getResponse();
        return data;
      }),
    );
  }
}
