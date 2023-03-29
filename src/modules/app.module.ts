import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HackerModule } from './hacker.module';
import { BbcModule } from './bbc.module';
import { PrismaModule } from './prisma.module';
import { MusicModule } from './music.module';
import { ClimateModule } from './climate.module';
import { HeadersMiddleware } from 'middlewares/header.middleware';

@Module({
  imports: [HackerModule, BbcModule, PrismaModule, MusicModule, ClimateModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware);
  }
}
