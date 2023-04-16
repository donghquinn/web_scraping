import { Injectable, Logger } from '@nestjs/common';
import { NaverError } from 'errors/naver.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment';
import fns from 'date-fns';

@Injectable()
export class NaverProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getNaverNews() {
    try {
      const now = fns.subDays(moment.utc().tz('Asia/Seoul').toDate(), 1);

      const result = await this.prisma.naverNews.findMany({
        select: {
          keyWord: true,
          title: true,
          description: true,
          originallink: true,
          postedTime: true,
          founded: true,
        },
        where: { founded: now },
        orderBy: { founded: 'desc' },
      });

      // const returnArray: unknown[] = [];

      // result.filter((item) => {
      //   // Logger.debug('Date: %o', { created: item.founded.getDate(), now: now.getDate() - 1 });

      //   if (item.founded.getDate() === now.getDate() - 1 && item.founded.getMonth() === now.getMonth()) {
      //     returnArray.push(item);
      //   }
      // });

      // if (returnArray.length === 0) {
      //   Logger.log("It's Not Founded Yet");
      // } else {
      //   Logger.log('Found Naver News');
      // }

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
