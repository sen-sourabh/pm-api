import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportJwtStrategy } from './strategies/jwt.strategy';
import { PassportLocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'bb041126b4c17ebc94c3054619d32da04ffec62c4c397f38f1f2ae9ac6fffb7f',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, PassportLocalStrategy, PassportJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
