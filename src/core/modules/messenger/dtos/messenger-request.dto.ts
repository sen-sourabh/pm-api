import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EmailPurposeEnum, ExpiryTimeUnitEnum } from '../enums';

export class VerificationEmailRequestDto {
  @ApiProperty({
    description: 'Name of the receiver',
    example: 'Alan',
    maxLength: 100,
    nullable: false,
    required: true,
  })
  @IsString({ message: 'Username is required.' })
  readonly username: string;

  @ApiProperty({
    description: 'Receiver emails seperated by comma',
    example: ['alan@gmail.com', 'alex@gmail.com'],
    nullable: false,
    required: true,
  })
  @IsArray({ message: 'Email is required & Should be seperated by comma' })
  readonly email: string[];

  @ApiProperty({
    description: 'Subject of sending email',
    example: 'Here is the subject',
    nullable: false,
    required: true,
  })
  @IsString({ message: 'Subject is required.' })
  readonly subject: string;

  @ApiProperty({
    description: 'Purpose of email',
    example: EmailPurposeEnum.ACCOUNT_VERIFICATION,
    nullable: false,
    required: true,
    enum: EmailPurposeEnum,
  })
  @IsEnum(EmailPurposeEnum, {
    message: 'Purpose is required and Should be from the declared enums',
  })
  readonly purpose: EmailPurposeEnum.ACCOUNT_VERIFICATION;

  @ApiProperty({
    description: 'Set to true, If mail content attachments',
    example: false,
    nullable: false,
    required: true,
  })
  @IsBoolean({ message: 'Attachments is required' })
  readonly attachments: boolean;

  @ApiProperty({
    description: 'Time of expiry of pascode/link (If any included in email)',
    example: 10,
    nullable: false,
    required: true,
  })
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
  readonly expiry_time: number;

  @ApiProperty({
    description: 'Unit of expiry time of passcode/link ()If any included in email)',
    example: ExpiryTimeUnitEnum.MINUTES,
    nullable: false,
    required: true,
    enum: ExpiryTimeUnitEnum,
  })
  @IsEnum(ExpiryTimeUnitEnum, {
    message: 'Unit is required and Should be from the declared enums',
  })
  readonly expiry_unit: ExpiryTimeUnitEnum.MINUTES;
}

export class EmailAttachmentsRequestDto {
  @ApiProperty({
    description: 'Name of the file/attachment with extension',
    example: 'document.pdf',
    required: true,
  })
  @IsString({ message: 'Filename is required.' })
  readonly filename: string;

  @ApiProperty({
    description: 'Path the file with filename including extension',
    example: 'src/assets/pdfs/sample_one.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly path?: string; // Path to the attachment file

  @ApiProperty({
    description: 'binary of the file/attachment',
    example: 'hahfisdhfhasiu986273yrffhsudfh',
    required: false,
  })
  @IsOptional()
  readonly content?: Buffer;
}