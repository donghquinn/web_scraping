import axios from 'axios';
import * as cheerio from 'cheerio';
import { NaverError } from 'errors/naver.error';
import fetch from 'node-fetch';
import { NaverNewsResponse } from 'types/naver.type';
import utf8 from 'utf8';
import { ScrapeLogger } from 'utils/logger.util';

export const naverNews = async () => {
  try {
    // const newsArray: Array<NaverNewsResultReturn> = [];

    const queryName = utf8.encode('IT');

    const url = `https://openapi.naver.com/v1/search/news.json?&query=${queryName}`;

    const headers = {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT!,
      'X-Naver-Client-Secret': process.env.NAVER_TOKEN!,
    };

    const options = {
      method: 'GET',
      headers,
    };

    const response = (await (await fetch(url, options)).json()) as NaverNewsResponse;

    ScrapeLogger.info('Found Naver News');

    return response.items;
  } catch (error) {
    ScrapeLogger.error('Scrape Naver News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new NaverError(
      'Naver News',
      'Naver News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const naverKin = async () => {
  try {
    const keyword = ['빅데이터', '머신러닝', '딥러닝'];

    for (let i = 0; i <= keyword.length; i += 1) {
      const url = `https://kin.naver.com/search/list.nhn?query=${i}`;

      const response = await axios.get<string>(url);

      const html = cheerio.load(response.data);

      const title = html('div.section').children('ul.basic1').children('li').append('!').text().split('!');

      // .children("ul.basic1").children("li").children("dl").children("dt").children("a").children("b").toString()
      // const date = html(item).children("li").children("dl").children("dt").children("dd.txt_inline").toString()

      ScrapeLogger.debug(title);
    }

    // const response =
  } catch (error) {
    throw new NaverError(
      'Naver KIN',
      'Scrape Naver Kin Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
