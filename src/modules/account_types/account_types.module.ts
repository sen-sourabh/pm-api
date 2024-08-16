import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { AccountTypesController } from './account_types.controller';
import { AccountTypesService } from './account_types.service';
import { AccountType } from './entities/account_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountType]), ActivityLogsModule],
  controllers: [AccountTypesController],
  providers: [AccountTypesService, Logger],
})
export class AccountTypesModule {}
