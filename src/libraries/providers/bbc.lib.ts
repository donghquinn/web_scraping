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
        select: { post: true, link: true, founded: true },
        where: { founded: date },
        orderBy: { rank: 'desc' },
      });

      const now = new Date();

      const returnArray: unknown[] = [];

      result.filter((item) => {
        // Logger.debug('Date: %o', { created: item.founded.getDate(), now: now.getDate() - 1 });

        if (item.founded.getDate() === now.getDate() - 1 && item.founded.getMonth() === now.getMonth()) {
          returnArray.push(item);
        }
      });

      if (returnArray.length === 0) {
        Logger.log("It's Not Founded Yet");
      } else {
        Logger.log('Found BBC News');
      }

      return returnArray;
    } catch (error) {
      throw new BbcError(
        'BBC Error',
        'BBC New Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
