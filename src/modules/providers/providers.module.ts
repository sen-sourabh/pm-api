import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { CacheManagerModule } from '../../core/modules/cache-manager/cache-manager.module';
import { WebhooksModule } from '../../core/modules/webhooks/webhooks.module';
import { Provider } from './entities/provider.entity';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
    ActivityLogsModule,
    WebhooksModule,
    CacheManagerModule,
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService, Logger],
  exports: [ProvidersService],
})
export class ProvidersModule {}
