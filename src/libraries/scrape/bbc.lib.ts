import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { BbcError } from 'errors/bbc.error';
import { BbcNewsReturnArray } from 'types/bbc.type';

export const scrapeBbcTechNews = async () => {
  try {
    const url = 'https://www.bbc.com/korean/topics/c2dwqjn99ggt';

    const { data } = await axios.get(url);

    const html = cheerio.load(data);

    const linkArray: Array<string> = [];

    const returnArray: Array<BbcNewsReturnArray> = [];

    const newsTitle = html('div.promo-text').children('h2').children('a').append('!').text().split('!');

    html('div.promo-text')
      .children('h2')
      .children('a')
      .each((index, item) => {
        const link = html(item).attr('href');

        Logger.log(link);
        linkArray.push(link!);
      });

    Logger.debug(newsTitle);

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
