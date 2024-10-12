import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../../shared/models/api-paginate.model';
import { Feature } from '../../entities/feature.entity';

export class ListQueryFeaturesDto extends IntersectionType(
  PickType(Feature, ['name', 'isDeleted', 'isEnabled']),
  ApiQueryUnifiedModel,
) {}
