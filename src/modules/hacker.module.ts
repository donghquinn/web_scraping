import { Module } from "@nestjs/common";
import { HackerController } from "controllers/hacker/hacker.ctl";
import { HackersNewsProvider } from "libraries/providers/hacker.lib";

@Module({
  controllers: [HackerController],
  providers: [HackersNewsProvider],
})
export class HackerModule {}
