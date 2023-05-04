import { Injectable, Logger } from '@nestjs/common';
import { NaverError } from 'errors/naver.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment-timezone';

@Injectable()
export class NaverProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getNaverNews() {
    try {
      const yesterday = moment.utc().tz('Asia/Seoul').subtract(1, 'day');

      const result = await this.prisma.naverNews.findMany({
        select: {
          keyWord: true,
          title: true,
          description: true,
          originallink: true,
          postedTime: true,
          founded: true,
        },
        where: {
          founded: {
            lt: yesterday.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            gte: yesterday.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          },
        },
        orderBy: { founded: 'desc' },
      });

      return result;
    } catch (error) {
      Logger.error('Bring Naver Today News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new NaverError(
        'Get Today Naver News',
        'Get Naver News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
