// 네이버 실시간 검색어 순위

import { Logger } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { NaverError } from "errors/naver.error";

export const googleFinanceStock = async () => {
  try {
    const url = "https://www.google.com/finance/markets/gainers";

    const response = await (await axios.get(url)).data;

    // Logger.log("REsponse: %o", { response });
    const scraped = cheerio.load(response);

    const risingArray: Array<string> = [];

    const rank = scraped("ul.sbnBtf")
      .children("li")
      .children("a")
      .children("div")
      .children("div.SxcTic")
      .children("div.iLEcy")
      .append("!")
      // .children("div.rzR5Id")
      // .children("div.Q8lakc W9Vc1e")
      // .children("div.ZvmM7")
      .text()
      .split("!");

    // const cost = scraped("div.YMlKec").append("!").text().split("!");
    //   .children("li")
    //   .children("a")
    //   .children("div")
    //   .children("div.SxcTic")

    // .append("!")

    // .split("%");
    // .text()

    // const leftRank = rank.children(".rank-column");

    for (let i = 0; i < rank.length - 1; i += 1) {
      risingArray.push(rank[i]);
    }

    Logger.log("Got new Rising Stocks Data. ");
  } catch (error) {
    throw new NaverError(
      "Naver Live Search Rank",
      "Live Search Rank Scraping Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};

await googleFinanceStock();
