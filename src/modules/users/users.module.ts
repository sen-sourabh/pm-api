import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenoModule, MenoService } from 'umeno';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { CacheManagerModule } from '../../core/modules/cache-manager/cache-manager.module';
import { FilesModule } from '../../core/modules/files/files.module';
import { MessengerModule } from '../../core/modules/messenger/messenger.module';
import { WebhooksModule } from '../../core/modules/webhooks/webhooks.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ActivityLogsModule,
    FilesModule,
    MessengerModule,
    WebhooksModule,
    CacheManagerModule,
    MenoModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger, MenoService],
  exports: [UsersService],
})
export class UsersModule {}
