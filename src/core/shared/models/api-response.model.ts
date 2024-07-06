import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

@ApiTags('ApiResponseMetadataUnifiedModel')
export class ApiResponseMetadataUnifiedModel {
  @ApiProperty({
    description: 'Query params during get or list operations',
    example: { id: 1 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly query?: unknown;

  @ApiProperty({
    description: 'Path parama during get or list operations',
    example: { id: 1 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly params?: unknown;

  @ApiProperty({
    description: 'request body to create entry in vault',
    example: { some_field: 'value' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  readonly body?: unknown;
}

@ApiTags('ApiResponseUnifiedModel')
export class ApiResponseUnifiedModel {
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
  @Type(() => ApiResponseMetadataUnifiedModel)
  @IsOptional()
  readonly metadata?: ApiResponseMetadataUnifiedModel;

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
