import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { UpdateProviderDto } from '../dtos/update-provider.dto';
import { ProvidersService } from '../providers.service';

@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  constructor(private readonly providersService: ProvidersService) {}

  async transform(
    value: Partial<UpdateProviderDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype === UpdateProviderDto && Object.keys(value).length === 0) {
      throw new BadRequestException('At least a field is required to update');
    }

    //Record found during update
    if (!isMissing(value) && metadata?.type === 'param') {
      const isRecrodFound = await this.providersService.findProviderByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return value;
  }
}
