import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CustomCacheOptions } from '../../../configs/redis';
import { CacheManagerService } from './cache-manager.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => CustomCacheOptions,
    }),
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
