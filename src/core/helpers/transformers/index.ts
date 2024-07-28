import { TransformFnParams } from 'class-transformer';
import { LoginRequestDto } from '../../../modules/auth/dtos/login.dto';
import { CoreFileModel } from '../../modules/files/models/file.model';
import { base64Decode } from '../security';

export const stringToBoolean = (params: TransformFnParams): boolean => {
  const value = params.value as string;
  return value === 'true' || value === '1';
};

export const getFileName = (filename: string): string => {
  return filename?.trim()?.toString()?.split('.')?.[0];
};

export const getFileExtension = (filename: string): string => {
  return filename?.trim()?.toString()?.split('.')?.pop();
};

export const replaceSpecialCharactersWithHyphen = (filename: string): string => {
  return filename?.replace(/[^\w\-]+/g, '-');
};

export const getUsersFileKey = ({ originalname }: CoreFileModel, s3Path: string): string => {
  const filename = getFileName(originalname);
  const extension = getFileExtension(originalname);
  return `${s3Path}/${Date.now()}-${replaceSpecialCharactersWithHyphen(filename)}.${extension}`;
};

export const getS3ObjectUrl = (bucket: string, fileKey: string): string => {
  return `https://${bucket}.s3.amazonaws.com/${fileKey}`;
};

export const fetchHeaders = (request: any) => {
  const payload = base64Decode(request?.headers?.authorization?.split(' ')?.[1]);
  const userdata = payload?.split(':');

  return {
    email: userdata?.[0],
    password: userdata?.[1],
  } as LoginRequestDto;
};
