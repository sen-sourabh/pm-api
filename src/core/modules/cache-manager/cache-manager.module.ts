import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';

@Module({
  imports: [CacheModule.register({ isGlobal: true, ttl: 60 })],
  providers: [CacheManagerService],
})
export class CacheManagerModule {}
