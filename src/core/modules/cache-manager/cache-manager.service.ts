import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cacheSetData({ request, data }: { request: Request; data: any }) {
    try {
      console.log('request: ', request);
      console.log('request: ', request?.['param']);
      console.log('request: ', request?.['query']);
      console.log('request: ', request.body);

      await this.cacheManager.put('key', data);
      Logger.debug(`Cache added with key: 123`);
    } catch (error) {
      Logger.error(`Error from cacheSetData: ${error?.message}`);
    }
  }

  async cacheGetData({ request }: { request: Request }) {
    try {
      await this.cacheManager.match('key');
      Logger.debug(`Cache found with key: 123`);
    } catch (error) {
      Logger.error(`Error from cacheGetData: ${error?.message}`);
    }
  }

  async cacheDelData({ request }: { request: Request }) {
    try {
      await this.cacheManager.delete('key');
      Logger.debug(`Cache deleted with key: 123`);
    } catch (error) {
      Logger.error(`Error from cacheDelData: ${error?.message}`);
    }
  }
}
