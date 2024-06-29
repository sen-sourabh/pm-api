import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'organizationName',
  'organizationPosition',
  'noOfEmployees',
  'password',
  'phoneNumber',
  'role',
  'usertype',
]) {
  @ApiProperty({
    description: 'Unique email of the user',
    required: true,
    uniqueItems: true,
  })
  @Column({ length: 150, type: 'varchar', unique: true })
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
