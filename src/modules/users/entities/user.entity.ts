import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Timestamp } from '../../../core/entities/timestamp.entity';

@Entity('users')
@ApiTags('Users')
export class User extends Timestamp {
  @ApiPropertyOptional({
    description: 'first name of the user',
    example: 'John',
    required: false,
  })
  @Column({ length: 100, type: 'varchar' })
  @IsString()
  readonly first_name?: string;

  @ApiPropertyOptional({
    description: 'last name of the user',
    example: 'Snow',
    required: false,
  })
  @Column({ length: 100, type: 'varchar' })
  @IsString()
  readonly last_name?: string;

  @ApiPropertyOptional({
    description: 'organization name of the user',
    example: 'ABC Inc.',
    required: false,
  })
  @Column({ length: 255, type: 'varchar', unique: true })
  @IsString()
  readonly organization_name?: string;

  @ApiPropertyOptional({
    description: 'position in organization of the user',
    example: 'Sr. Manager',
    required: false,
  })
  @Column({ length: 150, type: 'varchar' })
  @IsString()
  readonly organization_position?: string;

  @ApiPropertyOptional({
    description: 'no of empoyees in organization of the user',
    example: '100',
    required: false,
  })
  @Column({ length: 15, type: 'varchar' })
  @IsString()
  readonly no_of_employees?: string;

  @ApiProperty({
    description: 'unique email of the user',
    example: 'example@gmail.com',
    required: true,
    uniqueItems: true,
  })
  @Column({ length: 150, type: 'varchar', unique: true })
  @IsString({ message: 'email is required' })
  readonly email: string;

  @ApiProperty({
    description: 'password of the user',
    example: 'Welcome@123',
    required: true,
  })
  @Column({ type: 'varchar' })
  @IsString({ message: 'password is required' })
  readonly password: string;

  @ApiPropertyOptional({
    description: 'otp of the user',
    example: 123456,
    required: false,
  })
  @Column({ type: 'int' })
  @IsNumber()
  readonly otp?: number;

  @ApiProperty({
    description: 'secret key of the user',
    example: 'd75QBLtPQTRL0x0umobtGqgOWJbKf3yE5U75+bMGK9s=',
    required: false,
  })
  @Column({ length: 255, type: 'varchar', unique: true })
  @IsString()
  readonly secret_key: string;

  @ApiPropertyOptional({
    description: 'phone number of the user',
    example: 1234567890,
    required: false,
  })
  @Column({ type: 'bigint', unique: true })
  @IsPhoneNumber()
  @IsOptional()
  readonly phone_number?: number;

  @ApiProperty({
    description: 'role id of the user',
    example: 1,
    required: true,
  })
  @Column({ type: 'int' })
  @IsNumber()
  readonly roles_id: number;

  @ApiProperty({
    description: 'user type id of the user',
    example: 1,
    required: true,
  })
  @Column({ type: 'int' })
  @IsNumber()
  readonly user_types_id: number;

  @ApiPropertyOptional({
    description: 'last login datetime of the user',
    example: '2024-06-01T14:31:42.123Z',
    type: 'datetime',
    required: false,
    default: null,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @IsOptional()
  readonly last_login?: Date;

  @ApiProperty({
    description: 'whether user logged in or not',
    example: false,
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @IsBoolean()
  readonly is_login: boolean;

  @ApiProperty({
    description: 'whether user enabled by admin or not',
    example: true,
    required: true,
  })
  @Column({ type: 'tinyint', default: '1' })
  @IsBoolean()
  readonly is_enabled: boolean;

  @ApiProperty({
    description: 'whether user deleted or not',
    example: false,
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @IsBoolean()
  readonly is_deleted: boolean;
}
