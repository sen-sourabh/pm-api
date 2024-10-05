import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { ProviderFieldAssociation } from '../entities/provider_field_association.entity';

export class ListQueryProviderFieldAssociationsDto extends IntersectionType(
  PickType(ProviderFieldAssociation, ['provider', 'addedBy']),
  ApiQueryUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
