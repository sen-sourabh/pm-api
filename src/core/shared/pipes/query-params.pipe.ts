import { Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any) {
    let query = { ...value };

    if (!isMissing(value.isDefault)) {
      query = { ...query, isDefault: value.isDefault === 'true' };
    }
    if (!isMissing(value.isEnabled)) {
      query = { ...query, isEnabled: value.isEnabled === 'true' };
    }
    if (!isMissing(value.isDeleted)) {
      query = { ...query, isDeleted: value.isDeleted === 'true' };
    }

    return {
      ...query,
    };
  }
}