import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { Vault } from './entities/vault.entity';
import { VaultsController } from './vaults.controller';
import { VaultsService } from './vaults.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vault]), ActivityLogsModule],
  controllers: [VaultsController],
  providers: [VaultsService, Logger],
})
export class VaultsModule {}
