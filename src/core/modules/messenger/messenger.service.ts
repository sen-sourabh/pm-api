import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { compile } from 'handlebars';
import { generateOTP } from '../../helpers/security';
import {
  EmailAttachmentsRequestDto,
  VerificationEmailRequestDto,
} from './dtos/messenger-request.dto';

@Injectable()
export class MessengerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: Partial<VerificationEmailRequestDto>) {
    if (data?.email?.length === 0) throw new BadRequestException('At least one email is required');

    //Email content
    const context: Record<string, unknown> = {
      otp: generateOTP(),
      ...data,
    };

    try {
      //attachments
      let fileAttached: EmailAttachmentsRequestDto[] = [];
      if (data?.attachments) {
        fileAttached = [
          {
            filename: 'sample_one.pdf',
            path: 'src/assets/pdfs/sample_one.pdf', // Path to the attachment file
          },
          {
            filename: 'sample_two.pdf',
            path: 'src/assets/pdfs/sample_two.pdf', // Path to the attachment file
          },
        ];
      }
      //Send Email
      const response = await this.mailerService.sendMail({
        to: data?.email,
        subject: data?.subject,
        template: 'otp',
        attachments: fileAttached,
        html: await this.hbsCompiler('/emails/simple.hbs', context),
      });

      //Handle Response
      if (response.messageId) {
        return {
          data: {
            messageId: response?.messageId,
            accepted: response?.accepted,
            rejected: response?.rejected,
          },
          metadata: {
            body: data,
          },
          message: 'Email sent successfully.',
        };
      }
      return response;
    } catch (error) {
      console.log('Service Error: ', error);
      throw new InternalServerErrorException('Failed to send email: ', error?.message.toString());
    }
  }

  async hbsCompiler(templatePath: string, context: Record<string, unknown>) {
    try {
      const htmlContent = await fsPromises.readFile(__dirname + templatePath, {
        encoding: 'utf8',
      });
      if (!htmlContent) throw new NotFoundException('Failed to read the template file');
      const template = compile(htmlContent);
      if (!template) throw new NotFoundException('Failed to compile the template');
      return template(context);
    } catch (error) {
      console.log('template Error: ', error);
      throw new InternalServerErrorException(
        'Failed to read the template file: ',
        error?.message.toString(),
      );
    }
  }
}
