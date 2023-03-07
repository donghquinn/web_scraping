import { Injectable } from "@nestjs/common";
import { HackerError } from "errors/hacker.error";
import { PrismaLibrary } from "libraries/common/prisma.lib";

@Injectable()
export class HackersNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getHackerNewsCount() {
    try {
      const count = await this.prisma.hackers.count();

      return count;
    } catch (error) {
      throw new HackerError(
        "Hacker News",
        "Hacker News Count Error",
        error instanceof Error ? error : new Error(JSON.stringify(error))
      );
    }
  }
}
