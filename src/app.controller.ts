import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiResponseModel } from './core/shared/interfaces/api-response.interface';

@ApiTags('Vault')
@Controller('vault')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  isServerRunning(): ApiResponseModel<string> {
    return this.appService.isServerRunning();
  }

  // @Get('/yt-manipulator')
  // getGoogle() {
  //   console.log('hello: yt-manipulator')
  //   return true;
  // }
}
