import { Module } from "@nestjs/common";
import { HackerModule } from "./hacker.module";
import { BbcModule } from "./bbc.module";
import { PrismaModule } from "./prisma.module";
import { MusicModule } from "./music.module";

@Module({
  imports: [HackerModule, BbcModule, PrismaModule, MusicModule],
})
export class AppModule {}
