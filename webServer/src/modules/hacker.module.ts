import { Module } from "@nestjs/common";
import { HackerController } from "controllers/hacker/hacker.ctl";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { HackersNewsProvider } from "libraries/providers/hacker.lib";

@Module({
  controllers: [HackerController],
  providers: [HackersNewsProvider, PrismaLibrary],
})
export class HackerModule {}
