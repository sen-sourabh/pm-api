import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { CustomFieldsController } from './custom-fields.controller';
import { CustomFieldsService } from './custom-fields.service';
import { CustomField } from './entities/custom-field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomField]),
    ActivityLogsModule,
    WebhooksModule,
    CacheManagerModule,
  ],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService, Logger],
})
export class CustomFieldsModule {}
