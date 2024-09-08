import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { CacheManagerModule } from '../../core/modules/cache-manager/cache-manager.module';
import { WebhooksModule } from '../../core/modules/webhooks/webhooks.module';
import { Vault } from './entities/vault.entity';
import { VaultsController } from './vaults.controller';
import { VaultsService } from './vaults.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vault]),
    ActivityLogsModule,
    WebhooksModule,
    CacheManagerModule,
  ],
  controllers: [VaultsController],
  providers: [VaultsService, Logger],
  exports: [VaultsService],
})
export class VaultsModule {}
