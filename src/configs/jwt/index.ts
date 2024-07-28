import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

export const jwtModuleOptions: JwtModuleOptions = {
  secret: configService.getOrThrow('JWT_SECRET_KEY'),
  signOptions: {
    expiresIn: configService.getOrThrow('JWT_SIGN_EXPIRY'),
  },
};
