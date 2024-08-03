import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

export const FILE_VALIDATORS = {
  validators: [
    new MaxFileSizeValidator({
      maxSize: 10000000,
    }),
    new FileTypeValidator({
      fileType: '.(png|jpeg|jpg)',
    }),
  ],
};
