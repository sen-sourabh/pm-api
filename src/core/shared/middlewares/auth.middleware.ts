import { BadRequestException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { jwtModuleOptions } from '../../../configs/jwt';
import { UsersService } from '../../../modules/users/users.service';
import { isMissing } from '../../helpers/validations';
import { TokenExpiredExceptionFilter } from '../exception-filters/token-expire.filter';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(request: Request, response: Response, next: NextFunction) {
    if (isMissing(request?.headers?.authorization)) {
      throw new BadRequestException(`Authorization is required`);
    }

    const token = this.#extractTokenFromHeader(request);
    try {
      await this.jwtService.verifyAsync(token, {
        secret: jwtModuleOptions.secret,
      });
    } catch (error) {
      //Logout user in DB
      await this.#userLogoutIfJwtExpired(token);

      //Logged error and throw
      Logger.error(`Error in token: ${error?.message}`);
      throw new TokenExpiredExceptionFilter();
    }

    next();
  }

  #extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  #userLogoutIfJwtExpired = async (token: string) => {
    const decoded = await this.jwtService.decode(token, { complete: true, json: true });
    await this.usersService.updateUser(decoded?.payload?.id, { isLogin: false });
  };
}
