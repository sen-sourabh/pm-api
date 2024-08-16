import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../helpers/validations';
import { CustomFieldsService } from '../custom-fields.service';
import { UpdateCustomFieldDto } from '../dto/update-custom-field.dto';
import { generateCustomFieldKey } from '../utils';

@Injectable()
export class ValidateCustomFieldPipe implements PipeTransform {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  async transform(
    value: Partial<UpdateCustomFieldDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype === UpdateCustomFieldDto) {
      if (Object.keys(value).length === 0) {
        throw new BadRequestException('At least a field is required to update');
      }
      if (!isMissing(value?.name)) {
        value = {
          ...value,
          key: generateCustomFieldKey(value),
        };
      }
    }
    if (metadata?.type === 'param' && !isMissing(value)) {
      const isRecrodFound = await this.customFieldsService.findCustomFieldByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    }

    return value;
  }
}
