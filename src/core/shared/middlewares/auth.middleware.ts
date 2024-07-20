import { BadRequestException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { jwtModuleOptions } from '../../../configs/jwt';
import { isMissing } from '../../helpers/validations';
import { TokenExpiredExceptionFilter } from '../exception-filters/token-expire.filter';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    if (isMissing(request?.headers?.authorization)) {
      throw new BadRequestException(`Authorization is required`);
    }

    const token = this.extractTokenFromHeader(request);
    try {
      await this.jwtService.verifyAsync(token, {
        secret: jwtModuleOptions.secret,
      });
    } catch (error) {
      Logger.error(`Error in token: ${error?.message}`);
      throw new TokenExpiredExceptionFilter();
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
