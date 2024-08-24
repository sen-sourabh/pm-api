import { Body, Controller, HttpCode, Post, Request, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { User } from '../../../modules/users/entities/user.entity';
import { ValidateUserPipe } from '../../../modules/users/pipes/validate-user.pipe';
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
  @Post('login')
  login(
    @Request() request: Request,
    @Body() loginRequestData: LoginRequestDto,
  ): Promise<ApiResponseModel<LoginResponseModel>> {
    return this.authService.login({ request, loginRequestData });
  }

  @ApiResponse({ status: 201, type: User })
  @ApiXResponses(
    ApiXResponsesEnum.Unauthorized,
    ApiXResponsesEnum.BadRequest,
    ApiXResponsesEnum.Conflict,
  )
  @UsePipes(ValidateUserPipe)
  @HttpCode(201)
  @Post('register')
  register(
    @Request() request: Request,
    @Body() createUserData: CreateUserDto,
  ): Promise<ApiResponseModel<User>> {
    return this.authService.register({ request, createUserData });
  }
}
