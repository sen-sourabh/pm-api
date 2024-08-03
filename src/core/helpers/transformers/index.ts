import { TransformFnParams } from 'class-transformer';
import { CreateAttachmentDto } from '../../../modules/attachments/dtos/create-attachment.dto';
import { LoginRequestDto } from '../../../modules/auth/dtos/login.dto';
import { CategoryEnum, UpoadFileS3PathEnum } from '../../modules/files/enums/category.enum';
import { CoreFileModel } from '../../modules/files/models/file.model';
import { base64Decode } from '../security';

export const stringToBoolean = (params: TransformFnParams): boolean => {
  const value = params.value as string;
  return value === 'true' || value === '1';
};

export const getFileName = (filename: string): string => {
  return replaceSpecialCharactersWithHyphen(filename?.trim()?.toString()?.split('.')?.[0]);
};

export const getFileExtension = (filename: string): string => {
  return filename?.trim()?.toString()?.split('.')?.pop();
};

export const replaceSpecialCharactersWithHyphen = (filename: string): string => {
  return filename?.replace(/[^\w\-]+/g, '-');
};

export const getS3FileKey = (
  identifier: string,
  { originalname }: CoreFileModel,
  s3Path: string,
): string => {
  const filename = getFileName(originalname);
  const extension = getFileExtension(originalname);
  return `${s3Path}/${identifier?.replaceAll('/', '')}/${Date.now()}-${filename}.${extension}`;
};

export const getS3ObjectUrl = (bucket: string, fileKey: string): string => {
  return `https://${bucket}.s3.amazonaws.com/${fileKey}`;
};

export const getUsersS3Path = ({ category }: CreateAttachmentDto): string => {
  return category?.trim().toString() === CategoryEnum.PROFILE
    ? UpoadFileS3PathEnum.USERS_PROFILES
    : UpoadFileS3PathEnum.USERS_ADDITIONALS;
};

export const getVaultsS3Path = ({ category }: CreateAttachmentDto): string => {
  return category?.trim().toString() === CategoryEnum.PROFILE
    ? UpoadFileS3PathEnum.VAULTS_PROFILES
    : UpoadFileS3PathEnum.VAULTS_ADDITIONALS;
};

export const fetchHeaders = (request: any) => {
  const payload = base64Decode(request?.headers?.authorization?.split(' ')?.[1]);
  const userdata = payload?.split(':');

  return {
    email: userdata?.[0],
    password: userdata?.[1],
  } as LoginRequestDto;
};
