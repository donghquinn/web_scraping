// 네이버 실시간 검색어 순위

import axios from "axios";
import { NaverError } from "errors/naver.error";

export const naverLiveSearchRank = async () => {
  try {
    const url = "https://signal.bz/";

    const response = await (await axios.get(url)).data;
  } catch (error) {
    throw new NaverError(
      "Naver Live Search Rank",
      "Live Search Rank Scraping Error",
      error instanceof Error ? error : new Error(JSON.stringify(error))
    );
  }
};
