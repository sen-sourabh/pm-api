import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
console.log('configService: ', configService.getOrThrow('JWT_SECRET_KEY'));

export const jwtModuleOptions: JwtModuleOptions = {
  secret: configService.getOrThrow('JWT_SECRET_KEY'),
  signOptions: {
    expiresIn: configService.getOrThrow('JWT_SIGN_EXPIRY'),
  },
  global: !!configService.getOrThrow('JWT_GLOBAL'),
  verifyOptions: {
    complete: !!configService.getOrThrow('JWT_VERIFY_COMPLETE'),
  },
};
