import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ApiTags('ApiErrorResponseUnifiedModel')
export class ApiErrorResponseUnifiedModel {
  @ApiProperty({
    description: 'Message of the currect error response',
    example: 'Email should be unique',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly message?: string | string[] | unknown;

  @ApiProperty({
    description: '',
    example: 'Conflict',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly error?: string;

  @ApiProperty({
    description: 'Status code of the currect error response',
    example: 409,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly statusCode?: number;
}
