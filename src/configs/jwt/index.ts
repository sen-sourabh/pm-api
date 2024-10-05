import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

export const jwtModuleOptions: JwtModuleOptions = {
  secret: configService.getOrThrow<string>('JWT_SECRET_KEY'),
  signOptions: {
    expiresIn: configService.getOrThrow<string>('JWT_SIGN_EXPIRY'),
  },
};
