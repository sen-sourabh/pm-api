import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Identifier } from './identifier.entity';

@Entity({
  name: 'timestamp',
  comment: 'Timestamp is just for extend/reuse',
})
@ApiTags('Timestamps')
export class Timestamp extends Identifier {
  @ApiProperty({
    description: 'With record create it`ll be auto generated',
    example: '2024-06-01T14:31:42.123Z',
    type: 'datetime',
    required: true,
    default: () => 'CURRENT_TIMESTAMP()',
    name: 'created_at',
    nullable: false,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP()' })
  created_at: Date;

  @ApiProperty({
    description: 'With record update it`ll be auto generated',
    example: '2024-06-01T14:31:42.123Z',
    type: 'datetime',
    required: false,
    default: () => 'CURRENT_TIMESTAMP()',
    name: 'updated_at',
    nullable: true,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP()' })
  updated_at: Date;
}
