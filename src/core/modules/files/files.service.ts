import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { UpoadFileS3PathEnum } from './enums/category.enum';
import { CoreFileModel, FilesResponseModel } from './models/file.model';
import { getS3FileKey, getS3ObjectUrl } from './utils';

@Injectable()
export class FilesService {
  private readonly bucket: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  // INFO: To upload files on AWS S3
  async uplaodFileToS3({
    keyExists,
    file,
    s3Path = UpoadFileS3PathEnum.DEFAULT,
    identifier = UpoadFileS3PathEnum.DEFAULT,
  }: {
    keyExists?: string;
    file: CoreFileModel;
    s3Path: string;
    identifier: string;
  }): Promise<ApiResponseModel<FilesResponseModel>> {
    try {
      // If keyExists then Delete object first and then move towards to insert
      if (keyExists) {
        const deleteCommand = this.#getDeleteObjectCommand(keyExists);
        await this.s3Client.send(deleteCommand);
        Logger.verbose(`File has been deleted from S3 with keyEsists: ${keyExists}`);
      }

      const key = getS3FileKey(identifier, file, s3Path);
      const uploadCommand = this.#getPutObjectCommand(key, file);
      await this.s3Client.send(uploadCommand);

      return {
        data: {
          url: getS3ObjectUrl(this.bucket, key),
        },
        metadata: {
          body: { file: file?.originalname },
        },
        message: 'File upload successfully',
      };
    } catch (error) {
      Logger.error(`Error from file upload to S3 ${error?.message}`);
      throw error;
    }
  }

  // INFO: Build deleteObjectCommand
  #getDeleteObjectCommand(key: string) {
    return new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
  }

  // INFO: Build putObjectCommand
  #getPutObjectCommand(key: string, file: CoreFileModel) {
    return new PutObjectCommand({
      BucketKeyEnabled: true,
      Bucket: this.bucket,
      Key: key,
      Body: file?.buffer,
      ACL: 'public-read',
      ContentType: file?.mimetype,
    });
  }
}
