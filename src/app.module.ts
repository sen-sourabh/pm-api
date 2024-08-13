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
import { AuthModule } from './core/modules/auth/auth.module';
import { FilesModule } from './core/modules/files/files.module';
import { MessengerModule } from './core/modules/messenger/messenger.module';
import { WebhooksModule } from './core/modules/webhooks/webhooks.module';
import { HttpExceptionFilter } from './core/shared/exception-filters/http-exception.filter';
import { TokenExpiredExceptionFilter } from './core/shared/exception-filters/token-expire.filter';
import { LoggingInterceptor } from './core/shared/interceptors/logging.interceptor';
import { AuthMiddleware } from './core/shared/middlewares/auth.middleware';
import { AccounttypesController } from './modules/accounttypes/accounttypes.controller';
import { AccounttypesModule } from './modules/accounttypes/accounttypes.module';
import { AttachmentsController } from './modules/attachments/attachments.controller';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { CustomFieldsModule } from './modules/custom-fields/custom-fields.module';
import { ProvidersController } from './modules/providers/providers.controller';
import { ProvidersModule } from './modules/providers/providers.module';
import { RolesController } from './modules/roles/roles.controller';
import { RolesModule } from './modules/roles/roles.module';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { VaultsController } from './modules/vaults/vaults.controller';
import { VaultsModule } from './modules/vaults/vaults.module';
import { VaultsCollaboratorsController } from './modules/vaults_collaborators/vaults_collaborators.controller';
import { VaultsCollaboratorsModule } from './modules/vaults_collaborators/vaults_collaborators.module';

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
    AccounttypesModule,
    UsersModule,
    ActivityLogsModule,
    VaultsModule,
    FilesModule,
    VaultsCollaboratorsModule,
    AttachmentsModule,
    ProvidersModule,
    CustomFieldsModule,
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
      .forRoutes(
        ActivityLogsController,
        AccounttypesController,
        RolesController,
        UsersController,
        VaultsController,
        VaultsCollaboratorsController,
        ProvidersController,
        AttachmentsController,
      );
  }
}
