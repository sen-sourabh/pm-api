import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ApiTags('Usertypes')
@Entity('usertypes')
export class Usertype {
  @ApiProperty({
    description: 'Id is the unique number identifier',
    example: 1,
    type: 'number',
    required: true,
    name: 'id',
    nullable: false,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  @Column({ type: 'int', generated: 'increment', primary: true })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'name of the usertype',
    example: 'Individual',
    required: true,
  })
  @Column({ length: 255, type: 'varchar', unique: true })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'whether usertype is default or not',
    example: 1,
    required: true,
  })
  @Column({ type: 'tinyint', default: '1' })
  @IsBoolean()
  isDefault: boolean;

  @ApiProperty({
    description: 'whether usertype is enabled or not',
    example: 1,
    required: true,
  })
  @Column({ type: 'tinyint', default: '1' })
  @IsBoolean()
  isEnabled: boolean;

  @ApiProperty({
    description: 'whether usertype is deleted or not',
    example: 0,
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({
    description: 'With record create it`ll be auto generated',
    example: '2024-06-01T14:31:42.123Z',
    required: true,
    name: 'createdAt',
    nullable: false,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty({
    description: 'With record update it`ll be auto generated',
    example: '2024-06-01T14:31:42.123Z',
    required: false,
    name: 'updatedAt',
    nullable: true,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
