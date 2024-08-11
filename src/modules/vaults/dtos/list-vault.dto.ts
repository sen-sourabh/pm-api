import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { Vault } from '../entities/vault.entity';

export class ListQueryVaultsDto extends IntersectionType(
  PickType(Vault, ['name', 'isPrivate', 'isDeleted', 'isEnabled', 'user']),
  ApiPaginateUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
