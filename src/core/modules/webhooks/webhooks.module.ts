import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { WebhookHistory } from './entities/webhook-history.entity';
import { Webhook } from './entities/webhook.entity';
import { WebhookHistoriesService } from './webhook_history.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Webhook]),
    TypeOrmModule.forFeature([WebhookHistory]),
    ActivityLogsModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookHistoriesService, Logger],
  exports: [WebhooksService],
})
export class WebhooksModule {}
