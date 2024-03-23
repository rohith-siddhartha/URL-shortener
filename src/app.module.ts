import { Inject, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UrlController } from './url/url.controller';
import { Url } from './url/enitities/url.entity';
import { Click } from './url/enitities/click.enity';
import { UrlModule } from './url/url.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UrlService } from './url/url.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CACHE_MANAGER, CacheManagerOptions, CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redis from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    ScheduleModule.forRoot(),
    UrlModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [User, Url, Click],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      port:5432
    }),
    TypeOrmModule.forFeature([Url, User, Click]),
    CacheModule.register<RedisClientOptions>({
      store:'redis',
      url:process.env.REDIS,
      isGlobal:true
    })
  ],
  controllers: [AppController, UrlController],
  providers: [AppService, UrlService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'url*', method: RequestMethod.ALL },
        { path: ':shortUrl/clicks', method: RequestMethod.GET }
      )
  }
}
