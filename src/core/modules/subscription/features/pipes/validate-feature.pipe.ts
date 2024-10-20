import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../../helpers/validations';
import { UpdateFeatureDto } from '../../dto/features/update.feature.dto';
import { FeaturesService } from '../feature.service';

@Injectable()
export class ValidateFeaturePipe implements PipeTransform {
  constructor(private readonly featuresService: FeaturesService) {}

  async transform(
    value: Partial<UpdateFeatureDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype === UpdateFeatureDto && Object.keys(value).length === 0) {
      throw new BadRequestException('At least a field is required to update');
    }
    if (metadata?.type === 'param' && !isMissing(value)) {
      const isRecrodFound = await this.featuresService.findFeatureByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return value;
  }
}
