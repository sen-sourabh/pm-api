import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { User } from '../entities/user.entity';

export class ListQueryUsersDto extends IntersectionType(
  PickType(User, ['email', 'isDeleted', 'isEnabled', 'phoneNumber', 'role', 'accountType']),
  ApiQueryUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
