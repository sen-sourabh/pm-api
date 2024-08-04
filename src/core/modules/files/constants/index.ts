import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const FILE_VALIDATORS = {
  validators: [
    new MaxFileSizeValidator({
      maxSize: +configService?.getOrThrow('MAX_FILE_SIZE'),
    }),
    new FileTypeValidator({
      fileType: configService?.getOrThrow('ACCEPT_FILE_TYPE'),
    }),
  ],
};
