import { Injectable, Logger } from '@nestjs/common';
import { HackerError } from 'errors/hacker.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Injectable()
export class HackersNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getHackerNewsCount() {
    try {
      const count = await this.prisma.hackers.count();

      Logger.log('Hacker News Total Count: %o', { count });

      return count;
    } catch (error) {
      throw new HackerError(
        'Hacker News',
        'Hacker News Count Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringTodayHackerPosts() {
    try {
      const date = new Date();

      Logger.debug('HAcker News Today: %o', { date });

      const result = await this.prisma.hackers.findMany({
        select: { post: true, link: true, founded: true },

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
        Logger.log('Found Hackers News');
      }

      return returnArray;
    } catch (error) {
      throw new HackerError(
        'Hacker News',
        'Hacker News Bringing Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
