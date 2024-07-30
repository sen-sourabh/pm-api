import { Module } from '@nestjs/common';
import { VaultsMetadataController } from './vaults_metadata.controller';
import { VaultsMetadataService } from './vaults_metadata.service';

@Module({
  controllers: [VaultsMetadataController],
  providers: [VaultsMetadataService],
})
export class VaultsMetadataModule {}
