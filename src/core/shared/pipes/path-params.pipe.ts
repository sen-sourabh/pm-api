import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';

@Injectable()
export class PathParamsPipe implements PipeTransform {
  transform(value: any) {
    if (isMissing(value)) {
      throw new BadRequestException(`id is required`);
    }
    if (!isMissing(value?.relation)) {
      value = {
        ...value,
        relation: value?.relation === 'true',
      };
    }

    return value;
  }
}
