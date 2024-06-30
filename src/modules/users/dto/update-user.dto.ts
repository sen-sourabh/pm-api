import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'organizationName',
  'organizationPosition',
  'noOfEmployees',
  'otp',
  'password',
  'phoneNumber',
  'role',
  'lastLogin',
  'isLogin',
  'isEnabled',
  'isDeleted',
]) {}
