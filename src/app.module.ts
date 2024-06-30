import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configurations from './configs/configurations';
import { DataSourcesOptions } from './configs/typeorm';
import { ActivityLogsModule } from './core/modules/activity-logs/activity-logs.module';
import { MessengerModule } from './core/modules/messenger/messenger.module';
import { WebhooksModule } from './core/modules/webhooks/webhooks.module';
import { HttpExceptionFilter } from './core/shared/exception-filters/http-exception.filter';
import { LoggingInterceptor } from './core/shared/interceptors/logging.interceptor';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { UsertypesModule } from './modules/usertypes/usertypes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => DataSourcesOptions,
    }),
    MessengerModule,
    WebhooksModule,
    RolesModule,
    UsertypesModule,
    UsersModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
