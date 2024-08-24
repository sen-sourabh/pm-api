import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../../core/modules/activity-logs/activity-logs.module';
import { WebhooksModule } from '../../core/modules/webhooks/webhooks.module';
import { UsersModule } from '../users/users.module';
import { VaultsCollaborator } from './entities/vaults_collaborator.entity';
import { VaultsCollaboratorsController } from './vaults_collaborators.controller';
import { VaultsCollaboratorsService } from './vaults_collaborators.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VaultsCollaborator]),
    ActivityLogsModule,
    UsersModule,
    WebhooksModule,
  ],
  controllers: [VaultsCollaboratorsController],
  providers: [VaultsCollaboratorsService, Logger],
})
export class VaultsCollaboratorsModule {}
