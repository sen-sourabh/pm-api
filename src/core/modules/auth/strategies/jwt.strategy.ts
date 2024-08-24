import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtModuleOptions } from '../../../../configs/jwt';
import { AuthUserPayload } from '../types';

@Injectable()
export class PassportJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtModuleOptions.secret,
    });
  }

  async validate(payload: AuthUserPayload) {
    return payload;
  }
}
