import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  'accountType',
]) {
  @ApiProperty({
    description: 'Unique email of the user',
    required: true,
    uniqueItems: true,
  })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
