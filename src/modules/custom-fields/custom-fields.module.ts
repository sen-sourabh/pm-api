import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { DynamicFieldsModule } from '../../core/modules/dynamic-fields/dynamic-fields.module';
import { CustomFieldsController } from './custom-fields.controller';
import { CustomFieldsService } from './custom-fields.service';
import { CustomField } from './entities/custom-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomField]), ActivityLogsModule, DynamicFieldsModule],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService, Logger],
})
export class CustomFieldsModule {}
