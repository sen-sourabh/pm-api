import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { AccountType } from '../entities/account_type.entity';

export class ListQueryAccountTypesDto extends IntersectionType(
  PickType(AccountType, ['name', 'isDefault', 'isEnabled', 'isDeleted']),
  ApiQueryUnifiedModel,
) {}
