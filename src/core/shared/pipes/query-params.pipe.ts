import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let query = { ...value };
    let id: number | undefined;
    if (!isMissing(value.id)) {
      if (typeof value?.id === 'string') {
        id = parseInt(value?.id);
      }
      if (isNaN(id)) throw new BadRequestException(`id shoud be a numeric value`);
      query = { ...query, id };
    }
    if (!isMissing(value.is_default)) {
      query = { ...query, is_default: value.is_default === 'true' };
    }
    if (!isMissing(value.is_enabled)) {
      query = { ...query, is_enabled: value.is_enabled === 'true' };
    }
    if (!isMissing(value.is_deleted)) {
      query = { ...query, is_deleted: value.is_deleted === 'true' };
    }

    return {
      ...query,
    };
  }
}
