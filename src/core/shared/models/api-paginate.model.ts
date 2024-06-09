import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ApiPaginateUnifiedModel {
  @ApiProperty({
    description: 'Page number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiProperty({
    description: 'No of records will be fetched in single request',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  take?: number;
}
