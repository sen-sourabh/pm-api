import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs/swagger';

const logger = new Logger(); // You can customize the context here
const configService = new ConfigService();
const PROTOCOL: string = configService?.getOrThrow('protocol') ?? 'https';
const HOST: string = configService?.getOrThrow('host') ?? 'localhost';
const PORT: number = configService?.getOrThrow('port');

const NestFactoryOptions: NestApplicationOptions = {
  bodyParser: true,
  rawBody: true,
  logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
};

const AppInfo = (): void => {
  // logger.verbose(`Project documentation ${PROTOCOL}://${HOST}:${PORT} | Please run 'npm run g:doc' along with`);
  logger.verbose(`Swagger documentation ${PROTOCOL}://${HOST}:${PORT}/api`);
  logger.verbose(`Server running on ${PROTOCOL}://${HOST}:${PORT}`);
  // logger.verbose(`API v1 base url ${PROTOCOL}://${HOST}:${PORT}/api/v1`);
  // logger.verbose(`To check, Is server running. Hit ${PROTOCOL}://${HOST}:${PORT}/api/v1/starter`);
};

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, NestFactoryOptions);

  //Helemt
  app.use(helmet());

  //TODO: Set global prefix for apis
  // app.setGlobalPrefix('v1');

  //Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  SwaggerConfig(app);

  //This line should be after the All config initialization
  await app.listen(PORT);

  //App Info
  AppInfo();
};
