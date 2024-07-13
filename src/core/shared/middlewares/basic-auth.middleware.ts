import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isMissing } from '../../helpers/validations';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    if (isMissing(request?.headers?.authorization)) {
      throw new BadRequestException(`Authorization is required in headers`);
    }

    // const isValidated = await this.passportLocalStrategy.validate(loginRequest);
    // if (!isValidated) throw new UnauthorizedException();

    next();
  }
}
