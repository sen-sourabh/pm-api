import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';

@Injectable()
export class RolesPathParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isMissing(value)) {
      throw new BadRequestException(`id is required`);
    }

    return value;
  }
}
