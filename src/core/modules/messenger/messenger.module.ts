import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SMTPSourceOptions } from '../../../configs/smtp';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { MessengerController } from './messenger.controller';
import { MessengerService } from './messenger.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => SMTPSourceOptions,
    }),
    ActivityLogsModule,
  ],
  controllers: [MessengerController],
  providers: [MessengerService],
  exports: [MessengerService],
})
export class MessengerModule {}
