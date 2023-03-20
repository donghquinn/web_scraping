import { Injectable, Logger } from '@nestjs/common';
import { MelonError } from 'errors/melon.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import fetch from 'node-fetch';

@Injectable()
export class MusicChartProvider {
  constructor(private prisma: PrismaLibrary) {}

  async melonMusicChart() {
    try {
      const today = new Date();

      Logger.debug('Today: %o', { today });

      const result = await this.prisma.melon.findMany({
        select: { rank: true, title: true, artist: true },
        where: { founded: today },
      });

      Logger.debug('Melon Music Chart Founded: %o', { result });
      return result;
    } catch (error) {
      throw new MelonError(
        'Music Chart',
        'Bring MelonChart Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  // 특정 음원의 음원 랭킹 그래프
  async melonChartGraph(musicTitle: string) {
    try {
      const melonRankData = await this.prisma.melon.findMany({
        select: { rank: true, title: true, founded: true },
        where: { title: musicTitle },
        orderBy: { founded: 'asc' },
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
      throw new MelonError('Melon Chart', 'Get Music Chart Status');
    }
  }
}
