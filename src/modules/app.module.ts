import { Module } from '@nestjs/common';
import { HackerModule } from './hacker.module';
import { BbcModule } from './bbc.module';
import { PrismaModule } from './prisma.module';
import { MusicModule } from './music.module';
import { ClimateModule } from './climate.module';

@Module({
  imports: [HackerModule, BbcModule, PrismaModule, MusicModule, ClimateModule],
})
export class AppModule {}
