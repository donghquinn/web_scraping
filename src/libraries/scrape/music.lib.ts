import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { MelonError } from 'errors/melon.error';
import { NaverError } from 'errors/naver.error';
import fetch from 'node-fetch';
import { json } from 'stream/consumers';
import { MusicRank } from 'types/music.type';

/**
 * https://search.daum.net/search?nil_suggest=sugsch&w=tot&DA=GIQ&sq=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8&o=1&sugo=11&q=%EC%97%B0%EB%A0%B9%EB%B3%84+%EC%9D%8C%EC%9B%90%EC%B0%A8%ED%8A%B8
 */
export const scrapeMelonChart = async () => {
  try {
    const musicArray: Array<MusicRank> = [];

    const melonChartUrl = 'https://www.melon.com/chart/index.htm';

    const { data } = await axios.get(melonChartUrl);

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

    // Logger.debug('Music Artis: %o', { musicArtist });

    for (let i = 0; i < musicTitle.length - 1; i += 1) {
      musicArray.push({ rank: i + 1, title: musicTitle[i], artist: musicArtist[i] });
    }

    Logger.debug('Found Result: %o', { musicArray });

    Logger.log('Found Melon Music Chart Result');

    return musicArray;
  } catch (error) {
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

    for (let i = 0; i < musics.length; i += 1) {
      const body = JSON.stringify({
        timeUnit: 'month',
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

      const response = await (await fetch(url, options)).json();

      console.log('Music Search Response: %o', { response });
    }
  } catch (error) {
    throw new NaverError(
      'Music Statistics Search',
      'Music Statistics Search Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
