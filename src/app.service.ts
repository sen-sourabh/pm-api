import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  isServerRunning(): string {
    return `Vault is Running on ${parseInt(this.configService.getOrThrow('port'))}`;
  }
}
