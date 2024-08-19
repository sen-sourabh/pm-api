import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { Webhook } from './entities/webhook.entity';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Webhook]), ActivityLogsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, Logger],
  exports: [WebhooksService],
})
export class WebhooksModule {}
