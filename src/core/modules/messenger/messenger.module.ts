import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SMTPSourceOptions } from '../../../configs/smtp';
import { MessengerController } from './messenger.controller';
import { MessengerService } from './messenger.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => SMTPSourceOptions,
    }),
  ],
  controllers: [MessengerController],
  providers: [MessengerService],
})
export class MessengerModule {}
