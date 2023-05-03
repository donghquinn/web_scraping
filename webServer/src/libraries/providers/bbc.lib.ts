import { Injectable, Logger } from '@nestjs/common';
import { BbcError } from 'errors/bbc.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment-timezone';

@Injectable()
export class BbcNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getBbcNewsCount() {
    try {
      const count = await this.prisma.bbcTechNews.count();

      Logger.log('BBC News Total Count: %o', { count });

      return count;
    } catch (error) {
      Logger.error('Get BBC Total News Count Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new BbcError(
        'BBC Error',
        'BBC Total Count Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringTodayBbcNews() {
    try {
      const yesterday = moment.utc().tz('Asia/Seoul').subtract(1, 'day');

      // Logger.debug('Today: %o', { date });

      const result = await this.prisma.bbcTechNews.findMany({
        select: { post: true, link: true, founded: true },
        orderBy: { rank: 'desc' },
        where: {
          founded: {
            lt: yesterday.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            gte: yesterday.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
      });

      return result;
    } catch (error) {
      Logger.error('Bring BBC News Error: %o', error instanceof Error ? error : new Error(JSON.stringify(error)));

      throw new BbcError(
        'BBC Error',
        'BBC News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
