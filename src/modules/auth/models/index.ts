import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ApiTags('LoginResponse')
export class LoginResponseModel {
  @ApiProperty({
    description: 'access token for user',
    required: true,
  })
  @IsString()
  access_token: string;
}
