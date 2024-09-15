import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLog } from './entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), CacheManagerModule],
  providers: [ActivityLogsService],
  controllers: [ActivityLogsController],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
