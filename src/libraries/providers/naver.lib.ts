import { Injectable, Logger } from '@nestjs/common';
import { NaverError } from 'errors/naver.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Injectable()
export class NaverProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getNaverNews() {
    try {
      const now = new Date();

      const result = await this.prisma.naverNews.findMany({
        select: {
          keyWord: true,
          title: true,
          description: true,
          originallink: true,
          postedTime: true,
          founded: true,
        },
        orderBy: { founded: 'desc' },
      });

      const returnArray: unknown[] = [];

      result.filter((item) => {
        // Logger.debug('Date: %o', { created: item.founded.toDateString(), now: now.toDateString() });

        if (item.founded.getDate() === now.getDate()) {
          returnArray.push(item);
        }
      });

      Logger.debug('Found Naver News');

      return returnArray;
    } catch (error) {
      throw new NaverError(
        'Get Today NAver News',
        'Get Naver News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
