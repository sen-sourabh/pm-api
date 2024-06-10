import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';

@Injectable()
export class PathParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isMissing(value)) {
      throw new BadRequestException(`id is required`);
    }
    if (isNaN(value)) throw new BadRequestException(`id shoud be a numeric value`);

    return value;
  }
}
