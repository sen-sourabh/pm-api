import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

export const cacheModuleOptions: CacheModuleOptions = {
  isGlobal: !!configService.getOrThrow('CACHE_IS_GLOBAL'),
  max: parseInt(configService.getOrThrow('CACHE_MAX')) ?? 100,
  ttl: parseInt(configService.getOrThrow('CACHE_TTL')) ?? 60,
};
