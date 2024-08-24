import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { User } from '../../../modules/users/entities/user.entity';
import { UsersService } from '../../../modules/users/users.service';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { LoginRequestDto } from './dtos/login.dto';
import { LoginResponseModel } from './models';
import { getLocalDateTime } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginRequestDto: LoginRequestDto): Promise<User> {
    const { email, password } = loginRequestDto;
    const data = await this.usersService.findUser({ email, password });
    if (!data) return null;
    return data;
  }

  async login({
    request,
    loginRequestData,
  }: {
    request: Request;
    loginRequestData: LoginRequestDto;
  }): Promise<ApiResponseModel<LoginResponseModel>> {
    const { email, password } = loginRequestData;
    const data = await this.usersService.findUser({
      email,
      password,
      isDeleted: false,
      isEnabled: true,
    });

    if (!data) throw new NotFoundException(`Invalid email or password`);

    //Update login datetime
    await this.usersService.updateUser({
      request,
      id: data?.id,
      updateUserData: {
        lastLogin: getLocalDateTime(),
        isLogin: true,
      },
    });

    return {
      data: {
        access_token: this.jwtService.sign({
          email,
          id: data?.id,
        }),
      },
    };
  }

  async register({
    request,
    createUserData,
  }: {
    request: Request;
    createUserData: CreateUserDto;
  }): Promise<ApiResponseModel<User>> {
    return await this.usersService.createUser({ request, createUserData });
  }
}
