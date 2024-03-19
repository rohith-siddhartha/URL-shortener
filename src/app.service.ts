import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHello(): Promise<string> {
    return this.cacheManager.get('test');
  }

  async setHello(): Promise<void> {
    return await this.cacheManager.set('test','labour');
  }

}
