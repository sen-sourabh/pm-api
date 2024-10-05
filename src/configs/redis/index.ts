import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

export const CustomCacheOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory() {
    return {
      max: +configService.getOrThrow<string>('CACHE_MAX'),
      ttl: +configService.getOrThrow<string>('CACHE_TTL'),
    };
  },
};
