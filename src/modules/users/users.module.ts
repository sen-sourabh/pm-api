import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { FilesModule } from '../../core/modules/files/files.module';
import { MessengerModule } from '../../core/modules/messenger/messenger.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivityLogsModule, FilesModule, MessengerModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: [UsersService],
})
export class UsersModule {}
