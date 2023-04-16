import { Injectable, Logger } from '@nestjs/common';
import { MelonError } from 'errors/melon.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment';
import fetch from 'node-fetch';
import fns from 'date-fns';

@Injectable()
export class MusicChartProvider {
  constructor(private prisma: PrismaLibrary) {}

  async melonMusicChart() {
    try {
      const today = fns.subDays(moment.utc().tz('Asia/Seoul').toDate(), 1);

      Logger.debug('Today: %o', { today });

      const result = await this.prisma.melon.findMany({
        select: { rank: true, title: true, artist: true, founded: true },
        where: { founded: today },
        orderBy: { rank: 'desc' },
      });

      Logger.debug('Melon Music Chart Founded: %o', { result });

      // const returnArray: unknown[] = [];

      // result.filter((item) => {
      //   // Logger.debug('Date: %o', { created: item.created.toDateString(), now: now.toDateString() });

      //   if (item.founded.getDate() === today.getDate() - 1 && item.founded.getMonth() === today.getMonth()) {
      //     // Logger.debug('Dates: %o', { createdDate: item.founded.getDate(), today: now.getDate() });

      //     returnArray.push(item);
      //   }
      // });

      // if (returnArray.length === 0) {
      //   Logger.log("It's Not Founded Yet");
      // } else {
      //   Logger.log('Found Today Music Rank');
      // }

      return result;
    } catch (error) {
      Logger.error('Bring Melon Chart Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MelonError(
        'Music Chart',
        'Bring MelonChart Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  // TODO 그래프 그리는 코드 작업
  // 특정 음원의 음원 랭킹 그래프
  async melonChartGraph(musicTitle: string) {
    try {
      const melonRankData = await this.prisma.melon.findMany({
        select: { rank: true, title: true, founded: true },
        where: { title: musicTitle },
        orderBy: { founded: 'desc' },
      });

      const url = 'https://plot.andongh.com/music';

      const bodyData = JSON.stringify({ titleArray: melonRankData });

      const options = {
        method: 'POST',
        body: bodyData,
      };

      const response = await fetch(url, options);

      return response;
    } catch (error) {
      Logger.error('Get Melon Chart Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MelonError(
        'Melon Chart',
        'Get Music Chart Status',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
