import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { Role } from '../entities/role.entity';

export class ListQueryRolesDto extends IntersectionType(
  PickType(Role, ['name', 'isDefault', 'isEnabled', 'isDeleted']),
  ApiQueryUnifiedModel,
) {}
