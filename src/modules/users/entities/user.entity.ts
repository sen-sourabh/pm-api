import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Usertype } from '../../usertypes/entities/usertype.entity';

@ApiTags('Users')
@Entity('users')
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
  @Column({ length: 150, primary: true, generated: 'uuid' })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: 'first name of the user',
    example: 'John',
    required: false,
  })
  @Column({ length: 100, type: 'varchar', nullable: true })
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'last name of the user',
    example: 'Snow',
    required: false,
  })
  @Column({ length: 100, type: 'varchar', nullable: true })
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'organization name of the user',
    example: 'ABC Inc.',
    required: false,
  })
  @Column({ length: 255, type: 'varchar', nullable: true })
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({
    description: 'position in organization of the user',
    example: 'Sr. Manager',
    required: false,
  })
  @Column({ length: 150, type: 'varchar', nullable: true })
  @IsString()
  organizationPosition?: string;

  @ApiPropertyOptional({
    description: 'no of empoyees in organization of the user',
    example: '100',
    required: false,
  })
  @Column({ length: 15, type: 'varchar', nullable: true })
  @IsString()
  noOfEmployees?: string;

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
  secretKey: string;

  @ApiProperty({
    description: 'phone number of the user',
    example: 1234567890,
    required: true,
  })
  @Column({ type: 'bigint', unique: true })
  @IsPhoneNumber()
  phoneNumber: number;

  @ApiProperty({
    description: 'last login date time of user',
    example: '2024-06-01T14:31:42.123Z',
    required: false,
    name: 'last_login',
    nullable: true,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  lastLogin?: Date;

  @ApiProperty({
    description: 'whether user logged in or not',
    example: 0,
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @IsBoolean()
  isLogin: boolean;

  @ApiProperty({
    description: 'whether user is enabled or not',
    example: 1,
    required: true,
  })
  @Column({ type: 'tinyint', default: '1' })
  @IsBoolean()
  isEnabled: boolean;

  @ApiProperty({
    description: 'whether user is deleted or not',
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

  @ApiProperty({
    description: 'role id of the user',
    example: 1,
    required: true,
  })
  @ManyToOne(() => Role)
  @Column({ name: 'roleId', type: 'int' })
  role: number;

  @ApiProperty({
    description: 'usertype id of the user',
    example: 1,
    required: true,
  })
  @ManyToOne(() => Usertype)
  @Column({ name: 'usertypeId', type: 'int' })
  usertype: number;
}
