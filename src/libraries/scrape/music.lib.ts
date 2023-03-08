import axios from "axios";
import * as cheerio from "cheerio";
import { MelonError } from "errors/melon.error";

export const scrapeMelonMusicChart = async () => {
  try {
  } catch (error) {
    throw new MelonError(
      "Melon Chart",
      "Scrape Melon Chart Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};

/**
 * https://search.daum.net/search?nil_suggest=sugsch&w=tot&DA=GIQ&sq=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8&o=1&sugo=11&q=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8
 */
export const scrapeMelonChartByAge = async () => {
  try {
    const chartByAge =
      "https://search.daum.net/search?nil_suggest=sugsch&w=tot&DA=GIQ&sq=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8&o=1&sugo=11&q=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8";
    const { data } = await axios.get(chartByAge);

    const html = cheerio.load(data);
  } catch (error) {
    throw new MelonError(
      "Melon Chart",
      "Scrape Melon Chart by Age Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};
