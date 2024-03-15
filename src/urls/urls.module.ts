import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
//import { RedisModule } from '../common/redis/redis.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schema/url.schema';


@Module({
  imports: [ MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])], 
  providers: [UrlsService],
  controllers: [UrlsController]
})
export class UrlsModule {}
