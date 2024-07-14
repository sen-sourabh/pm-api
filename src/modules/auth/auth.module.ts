import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtModuleOptions } from '../../configs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportJwtStrategy } from './strategies/jwt.strategy';
import { PassportLocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register(jwtModuleOptions)],
  providers: [AuthService, PassportLocalStrategy, PassportJwtStrategy],
  controllers: [AuthController],
  exports: [PassportLocalStrategy, PassportJwtStrategy],
})
export class AuthModule {}
