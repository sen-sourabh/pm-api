import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookEvent]), ActivityLogsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, Logger],
  exports: [WebhooksService],
})
export class WebhooksModule {}
