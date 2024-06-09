import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponseModel } from './core/shared/interfaces/api-response.interface';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  isServerRunning(): ApiResponseModel<string> {
    return {
      message: `Vault is Running on ${parseInt(this.configService.getOrThrow('port'))}`,
    };
  }
}
