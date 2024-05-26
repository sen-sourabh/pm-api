import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerificationEmailRequestDto } from './dtos/messenger-request.dto';
import { MessengerService } from './messenger.service';

@ApiTags('Messenger')
@Controller('messenger')
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'All fields are required',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Email template not found',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'No such file or directory',
  })
  @HttpCode(200)
  @Post('send-otp')
  sendOTP(@Body() body: VerificationEmailRequestDto) {
    return this.messengerService.sendEmail(body);
  }
}