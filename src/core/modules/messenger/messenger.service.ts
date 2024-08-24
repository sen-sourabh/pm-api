import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { compile } from 'handlebars';
import { generateOTP } from '../../helpers/security';
import { isMissing } from '../../helpers/validations';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { VerificationEmailRequestDto } from './dtos/messenger-request.dto';

@Injectable()
export class MessengerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  // async sendEmail(data: Partial<VerificationEmailRequestDto>) {
  //   try {
  //attachments
  // let fileAttached: EmailAttachmentsRequestDto[] = [];
  // if (data?.attachments) {
  //   fileAttached = [
  //     {
  //       filename: 'sample_one.pdf',
  //       path: 'src/assets/pdfs/sample_one.pdf', // Path to the attachment file
  //     },
  //     {
  //       filename: 'sample_two.pdf',
  //       path: 'src/assets/pdfs/sample_two.pdf', // Path to the attachment file
  //     },
  //   ];
  // }
  //Send Email
  // const response = await this.mailerService.sendMail({
  //   to: data?.email,
  //   subject: data?.subject,
  //   template: 'otp',
  //   attachments: fileAttached,
  //   html: await this.#hbsCompiler('/emails/simple.hbs', context),
  // });
  //Handle Response
  // if (response.messageId) {
  //   return {
  //     data: {
  //       messageId: response?.messageId,
  //       accepted: response?.accepted,
  //       rejected: response?.rejected,
  //     },
  //     metadata: {
  //       body: data,
  //     },
  //     message: 'Email sent successfully.',
  //   };
  // }
  // return response;
  //   } catch (error) {
  //     console.log('Service Error: ', error);
  //     // throw new InternalServerErrorException('Failed to send email: ', error?.message.toString());
  //     return error;
  //   }
  // }

  async sendAccountVerificationEmail(data: Partial<VerificationEmailRequestDto>) {
    try {
      if (data?.email?.length === 0)
        throw new BadRequestException('At least one email is required');

      const content = {
        email: data?.email?.[0],
        username: data?.username,
        linkWithEmail: `https://www.google.com/search?q=${data?.email?.[0]}`,
      };

      const response = await this.#triggerEmail({
        data,
        content,
        hbsTemplatePath: '/emails/account_verification.hbs',
      });

      if (isMissing(response.messageId) && isMissing(response?.accepted)) {
        return false;
      }
      Logger.verbose(`Account verification email has been sent to: ${data?.email?.[0]}`);

      return true;
    } catch (error) {
      Logger.error(`Error in account verification email operation: ${error?.message}`);
      return error;
    }
  }

  async sendOTPEmail(data: Partial<VerificationEmailRequestDto>) {
    try {
      if (data?.email?.length === 0)
        throw new BadRequestException('At least one email is required');

      const content = {
        otp: generateOTP(),
      };

      const response = await this.#triggerEmail({
        data,
        content,
        hbsTemplatePath: '/emails/simple.hbs',
      });

      console.log('response: ', response);
      if (isMissing(response.messageId) && isMissing(response?.accepted)) {
        return false;
      }

      return true;
    } catch (error) {
      Logger.error(`Error in otp email operation: ${error?.message}`);
      return error;
    }
  }

  async #triggerEmail({
    data,
    content,
    hbsTemplatePath,
    fileAttached,
  }: {
    data: Partial<VerificationEmailRequestDto>;
    content: Record<string, unknown>;
    hbsTemplatePath: string;
    fileAttached?: string[];
  }) {
    try {
      //Send Email
      const response = await this.mailerService.sendMail({
        to: data?.email,
        subject: data?.subject,
        template: 'otp',
        attachments: fileAttached,
        html: await this.#hbsCompiler(hbsTemplatePath, content),
      });
      return response;
    } catch (error) {
      Logger.error(`Error in sending email: ${error?.message}`);
      return error;
    }
  }

  async #hbsCompiler(templatePath: string, content: Record<string, unknown>) {
    try {
      const htmlContent = await fsPromises.readFile(__dirname + templatePath, {
        encoding: 'utf8',
      });
      if (!htmlContent) throw new NotFoundException('Failed to read the template file');
      const template = compile(htmlContent);
      if (!template) throw new NotFoundException('Failed to compile the template');
      return template(content);
    } catch (error) {
      Logger.error('Failed to read the template file: ', error?.message.toString());
      return error;
    }
  }
}
