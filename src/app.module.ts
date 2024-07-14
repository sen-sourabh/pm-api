import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configurations from './configs/configurations';
import { DataSourcesOptions } from './configs/typeorm';
import { ActivityLogsController } from './core/modules/activity-logs/activity-logs.controller';
import { ActivityLogsModule } from './core/modules/activity-logs/activity-logs.module';
import { MessengerModule } from './core/modules/messenger/messenger.module';
import { WebhooksModule } from './core/modules/webhooks/webhooks.module';
import { HttpExceptionFilter } from './core/shared/exception-filters/http-exception.filter';
import { TokenExpiredExceptionFilter } from './core/shared/exception-filters/token-expire.filter';
import { LoggingInterceptor } from './core/shared/interceptors/logging.interceptor';
import { AuthMiddleware } from './core/shared/middlewares/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { RolesController } from './modules/roles/roles.controller';
import { RolesModule } from './modules/roles/roles.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { UsertypesController } from './modules/usertypes/usertypes.controller';
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
    AuthModule,
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
    JwtService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenExpiredExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController, RolesController, UsertypesController, ActivityLogsController);
  }
}
