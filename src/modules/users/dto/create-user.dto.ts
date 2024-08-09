import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'organizationName',
  'organizationPosition',
  'noOfEmployees',
  'phoneNumber',
  'password',
  'role',
  'accounttype',
]) {
  @ApiProperty({
    description: 'Unique email of the user',
    required: true,
    uniqueItems: true,
  })
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
