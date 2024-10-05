import { PipeTransform } from '@nestjs/common';
import { ApiQueryUnifiedModel } from '../models/api-paginate.model';

export class PaginatePipe implements PipeTransform {
  transform(value: Partial<ApiQueryUnifiedModel>) {
    let { pageNumber, pageSize } = value;
    (pageNumber = pageNumber ?? 0), 10;
    (pageSize = pageSize ?? 24), 10;

    pageNumber = Math.max(0, (pageNumber - 1) * pageSize);

    value = {
      ...value,
      pageNumber,
      pageSize,
    };

    return value;
  }
}
