import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(TokenExpiredError)
export class TokenExpiredExceptionFilter extends HttpException {
  constructor() {
    super('Token has been expired', HttpStatus.UNAUTHORIZED);
  }
}
