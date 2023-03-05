import { Injectable } from "@nestjs/common";
import { PrismaLibrary } from "libraries/common/prisma.lib";

@Injectable()
export class BbcNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getBbcNewsCount() {
    const count = await this.prisma.bbcTechNews.count();
  }

  async getBbcTechNews() {}
}
