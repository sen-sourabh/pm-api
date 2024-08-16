import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../modules/users/entities/user.entity';
import { UsersService } from '../../../modules/users/users.service';
import { ApiResponseModel } from '../../shared/interfaces/api-response.interface';
import { LoginRequestDto } from './dtos/login.dto';
import { LoginResponseModel } from './models';
import { getLocalDateTime } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginRequestDto: LoginRequestDto): Promise<User> {
    const { email, password } = loginRequestDto;
    const data = await this.usersService.findUser({ email, password });
    if (!data) return null;
    return data;
  }

  async login(loginRequestDto: LoginRequestDto): Promise<ApiResponseModel<LoginResponseModel>> {
    const { email, password } = loginRequestDto;
    const data = await this.usersService.findUser({ email, password });

    if (!data) throw new NotFoundException(`User not found`);

    //Update login datetime
    await this.usersService.updateUser(data?.id, {
      lastLogin: getLocalDateTime(),
      isLogin: true,
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
}
