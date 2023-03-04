// 네이버 실시간 검색어 순위

import { Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { NaverError } from "errors/naver.error";

export const googleFinanceStock = async () => {
  try {
    const stockNames = [{ name: "google", quote: "GOOG:NASDAQ" }];
    const url = "https://www.google.com/finance/quote/";

    const response = await (await axios.get(url)).data;

    Logger.log("REsponse: %o", { response });
    const scraped = cheerio.load(response);

    const rank = scraped("a.rank-layer").children("span.rank-text").text();

    // const leftRank = rank.children(".rank-column");

    Logger.log("Rank: %o", { rank });
  } catch (error) {
    throw new NaverError(
      "Naver Live Search Rank",
      "Live Search Rank Scraping Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};

await naverLiveSearchRank();
