import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs/swagger';
import { ResponseInterceptor } from './core/shared/interceptors/response.interceptor';

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
  logger.verbose(`Swagger documentation ${PROTOCOL}://${HOST}:${PORT}/api`);
  logger.verbose(`Server running on ${PROTOCOL}://${HOST}:${PORT}`);
};

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, NestFactoryOptions);

  //Helemt
  app.use(helmet());

  //To set the global prefix within the endpoints
  app.setGlobalPrefix('api/v1');

  //Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  //Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  //Swagger configurations
  SwaggerConfig(app);

  //This line should be after the All config initialization
  await app.listen(PORT);

  //App Info
  AppInfo();
};
