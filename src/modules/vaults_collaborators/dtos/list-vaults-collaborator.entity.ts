import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { VaultsCollaborator } from '../entities/vaults_collaborator.entity';

export class ListQueryVaultsCollaboratorDto extends IntersectionType(
  PickType(VaultsCollaborator, ['user', 'vault', 'role', 'updatedBy', 'isEnabled']),
  ApiQueryUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
