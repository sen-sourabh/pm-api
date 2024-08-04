import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { VaultsCollaborator } from '../entities/vaults_collaborator.entity';

export class ListQueryVaultsCollaboratorDto extends IntersectionType(
  PickType(VaultsCollaborator, ['user', 'vault', 'access', 'addedBy', 'isEnabled']),
  ApiPaginateUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
