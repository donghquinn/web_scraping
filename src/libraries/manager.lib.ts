import { Logger } from "@nestjs/common";
import { setIntervalAsync } from "set-interval-async";
import { scrapeHackerNews } from "./scrape/hackers.lib";
import { PrismaLibrary } from "./common/prisma.lib";

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private interval: number;

  private prisma: PrismaLibrary;

  constructor() {
    this.interval = Number(process.env.INTERVAL);

    this.prisma = new PrismaLibrary();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ScrapeObserver();
    }

    return this.instance;
  }

  start() {
    setIntervalAsync(async () => {
      try {
        const hakcerNewsResult = await scrapeHackerNews();

        await this.prisma.hackers.createMany({
          data: hakcerNewsResult,
        });
      } catch (error) {
        Logger.error("Observer Error: %o", {
          error:
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    }, this.interval);
  }
}
