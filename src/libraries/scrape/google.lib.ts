// 네이버 실시간 검색어 순위

import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleError } from 'errors/google.error';

/**
 * 구글 파이넨스에서 상승 주식: https://www.google.com/finance/markets/gainers
 * @returns
 */
export const googleFinanceStock = async () => {
  try {
    const url = 'https://www.google.com/finance/markets/gainers';

    const response = await (await axios.get(url)).data;

    const scraped = cheerio.load(response);

    // const risingArray: Array<string> = [];

    const rank = scraped('ul.sbnBtf')
      .children('li')
      .children('a')
      .children('div')
      .children('div.SxcTic')
      .children('div.iLEcy')
      .append('!')
      .text()
      .split('!');

    // for (let i = 0; i < rank.length - 1; i += 1) {
    //   risingArray.push(rank[i]);
    // }

    Logger.log('Got new Rising Stocks Data. ');

    return rank;
  } catch (error) {
    throw new GoogleError(
      'Google Finance Rising Stock Rank',
      'Rising Stock Rank Scraping Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
