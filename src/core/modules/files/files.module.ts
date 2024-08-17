import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesService } from './files.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.getOrThrow<string>('MULTER_DEST'),
        storage: memoryStorage(),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
