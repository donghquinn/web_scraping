import { Logger } from "@nestjs/common";
import { setIntervalAsync } from "set-interval-async";
import { scrapeHackerNews } from "./scrape/hackers.lib";

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private interval: number;

  constructor() {
    this.interval = Number(process.env.INTERVAL);
  }

  start() {
    setIntervalAsync(async () => {
      try {
        await scrapeHackerNews();
      } catch (error) {
        Logger.error("Observer Error: %o", {
          error:
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    }, this.interval);
  }
}
