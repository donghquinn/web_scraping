import { Module } from "@nestjs/common";
import { PrismaLibrary } from "libraries/common/prisma.lib";

@Module({
  providers: [PrismaLibrary],
  exports: [PrismaLibrary],
})
export class PrismaModule {}
