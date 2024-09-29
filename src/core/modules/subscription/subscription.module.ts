import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { Plan } from './entities/plan.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), ActivityLogsModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, Logger],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
