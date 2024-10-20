import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { Feature } from './entities/feature.entity';
import { Plan } from './entities/plan.entity';
import { FeaturesController } from './features/feature.controller';
import { FeaturesService } from './features/feature.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, Feature]),
    ActivityLogsModule,
    WebhooksModule,
    CacheManagerModule,
  ],
  controllers: [SubscriptionController, FeaturesController],
  providers: [SubscriptionService, FeaturesService, Logger],
  exports: [SubscriptionService, FeaturesService],
})
export class SubscriptionModule {}
