import { Injectable } from "@nestjs/common";
import { BbcError } from "errors/bbc.error";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { scrapeBbcTechNews } from "libraries/scrape/bbc.lib";

@Injectable()
export class BbcNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getBbcNewsCount() {
    try {
      const count = await this.prisma.bbcTechNews.count();

      return count;
    } catch (error) {
      throw new BbcError(
        "BBC Error",
        "BBC Total Count Error",
        error instanceof Error ? error : new Error(JSON.stringify(error))
      );
    }
  }

  async bringBbcNews() {
    try {
      const result = await this.prisma.bbcTechNews.findMany({
        select: { post: true },
        orderBy: { rank: "desc" },
      });

      return result;
    } catch (error) {
      throw new BbcError(
        "BBC Error",
        "BBC New Error",
        error instanceof Error ? error : new Error(JSON.stringify(error))
      );
    }
  }
}
