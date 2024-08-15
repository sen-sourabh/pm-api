import { Module } from '@nestjs/common';
import { DynamicFieldsService } from './dynamic-fields.service';

@Module({
  providers: [DynamicFieldsService],
  exports: [DynamicFieldsService],
})
export class DynamicFieldsModule {}
