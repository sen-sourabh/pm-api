import { CreateAttachmentDto } from '../../../../modules/attachments/dtos/create-attachment.dto';
import { CategoryEnum, UpoadFileS3PathEnum } from '../enums/category.enum';
import { CoreFileModel } from '../models/file.model';

const ONE_KB = 1024;
const ONE_MB = ONE_KB * ONE_KB;
const ONE_GB = ONE_MB * ONE_KB;

// INFO: Function Not In-Use
export const convertBytesToHumanReadable = (bytes: number): string => {
  if (bytes < ONE_KB) {
    return `${bytes} B`;
  } else if (bytes < ONE_MB) {
    return `${(bytes / ONE_KB).toFixed(2)} KB`;
  } else if (bytes < ONE_GB) {
    return `${(bytes / ONE_MB).toFixed(2)} MB`;
  } else {
    return `${(bytes / ONE_GB).toFixed(2)} GB`;
  }
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
  return `${s3Path}/${identifier?.replaceAll('-', '')}/${Date.now()}-${filename}.${extension}`;
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
