import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginRequestDto } from '../dtos/login.dto';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // Override the default usernameField
      passwordField: 'password', // Optional: You can also override the passwordField
    });
  }

  async validate(loginRequestDto: LoginRequestDto): Promise<boolean> {
    const data = await this.authService.validateUser(loginRequestDto);
    if (!data) {
      return false;
    }
    return true;
  }
}
