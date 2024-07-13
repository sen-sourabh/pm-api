import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class LoginRequestDto extends PickType(User, ['email', 'password']) {
  @ApiProperty({
    description: 'email of the user',
    required: true,
  })
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'password of the user',
    required: false,
  })
  @IsString({ message: 'password must be a string' })
  @IsStrongPassword({}, { message: 'password must be strong' })
  password: string;
}
