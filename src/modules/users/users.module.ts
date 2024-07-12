import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheModuleOptions } from '../../configs/cache';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ActivityLogsModule,
    CacheModule.registerAsync({
      useFactory: () => cacheModuleOptions,
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class UsersModule {}
