import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { BbcError } from 'errors/bbc.error';
import { NewsArrayType } from 'types/news.type';

export const scrapeBbcTechNews = async () => {
  try {
    const url = 'https://www.bbc.com/korean/topics/c2dwqjn99ggt';

    const { data } = await axios.get(url);

    const html = cheerio.load(data);

    const linkArray: Array<string> = [];

    const returnArray: Array<NewsArrayType> = [];

    const newsTitle = html('div.promo-text')
      .children('h2.bbc-qvbmj5.e47bds20')
      .children('a.focusIndicatorDisplayBlock.bbc-uk8dsi.e1d658bg0')
      .append('!')
      .text()
      .split('!');

    html('div.promo-text')
      .children('h2.bbc-qvbmj5.e47bds20')
      .children('a.focusIndicatorDisplayBlock.bbc-uk8dsi.e1d658bg0')
      .each((index, item) => {
        const link = html(item).attr('href');
        linkArray.push(link!);
      });

    for (let i = 0; i < linkArray.length; i += 1) {
      returnArray.push({
        rank: String(i + 1),
        post: newsTitle[i],
        link: linkArray[i],
      });
    }

    Logger.log('BBC Technology News Found');

    return returnArray;
  } catch (error) {
    Logger.error('Scrape BBC Tech News Error: ', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new BbcError(
      ' BBC Tech News',
      'Scrape BBC Tech News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
