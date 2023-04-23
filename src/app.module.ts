import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HackerModule } from './modules/hacker.module';
import { BbcModule } from './modules/bbc.module';
import { PrismaModule } from './modules/prisma.module';
import { MusicModule } from './modules/music.module';
import { ClimateModule } from './modules/climate.module';
import { HeadersMiddleware } from 'middlewares/header.middleware';
import { NaverModule } from './modules/naver.module';

@Module({
  imports: [HackerModule, BbcModule, PrismaModule, MusicModule, ClimateModule, NaverModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware).forRoutes('*');
  }
}
