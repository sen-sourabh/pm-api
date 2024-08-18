import { Logger, Module } from '@nestjs/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    // TypeOrmModule.forFeature([]),
    ActivityLogsModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, Logger],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
