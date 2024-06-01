import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Vault')
@Controller('vault')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  isServerRunning(): string {
    return this.appService.isServerRunning();
  }
}
