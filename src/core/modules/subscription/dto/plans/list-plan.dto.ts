import { IntersectionType, PickType } from '@nestjs/swagger';
import { ApiQueryUnifiedModel } from '../../../../shared/models/api-paginate.model';
import { Plan } from '../../entities/plan.entity';

export class ListQueryPlansDto extends IntersectionType(
  PickType(Plan, ['name', 'isDeleted', 'isEnabled']),
  ApiQueryUnifiedModel,
) {}
