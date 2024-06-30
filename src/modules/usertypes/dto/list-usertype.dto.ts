import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { Usertype } from '../entities/usertype.entity';

export class ListQueryUsertypesDto extends IntersectionType(
  PickType(Usertype, ['name', 'isDefault', 'isEnabled', 'isDeleted']),
  ApiPaginateUnifiedModel,
) {}
