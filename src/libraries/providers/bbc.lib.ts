import { Injectable, Logger } from '@nestjs/common';
import { BbcError } from 'errors/bbc.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Injectable()
export class BbcNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getBbcNewsCount() {
    try {
      const count = await this.prisma.bbcTechNews.count();

      Logger.log('BBC News Total Count: %o', { count });

      return count;
    } catch (error) {
      throw new BbcError(
        'BBC Error',
        'BBC Total Count Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringTodayBbcNews() {
    try {
      const date = new Date();

      Logger.debug('Today: %o', { date });

      const result = await this.prisma.bbcTechNews.findMany({
        select: { post: true, link: true },
        where: { founded: date },
        orderBy: { rank: 'desc' },
      });

      Logger.log('BBC News Ordered by Rank: %o', { newsCount: result.length });

      Logger.debug('BBC News: ', { ...result });

      return result;
    } catch (error) {
      throw new BbcError(
        'BBC Error',
        'BBC New Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
