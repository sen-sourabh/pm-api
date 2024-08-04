import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiPaginateUnifiedModel } from '../../../core/shared/models/api-paginate.model';
import { ApiQueryParamUnifiedModel } from '../../../core/shared/models/api-query.model';
import { Attachment } from '../entities/attachment.entity';

export class ListQueryAttachmentsDto extends IntersectionType(
  PickType(Attachment, ['user', 'vault', 'isArchived', 'category']),
  ApiPaginateUnifiedModel,
  ApiQueryParamUnifiedModel,
) {}
