import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../shared/models/api-query.model';
import { CustomField } from '../entities/custom-field.entity';

export class ListQueryCustomFieldsDto extends IntersectionType(
  PickType(CustomField, ['name', 'type', 'key', 'isEnabled', 'isDeleted']),
  ApiPaginateUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
