import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

@ApiTags('ApiResponseMetadataCommonModel')
export class ApiResponseMetadataCommonModel {
  @ApiProperty({
    description: 'any extra query during list',
    example: { id: 1 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly query?: unknown;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly pageNumber?: number;

  @ApiProperty({
    description: 'No of records will be fetched in single request',
    example: 25,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly pageSize?: number;
}

@ApiTags('ApiResponseCommonModel')
export class ApiResponseCommonModel {
  @ApiProperty({
    description: 'Actual data of the currect response',
    required: false,
  })
  @IsArray()
  @IsOptional()
  readonly data?: unknown;

  @ApiProperty({
    description: 'Metadata of the currect response',
    required: false,
  })
  @IsObject()
  @Type(() => ApiResponseMetadataCommonModel)
  @IsOptional()
  readonly metadata?: ApiResponseMetadataCommonModel;

  @ApiProperty({
    description: 'Status code of the currect response',
    example: 200,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly statusCode?: number;

  @ApiProperty({
    description: 'Status of the currect response',
    example: 'OK',
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly status?: string;

  @ApiProperty({
    description: 'Message of the currect response from an Api',
    example: 'Operation Successful',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly message?: string;

  @ApiProperty({
    description: 'Timestamp of the currect response',
    example: '2024-03-25T10:16:58.962Z',
    format: new Date().toISOString(),
    required: false,
  })
  @IsDateString({ strict: true })
  @IsOptional()
  readonly timestamp?: Date;
}
