import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { AccounttypesController } from './accounttypes.controller';
import { AccounttypesService } from './accounttypes.service';
import { Accounttype } from './entities/accounttype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounttype]), ActivityLogsModule],
  controllers: [AccounttypesController],
  providers: [AccounttypesService, Logger],
})
export class AccounttypesModule {}
