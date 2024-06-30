import { PipeTransform } from '@nestjs/common';

export class PaginatePipe implements PipeTransform {
  transform(value: any) {
    let { pageNumber, pageSize } = value;
    pageNumber = parseInt(pageNumber ?? 0, 10);
    pageSize = parseInt(pageSize ?? 24, 10);

    pageNumber = Math.max(0, (pageNumber - 1) * pageSize);

    value = {
      ...value,
      pageNumber,
      pageSize,
    };

    return value;
  }
}
