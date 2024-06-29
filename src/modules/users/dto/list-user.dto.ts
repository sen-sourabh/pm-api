import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { User } from '../entities/user.entity';

export class ListQueryUsersDto extends IntersectionType(
  PickType(User, [
    'email',
    'isDeleted',
    'isEnabled',
    'phoneNumber',
    'role',
    'usertype',
    'updatedAt',
  ]),
  ApiPaginateUnifiedModel,
) {}
