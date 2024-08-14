import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMissing } from '../../../helpers/validations';
import { CustomFieldsService } from '../custom-fields.service';
import { CreateCustomFieldDto } from '../dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from '../dto/update-custom-field.dto';

@Injectable()
export class ValidateCustomFieldPipe implements PipeTransform {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  async transform(
    value: Partial<CreateCustomFieldDto | UpdateCustomFieldDto | Record<string, unknown>>,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.metatype !== CreateCustomFieldDto || metadata?.type === 'param') {
      if (Object.keys(value).length === 0) {
        throw new BadRequestException('At least a field is required to update');
      }
      await this.whenUpdateOrDelete(value as UpdateCustomFieldDto);
    } else {
      await this.whenCreate(value as CreateCustomFieldDto);
    }

    return value;
  }

  whenUpdateOrDelete = async (value: UpdateCustomFieldDto) => {
    //Record found during update
    if (!isMissing(value) && typeof value === 'string') {
      const isRecrodFound = await this.customFieldsService.findCustomFieldByValue({ id: value });
      if (!isRecrodFound) throw new NotFoundException(`Record not found with id: ${value}`);
    } else {
      if (isMissing(value?.updatedBy)) throw new BadRequestException('User id is required');
      if (!isMissing(value?.name)) await this.checkCustomFieldNameIsUnique(value);
    }

    return true;
  };

  whenCreate = async (value: CreateCustomFieldDto) => {
    //Validate custom fiels If it is unique by name or not
    await this.checkCustomFieldNameIsUnique(value);

    return true;
  };

  checkCustomFieldNameIsUnique = async (value?: { name?: string; updatedBy?: string }) => {
    const isNameUnique = await this.customFieldsService.findCustomFieldByValue({
      name: value?.name,
      user: value?.updatedBy,
    });
    if (isNameUnique) {
      throw new ConflictException(`Name should be unique`);
    }
    return true;
  };
}
