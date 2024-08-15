import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { ProviderFieldAssociation } from './entities/provider_field_association.entity';
import { ProviderFieldAssociationsController } from './provider_field_associations.controller';
import { ProviderFieldAssociationsService } from './provider_field_associations.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderFieldAssociation]), ActivityLogsModule],
  controllers: [ProviderFieldAssociationsController],
  providers: [ProviderFieldAssociationsService, Logger],
})
export class ProviderFieldAssociationsModule {}
