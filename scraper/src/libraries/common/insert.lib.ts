import moment from 'moment-timezone';
import { BbcNewsReturnArray } from 'types/bbc.type';
import { ClimateReturnData } from 'types/climate.type';
import { HackersNewsArrayType } from 'types/hackers.type';
import { MusicRank } from 'types/music.type';
import { NaverNewsItems } from 'types/naver.type';
import { Logger } from 'utils/logger.util';
import { PrismaLibrary } from './prisma.lib';

export class InsertData {
  private now: string;

  private prisma: PrismaLibrary;

  constructor() {
    this.prisma = new PrismaLibrary();

    this.now = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  async insertBbcData(bbc: Array<BbcNewsReturnArray>) {
    Logger.debug('Inserting BBC News: %o', { bbc });

    for (let i = 0; i < bbc.length; i += 1) {
      await this.prisma.bbcTechNews.create({
        data: {
          rank: bbc[i].rank,
          post: bbc[i].post,
          link: bbc[i].link,
          founded: this.now,
        },
      });
    }

    Logger.info('BBC News Inserted Finished.');
  }

  async insertMelonData(melon: Array<MusicRank>) {
    Logger.debug('Insert Melon Music Rank: %o', { melon });
    for (let i = 0; i < melon.length; i += 1) {
      await this.prisma.melon.create({
        data: {
          rank: melon[i].rank,
          title: melon[i].title,
          artist: melon[i].artist,
          founded: this.now,
        },
      });
    }

    Logger.info('Melon Music Chart Inserted Finished.');
  }

  async insertClimateData(climate: Array<ClimateReturnData>) {
    Logger.debug('Insert Climate Data: %o', { climate });

    for (let i = 0; i < climate.length; i += 1) {
      await this.prisma.climate.create({
        data: {
          dataTime: climate[i].dataTime,
          pm10Value: climate[i].pm10Value,
          no2Value: climate[i].no2Value,
          o3Value: climate[i].o3Value,
          coValue: climate[i].coValue,
          so2Value: climate[i].so2Value,
          khaiValue: climate[i].khaiValue,
          o3Grade: climate[i].o3Grade,
          so2Grade: climate[i].so2Grade,
          no2Grade: climate[i].no2Grade,
          coGrade: climate[i].coGrade,
          khaiGrade: climate[i].khaiGrade,
          khaiStatus: climate[i].khaiStatus,
          created: this.now,
        },
      });
    }

    Logger.info('Korean Climate Inserted Finished.');
  }

  async insertHackerNewsData(hackerNews: Array<HackersNewsArrayType>) {
    Logger.debug('Insert Hacker News Data: %o', { hackerNews });

    for (let i = 0; i < hackerNews.length; i += 1) {
      await this.prisma.hackers.create({
        data: {
          rank: hackerNews[i].rank,
          post: hackerNews[i].post,
          link: hackerNews[i].link,
          founded: this.now,
        },
      });
    }

    Logger.info('Hacker News Inserted Finished.');
  }

  async insertNaverNews(naverNews: Array<NaverNewsItems>) {
    Logger.debug('Insert Naver News: %o', { naverNews });

    for (let i = 0; i < naverNews.length; i += 1) {
      await this.prisma.naverNews.create({
        data: {
          keyWord: 'IT',
          title: naverNews[i].title,
          description: naverNews[i].description.replace(/[\n\t\r]/g, ''),
          originallink: naverNews[i].originallink,
          url: naverNews[i].link,
          postedTime: naverNews[i].pubDate,
          founded: this.now,
        },
      });
    }

    Logger.info('Naver IT News Inserted Finished.');
  }
}
