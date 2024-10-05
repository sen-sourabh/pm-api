import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { ApiQueryUnifiedModel } from '../models/api-paginate.model';

@Injectable()
export class PathParamsPipe implements PipeTransform {
  transform(value: Partial<ApiQueryUnifiedModel>) {
    if (isMissing(value)) {
      throw new BadRequestException(`id is required`);
    }
    // if (!isMissing(value?.relation)) {
    //   value = {
    //     ...value,
    //     relation: value?.relation,
    //   };
    // }

    return value;
  }
}
