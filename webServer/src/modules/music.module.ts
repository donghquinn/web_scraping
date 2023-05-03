import { Module } from "@nestjs/common";
import { MusicController } from "controllers/music/music.ctl";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { MusicChartProvider } from "libraries/providers/music.lib";

@Module({
  controllers: [MusicController],
  providers: [PrismaLibrary, MusicChartProvider],
})
export class MusicModule {}
