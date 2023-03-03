import { Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapeError } from "errors/scrape.error";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { NewsArrayType } from "types/news.type";

/**
 * Hackers News 1 ~ 30: "https://news.ycombinator.com/"
 * @returns
 */
export const scrapeHackerNews = async () => {
  try {
    const hackerUrl = "https://news.ycombinator.com/";

    const prisma = new PrismaLibrary();

    const newsArray: NewsArrayType[] = [];

    const html = await axios.get(hackerUrl);

    const scrapedHtml = cheerio.load(html.data);

    // 랭크
    const rank = scrapedHtml("table")
      .children("tbody")
      .children("tr.athing")
      .children("td")
      .children("span.rank")
      .append("!")
      .text()
      .split("!");

    // 포스트 제목
    const posts = scrapedHtml("table")
      .children("tbody")
      .children("tr.athing")
      .children("td.title")
      .children("span.titleline")
      .children("a")
      // 각각의 스크레이핑 한 데이터의 스플릿 문자 추가
      .append("!")
      .text()
      .split("!");

    posts.filter((item, index) => {
      newsArray.push({ rank: rank[index], post: item });
    });

    await prisma.hackers.createMany({
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
};
