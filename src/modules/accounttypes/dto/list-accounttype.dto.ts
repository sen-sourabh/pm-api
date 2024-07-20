import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { Accounttype } from '../entities/accounttype.entity';

export class ListQueryAccounttypesDto extends IntersectionType(
  PickType(Accounttype, ['name', 'isDefault', 'isEnabled', 'isDeleted']),
  ApiPaginateUnifiedModel,
) {}
