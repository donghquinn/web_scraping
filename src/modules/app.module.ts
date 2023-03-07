import { Module } from "@nestjs/common";
import { HackerModule } from "./hacker.module";
import { BbcModule } from "./bbc.module";
import { PrismaModule } from "./prisma.module";

@Module({
  imports: [HackerModule, BbcModule, PrismaModule],
})
export class AppModule {}
