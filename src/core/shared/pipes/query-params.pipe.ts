import { Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../helpers/validations';

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any) {
    let query = { ...value };

    if (!isMissing(value?.isDefault)) {
      query = {
        ...query,
        isDefault: value?.isDefault === 'true',
      };
    }
    if (!isMissing(value?.isEnabled)) {
      query = {
        ...query,
        isEnabled: value?.isEnabled === 'true',
      };
    }
    if (!isMissing(value?.isDeleted)) {
      query = {
        ...query,
        isDeleted: value?.isDeleted === 'true',
      };
    }
    if (!isMissing(value?.isArchived)) {
      query = {
        ...query,
        isArchived: value?.isArchived === 'true',
      };
    }
    if (!isMissing(value?.relation)) {
      query = {
        ...query,
        relation: value?.relation === 'true',
      };
    }
    if (!isMissing(value?.isPrivate)) {
      query = {
        ...query,
        isPrivate: value?.isPrivate === 'true',
      };
    }

    return {
      ...query,
    };
  }
}
