import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../../helpers/validations';
import { UpdatePlanDto } from '../../dto/plans/update-plan.dto';
import { PlansService } from '../plan.service';

@Injectable()
export class ValidatePlanPipe implements PipeTransform {
  constructor(private readonly plansService: PlansService) {}

  async transform(
    value: Partial<UpdatePlanDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype === UpdatePlanDto && Object.keys(value).length === 0) {
      throw new BadRequestException('At least a field is required to update');
    }
    if (metadata?.type === 'param' && !isMissing(value)) {
      const isRecrodFound = await this.plansService.findPlanByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return value;
  }
}
