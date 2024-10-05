import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomRequest } from '../../shared/interfaces/types';
import { ApiErrorResponse } from '../activity-logs/utils/types';
import { generateCacheKey } from './utils';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cacheSetData({
    request,
    data,
  }: {
    request: Request;
    data: Record<string, unknown> | Record<string, unknown>[];
  }) {
    try {
      const key = generateCacheKey(request as CustomRequest);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await (this.cacheManager as unknown as { set: (key: string, data: unknown) => object })?.set(
        key,
        data,
      );
      Logger.debug(`Cache added with key ${key}`);
    } catch (error) {
      Logger.error(`Error from cacheSetData: ${(error as ApiErrorResponse)?.message}`);
    }
  }

  async cacheGetData(request: Request) {
    try {
      const key = generateCacheKey(request as CustomRequest);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const response = (
        (await this.cacheManager) as unknown as { get: (key: string) => object }
      )?.get(key) as Record<string, unknown>;
      if (response) {
        Logger.debug(`Cache found with key ${key}`);
      }
      return response as Record<string, unknown> | Record<string, unknown>[];
    } catch (error) {
      Logger.error(`Error from cacheGetData: ${(error as ApiErrorResponse)?.message}`);
    }
  }

  async cacheDeleteData(request: Request) {
    try {
      const key = generateCacheKey(request as CustomRequest);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (this.cacheManager as unknown as { del: (key: string) => object })?.del(key);
      Logger.debug(`Cache deleted with key ${key}`);
    } catch (error) {
      Logger.error(`Error from cacheDelData: ${(error as ApiErrorResponse)?.message}`);
    }
  }
}
