import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  
  getHello(): string {
    return `Server is Running fine on ${parseInt(this.configService.getOrThrow('port'))}`;
  }
}
