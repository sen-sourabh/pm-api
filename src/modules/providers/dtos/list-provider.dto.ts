import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { Provider } from '../entities/provider.entity';

export class ListQueryProvidersDto extends IntersectionType(
  PickType(Provider, ['vault', 'name', 'addedBy', 'isEnabled', 'isDeleted']),
  ApiQueryUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
