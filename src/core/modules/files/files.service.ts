import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async uplaodFileToS3(file: any) {
    const result = await this.s3Client.send(
      new PutObjectCommand({
        BucketKeyEnabled: true,
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: file?.originalname,
        Body: file?.buffer,
      }),
    );
    console.log('result: ', result);
    return result;
  }
}
