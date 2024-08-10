import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtModuleOptions } from '../../configs/jwt';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportJwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register(jwtModuleOptions), ActivityLogsModule],
  providers: [AuthService, PassportJwtStrategy, Logger],
  controllers: [AuthController],
  exports: [PassportJwtStrategy],
})
export class AuthModule {}
