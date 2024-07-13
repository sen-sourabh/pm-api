import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponseModel } from '../../core/shared/interfaces/api-response.interface';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dtos/login.dto';
import { LoginResponseModel } from './models';

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
    return {
      data: {
        access_token: this.jwtService.sign({ ...data }),
      },
      metadata: {
        body: loginRequestDto,
      },
    };
  }
}
