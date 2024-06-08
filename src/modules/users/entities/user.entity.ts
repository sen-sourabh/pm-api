import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@ApiTags('Users')
export class User {
  @ApiProperty({
    description: 'Id is the unique uuid identifier',
    example: 'e762634c-3e41-11eb-b897-0862660ccbd4',
    type: 'string',
    required: true,
    default: 'uuid',
    name: 'id',
    nullable: false,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  @Column({ length: 150, type: 'varchar', primary: true })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: 'first name of the user',
    example: 'John',
    required: false,
  })
  @Column({ length: 100, type: 'varchar', nullable: true })
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({
    description: 'last name of the user',
    example: 'Snow',
    required: false,
  })
  @Column({ length: 100, type: 'varchar', nullable: true })
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'organization name of the user',
    example: 'ABC Inc.',
    required: false,
  })
  @Column({ length: 255, type: 'varchar', nullable: true })
  @IsString()
  organization_name?: string;

  @ApiPropertyOptional({
    description: 'position in organization of the user',
    example: 'Sr. Manager',
    required: false,
  })
  @Column({ length: 150, type: 'varchar', nullable: true })
  @IsString()
  organization_position?: string;

  @ApiPropertyOptional({
    description: 'no of empoyees in organization of the user',
    example: '100',
    required: false,
  })
  @Column({ length: 15, type: 'varchar', nullable: true })
  @IsString()
  no_of_employees?: string;

  @ApiProperty({
    description: 'unique email of the user',
    example: 'example@gmail.com',
    required: true,
    uniqueItems: true,
  })
  @Column({ length: 150, type: 'varchar', unique: true })
  @IsString({ message: 'email is required' })
  email: string;

  @ApiProperty({
    description: 'password of the user',
    example: 'Welcome@123',
    required: false,
  })
  @Column({ type: 'varchar', nullable: true })
  @IsString({ message: 'password is required' })
  password?: string;

  @ApiPropertyOptional({
    description: 'otp of the user',
    example: 123456,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  @IsNumber()
  otp?: number;

  @ApiProperty({
    description: 'secret key of the user',
    example: 'd75QBLtPQTRL0x0umobtGqgOWJbKf3yE5U75+bMGK9s=',
    required: true,
  })
  @Column({ length: 255, type: 'varchar', unique: true })
  @IsString()
  secret_key: string;

  @ApiProperty({
    description: 'phone number of the user',
    example: 1234567890,
    required: true,
  })
  @Column({ type: 'bigint', unique: true })
  @IsPhoneNumber()
  phone_number: number;

  @ApiProperty({
    description: 'role id of the user',
    example: 1,
    required: true,
  })
  @Column({ type: 'int' })
  @IsNumber()
  roles_id: number;

  @ApiProperty({
    description: 'user type id of the user',
    example: 1,
    required: true,
  })
  @Column({ type: 'int' })
  @IsNumber()
  user_types_id: number;

  @ApiPropertyOptional({
    description: 'last login datetime of the user',
    example: '2024-06-01T14:31:42.123Z',
    required: false,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @IsOptional()
  last_login?: Date;

  @ApiProperty({
    description: 'whether user logged in or not',
    example: false,
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @IsBoolean()
  is_login: boolean;

  @ApiProperty({
    description: 'whether user enabled by admin or not',
    example: true,
    required: true,
  })
  @Column({ type: 'tinyint', default: '1' })
  @IsBoolean()
  is_enabled: boolean;

  @ApiProperty({
    description: 'whether user deleted or not',
    example: false,
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @IsBoolean()
  is_deleted: boolean;

  @ApiProperty({
    description: 'With record create it`ll be auto generated',
    example: '2024-06-01T14:31:42.123Z',
    required: true,
    name: 'created_at',
    nullable: false,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ApiProperty({
    description: 'With record update it`ll be auto generated',
    example: '2024-06-01T14:31:42.123Z',
    required: true,
    name: 'updated_at',
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at: Date;
}
