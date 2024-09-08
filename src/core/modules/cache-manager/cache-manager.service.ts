import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cacheSetData({ request, data }: { request: Request; data: any }) {
    try {
      const key = this.#generateCacheKey(request);
      await this.cacheManager.set(key, data);
      Logger.debug(`Cache added with key ${key}`);
    } catch (error) {
      Logger.error(`Error from cacheSetData: ${error?.message}`);
    }
  }

  async cacheGetData(request: Request) {
    try {
      const key = this.#generateCacheKey(request);
      const res = await this.cacheManager.get(key);
      if (res) {
        Logger.debug(`Cache found with key ${key}`);
      }
      return res;
    } catch (error) {
      Logger.error(`Error from cacheGetData: ${error?.message}`);
    }
  }

  async cacheDeleteData(request: Request) {
    try {
      const key = this.#generateCacheKey(request);
      await this.cacheManager.del(key);
      Logger.debug(`Cache deleted with key ${key}`);
    } catch (error) {
      Logger.error(`Error from cacheDelData: ${error?.message}`);
    }
  }

  #generateCacheKey = (request: Request): string => {
    const { url, method, query, params } = request;
    return JSON.stringify({ url, method, query, params });
  };
}