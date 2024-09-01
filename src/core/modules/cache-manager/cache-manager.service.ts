import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cacheSetData({ request, data }: { request: Request; data: any }) {
    try {
      console.log('request: ', request?.headers);
      console.log('request: ', request?.['param']);
      console.log('request: ', request?.['query']);
      console.log('request: ', request.body);

      await this.cacheManager.set('key123', data);
      Logger.debug(`Cache added with key: 123`);
    } catch (error) {
      Logger.error(`Error from cacheSetData: ${error?.message}`);
    }
  }

  async cacheGetData({ request }: { request: string }) {
    try {
      const res = await this.cacheManager.get('key123');
      Logger.debug(`Cache found with key: ${res}`);
    } catch (error) {
      Logger.error(`Error from cacheGetData: ${error?.message}`);
    }
  }

  async cacheDeleteData({ request }: { request: string }) {
    try {
      const res = await this.cacheManager.del('key123');
      Logger.debug(`Cache deleted with key: ${res}`);
    } catch (error) {
      Logger.error(`Error from cacheDelData: ${error?.message}`);
    }
  }
}
