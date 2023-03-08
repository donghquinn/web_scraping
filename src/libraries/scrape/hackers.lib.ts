import { Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { HackerError } from "errors/hacker.error";
import { NewsArrayType } from "types/news.type";

/**
 * Hackers News 1 ~ 30: "https://news.ycombinator.com/"
 * @returns
 */
export const scrapeHackerNews = async () => {
  try {
    const hackerUrl = "https://news.ycombinator.com/";

    const html = await axios.get(hackerUrl);

    const scrapedHtml = cheerio.load(html.data);

    const newsArray: NewsArrayType[] = [];

    const hrefArray: Array<string> = [];

    // 랭크
    const rank = scrapedHtml("table")
      .children("tbody")
      .children("tr.athing")
      .children("td")
      .children("span.rank")
      .append("!")
      .text()
      .split("!");

    // HREF 게시글 원본 주소 가져오기
    scrapedHtml("table")
      .children("tbody")
      .children("tr.athing")
      .children("td.title")
      .children("span.titleline")
      .children("a")
      .each((index, item) => {
        const href = scrapedHtml(item).attr("href");

        hrefArray.push(href!);
      });

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

    for (let i = 0; i < rank.length - 1; i += 1) {
      newsArray.push({ rank: rank[i], post: posts[i], link: hrefArray[i] });
    }

    Logger.log("Got New Hacker News Rank.");

    return newsArray;
  } catch (error) {
    Logger.error("Scrape Hacker Tech News Error: %o", {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HackerError(
      "Hacker News Scrape",
      "News Rank Scraping Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};
