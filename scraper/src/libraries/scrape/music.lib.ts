import axios from 'axios';
import * as cheerio from 'cheerio';
import { subYears } from 'date-fns';
import { MelonError } from 'errors/melon.error';
import { NaverError } from 'errors/naver.error';
import fetch from 'node-fetch';
import { MusicNaverSearchResponse, MusicRank } from 'types/music.type';
import { ScrapeLogger } from 'utils/logger.util';

/**
 * https://search.daum.net/search?
 * nil_suggest=sugsch&w=tot&DA=GIQ&sq=%EC%97%B0
 * %EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8
 * %ED%8A%B8&o=1&sugo=11&q=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8
 */
export const scrapeMelonChart = async () => {
  try {
    const musicArray: Array<MusicRank> = [];

    const melonChartUrl = 'https://www.melon.com/chart/index.htm';

    const { data } = await axios.get<string>(melonChartUrl);

    const html = cheerio.load(data);

    const musicTitle = html('div.wrap')
      .children('div.wrap_song_info')
      .children('div.ellipsis.rank01')
      .children('span')
      .children('a')
      .append('!')
      .text()
      .split('!');

    const musicArtist = html('div.wrap')
      .children('div.wrap_song_info')
      .children('div.ellipsis.rank02')
      .children('span')
      .append('!')
      .text()
      .split('!');

    for (let i = 0; i < musicTitle.length - 1; i += 1) {
      musicArray.push({ rank: i + 1, title: musicTitle[i], artist: musicArtist[i] });
    }

    ScrapeLogger.info('Found Melon Music Chart Result');

    return musicArray;
  } catch (error) {
    ScrapeLogger.error('Scrape Melon Chart Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new MelonError(
      'Melon Chart',
      'Scrape Melon Chart by Age Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const searchMusicStatistics = async (musics: Array<MusicRank>) => {
  try {
    const url = 'https://openapi.naver.com/v1/datalab/search';

    const headers = {
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': process.env.NAVER_CLIENT!,
      'X-Naver-Client-Secret': process.env.NAVER_TOKEN!,
    };

    const today = new Date();

    const startDate = subYears(today, 1);

    ScrapeLogger.debug('Dates: %o', { today, startDate });
    // const returndata = [];
    for (let i = 0; i < musics.length; i += 1) {
      const body = JSON.stringify({
        startDate,
        endDate: today,
        timeUnit: 'year',
        keywordGroups: [
          {
            groupName: musics[i].title,
            keywords: [musics[i].title, musics[i].artist],
          },
        ],
      });

      const options = {
        method: 'POST',
        headers,
        body,
      };

      ScrapeLogger.debug('Request Body: ', { body });

      const response = (await (await fetch(url, options)).json()) as MusicNaverSearchResponse;

      ScrapeLogger.debug('Music Search Response: ', { responseData: response.results });
    }
  } catch (error) {
    ScrapeLogger.error('Scrape Music Statistics Search Error: ', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new NaverError(
      'Music Statistics Search',
      'Music Statistics Search Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
// const array = await scrapeMelonChart();
// // await searchMusicStatistics(array);
