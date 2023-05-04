import { Injectable, Logger } from '@nestjs/common';
import { MelonError } from 'errors/melon.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

@Injectable()
export class MusicChartProvider {
  constructor(private prisma: PrismaLibrary) {}

  async melonMusicChart() {
    try {
      const yesterday = moment.utc().tz('Asia/Seoul').subtract(1, 'day');

      const result = await this.prisma.melon.findMany({
        select: { rank: true, title: true, artist: true, founded: true },
        where: {
          founded: {
            lt: yesterday.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            gte: yesterday.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
        orderBy: { rank: 'asc' },
      });

      Logger.debug('Melon Music Chart Founded');

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
