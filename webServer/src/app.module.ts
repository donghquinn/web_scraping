/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HeadersMiddleware } from 'middlewares/header.middleware';
import { BbcModule } from './modules/bbc.module';
import { ClimateModule } from './modules/climate.module';
import { HackerModule } from './modules/hacker.module';
import { MusicModule } from './modules/music.module';
import { NaverModule } from './modules/naver.module';
import { PrismaModule } from './modules/prisma.module';

@Module({
  imports: [HackerModule, BbcModule, PrismaModule, MusicModule, ClimateModule, NaverModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware).forRoutes('*');
  }
}
