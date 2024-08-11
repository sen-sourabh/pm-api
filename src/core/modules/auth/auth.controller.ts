import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiXResponses } from '../../shared/decorators/apply-filters/apply-filters.decorator';
import { ApiXResponsesEnum } from '../../shared/enums';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login.dto';
import { LoginResponseModel } from './models';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    description: 'returns the access_token for logged in user',
    type: LoginResponseModel,
    status: 200,
  })
  @ApiXResponses(ApiXResponsesEnum.NotFound, ApiXResponsesEnum.BadRequest)
  @HttpCode(200)
  @Post('/login')
  login(@Body() loginRequestDto: LoginRequestDto): Promise<ApiResponseModel<LoginResponseModel>> {
    return this.authService.login(loginRequestDto);
  }
}