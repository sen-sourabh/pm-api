import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isMissing } from '../../../core/helpers/validations';
import { ListQueryRolesDto } from '../dto/list.dto';

@Injectable()
export class RolesQueryParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let query = { ...value };
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
    } as ListQueryRolesDto;
  }
}
