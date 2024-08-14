import { Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../helpers/validations';
import { CreateCustomFieldDto } from '../dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from '../dto/update-custom-field.dto';
import { generateCustomFieldKey } from '../utils';

@Injectable()
export class BodyParserPipe implements PipeTransform {
  transform(value: Partial<CreateCustomFieldDto | UpdateCustomFieldDto | Record<string, unknown>>) {
    let updateValue: Partial<CreateCustomFieldDto | UpdateCustomFieldDto | Record<string, unknown>>;
    //append auto generated secret key with body
    if (!isMissing(value?.name)) {
      updateValue = {
        ...value,
        key: generateCustomFieldKey(value),
      };
    }

    return updateValue;
  }
}
