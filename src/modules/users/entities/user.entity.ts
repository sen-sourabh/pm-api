import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
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
  @ApiPropertyOptional({
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
  id?: string;

  @ApiPropertyOptional({
    description: 'first name of the user',
    required: true,
  })
  @Column({ length: 100, type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'last name of the user',
    required: false,
  })
  @Column({ length: 100, type: 'varchar', nullable: true })
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'organization name of the user',
    required: false,
  })
  @Column({ length: 255, type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  organizationName?: string;

  @ApiProperty({
    description: 'position in organization of the user',
    example: 'Sr. Manager',
    required: false,
  })
  @Column({ length: 150, type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  organizationPosition?: string;

  @ApiProperty({
    description: 'no of empoyees in organization of the user',
    required: false,
  })
  @Column({ length: 15, type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  noOfEmployees?: string;

  @ApiPropertyOptional({
    description: 'Unique email of the user',
    required: true,
    uniqueItems: true,
  })
  @Column({ length: 150, type: 'varchar', unique: true })
  @IsString({ message: 'email must be a string' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiPropertyOptional({
    description: 'password of the user',
    required: false,
  })
  @Column({ type: 'varchar', nullable: true })
  @IsString({ message: 'password must be a string' })
  @IsStrongPassword({}, { message: 'Password must be strong' })
  password?: string;

  @ApiPropertyOptional({
    description: 'otp of the user',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  otp?: number;

  @ApiPropertyOptional({
    description: 'secret key of the user',
    required: true,
  })
  @Column({ length: 255, type: 'varchar', unique: true })
  @IsString()
  @IsOptional()
  secretKey?: string;

  @ApiPropertyOptional({
    description: 'phone number of the user',
    required: true,
  })
  @Column({ type: 'bigint', unique: true })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  phoneNumber?: number;

  @ApiPropertyOptional({
    description: 'last login date time of user',
    required: false,
    name: 'lastLogin',
    nullable: true,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @IsOptional()
  lastLogin?: string;

  @ApiPropertyOptional({
    description: 'whether user logged in or not',
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isLogin?: boolean;

  @ApiPropertyOptional({
    description: 'whether user is enabled or not',
    required: true,
  })
  @Column({ type: 'tinyint', default: '1' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'whether user is deleted or not',
    required: true,
  })
  @Column({ type: 'tinyint', default: '0' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @ApiPropertyOptional({
    description: 'With record create it`ll be auto generated',
    required: true,
    name: 'createdAt',
    nullable: false,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'With record update it`ll be auto generated',
    required: false,
    name: 'updatedAt',
    nullable: true,
    format: 'T',
  })
  @IsDateString({ strict: true, strictSeparator: true })
  @UpdateDateColumn({ type: 'datetime' })
  @IsOptional()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'role of the user',
    required: true,
  })
  @ManyToOne(() => Role)
  @Column({ name: 'roleId', type: 'int' })
  role: number;

  @ApiPropertyOptional({
    description: 'usertype of the user',
    required: true,
  })
  @ManyToOne(() => Usertype)
  @Column({ name: 'usertypeId', type: 'int' })
  usertype: number;
}
