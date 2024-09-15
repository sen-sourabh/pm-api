import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { CacheManagerModule } from '../../core/modules/cache-manager/cache-manager.module';
import { FilesModule } from '../../core/modules/files/files.module';
import { WebhooksModule } from '../../core/modules/webhooks/webhooks.module';
import { UsersModule } from '../users/users.module';
import { VaultsModule } from '../vaults/vaults.module';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    FilesModule,
    UsersModule,
    VaultsModule,
    ActivityLogsModule,
    WebhooksModule,
    CacheManagerModule,
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, Logger],
})
export class AttachmentsModule {}
