import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { Role } from '../entities/role.entity';

export class ListQueryRolesDto extends IntersectionType(
  PickType(Role, ['name', 'isDefault', 'isEnabled', 'isDeleted']),
  ApiPaginateUnifiedModel,
) {}
