import { ConsoleLogger, Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapeError } from "errors/scrape.error";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import fetch from "node-fetch";
import { NewsArrayType } from "types/news.type";

@Injectable()
export class ScrapeManager {
  constructor(private prisma: PrismaLibrary) {}

  async scrapeHackerNews() {
    try {
      const newsArray: NewsArrayType[] = [];

      const html = await axios.get("https://news.ycombinator.com/");

      const scrapedHtml = cheerio.load(html.data);

      const rank = scrapedHtml("table")
        .children("tbody")
        .children("tr.athing")
        .children("td")
        .children("span.rank")
        .append("!")
        .text()
        .split("!");

      const posts = scrapedHtml("table")
        .children("tbody")
        .children("tr.athing")
        .children("td.title")
        .children("span.titleline")
        .children("a")
        .append("!")
        .text()
        .split("!");

      posts.filter((item, index) => {
        newsArray.push({ rank: rank[index], post: item });
      });

      await this.prisma.hackers.createMany({
        data: newsArray,
      });

      Logger.log("News Array: %o", { newsArray });

      return newsArray;
    } catch (error) {
      throw new ScrapeError(
        "HTML Scrape",
        "Web Scraping Error",
        error instanceof Error ? error : new Error(JSON.stringify(error))
      );
    }
  }
}
