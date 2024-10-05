import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import path from 'path';

config();
const configService = new ConfigService();

export const SMTPSourceOptions: MailerOptions = {
  transport: {
    host: configService?.getOrThrow<string>('SMTP_TRANSPORT_HOST'),
    port: parseInt(configService?.getOrThrow<string>('SMTP_TRANSPORT_PORT'), 10) ?? 587,
    secure: !configService?.getOrThrow<string>('SMTP_TRANSPORT_SECURE'),
    auth: {
      user: configService?.getOrThrow<string>('SMTP_TRANSPORT_AUTH_USERNAME'),
      pass: configService?.getOrThrow<string>('SMTP_TRANSPORT_AUTH_PASSWORD'),
    },
  },
  defaults: {
    from: configService?.getOrThrow<string>('SMTP_DEFAULTS_FROM'),
  },
  preview: !configService?.getOrThrow<string>('SMTP_PREVIEW'),
  template: {
    dir: path.join(__dirname, configService?.getOrThrow<string>('SMTP_TEMPLATE_DIR')),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: !!configService?.getOrThrow<string>('SMTP_TEMPLATE_OPTIONS_STRICT'),
    },
  },
};
