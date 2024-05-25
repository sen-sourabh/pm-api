import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ApiResponseMetadataModel {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @ApiProperty({
    description: 'No of records will be fetched in single request',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pageSize?: number;
}

export class ApiResponseModel {
  @ApiProperty({
    description: 'Status code of the currect response',
    example: 200,
    required: true,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Status of the currect response',
    example: 'OK',
    required: true,
  })
  @IsObject()
  readonly status: string;

  @ApiProperty({
    description: 'Message of the currect response from an Api',
    example: 'Operation Successful',
    required: true,
  })
  @IsString()
  readonly message: string;

  @ApiProperty({
    description: 'Actual data of the currect response',
    required: false,
  })
  @IsArray()
  @IsOptional()
  readonly data?: Record<string, unknown> | Record<string, unknown>[];

  @ApiProperty({
    description: 'Metadata of the currect response',
    example: { pageNumber: 1, pageSize: 10 } as ApiResponseMetadataModel,
    required: false,
  })
  @IsObject()
  @Type(() => ApiResponseMetadataModel)
  @IsOptional()
  readonly metadata?: ApiResponseMetadataModel;

  @ApiProperty({
    description: 'Timestamp of the currect response',
    example: '2024-03-25T10:16:58.962Z',
    format: new Date().toISOString(),
    required: true,
  })
  @IsDateString({ strict: true })
  readonly timestamp: Date;
}
