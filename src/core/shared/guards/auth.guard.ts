import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LocalStrategy } from '../../../modules/auth/strategies/local.strategy';
import { fetchHeaders } from '../../helpers/transformers';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private localStartegy: LocalStrategy) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authPayload = fetchHeaders(request);

    return this.localStartegy.validate(authPayload);
  }
}
