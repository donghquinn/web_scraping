import { Logger } from '@nestjs/common';
import { PrismaError } from 'errors/prisma.error';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { ScrapeResultArray } from 'types/manager.type';
import { PrismaLibrary } from './common/prisma.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';
import { naverNews } from './scrape/naver.lib';
import { HackersNewsArrayType } from 'types/hackers.type';
import { NaverNewsResponse } from 'types/naver.type';

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private prisma: PrismaLibrary;

  private workTime: boolean;

  private now: Date;

  private runningMoment: Date;

  private interval: number;

  private blockTimer: ReturnType<typeof setIntervalAsync> | null;

  private scrapeResultArray: ScrapeResultArray;

  constructor() {
    // ms 기준 - 1분에 한번씩 시간 체크
    this.interval = Number(process.env.INTERVAL!);

    this.prisma = new PrismaLibrary();

    this.workTime = false;

    this.now = new Date();

    this.runningMoment = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 23, 59);

    this.blockTimer = null;

    this.scrapeResultArray = { bbc: [], hackers: [], climate: [], naverNews: [], melon: [] };
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ScrapeObserver();
    }

    return this.instance;
  }

  public start() {
    setIntervalAsync(async () => {
      try {
        Logger.log('Start time Check');
        this.now = new Date();

        this.timeCheck();

        if (this.workTime) {
          Logger.log('Scrape Start');

          const result = await Promise.allSettled([
            scrapeHackerNews(),
            scrapeBbcTechNews(),
            scrapeMelonChart(),
            getKoreanClimate(),
            naverNews(),
          ]);

          if (result[0].status === 'fulfilled') {
            this.scrapeResultArray.hackers = result[0].value;
          } else if (result[0].status === 'rejected') {
            Logger.error('Hackers News Scrape Error: %o', { error: result[0].reason });
          }

          if (result[1].status === 'fulfilled') {
            this.scrapeResultArray.bbc = result[1].value;
          } else if (result[1].status === 'rejected') {
            Logger.error('BBC News Scrape Error: %o', { error: result[1].reason });
          }

          if (result[2].status === 'fulfilled') {
            this.scrapeResultArray.melon = result[2].value;
          } else if (result[2].status === 'rejected') {
            Logger.error('Melon Music Rank Chart Scrape Error: %o', { error: result[2].reason });
          }

          if (result[3].status === 'fulfilled') {
            this.scrapeResultArray.climate = result[3].value;
          } else if (result[3].status === 'rejected') {
            Logger.error('Korea Climate Scrape Error: %o', { error: result[3].reason });
          }

          if (result[4].status === 'fulfilled') {
            this.scrapeResultArray.naverNews = result[4].value;
          } else if (result[4].status === 'rejected') {
            Logger.error('Naver News Scrape Error: %o', { error: result[4].reason });
          }

          await this.receivedDataInsert(this.scrapeResultArray);

          // 실행 완료 후, 다시 false로
          this.workTime = false;
        }
      } catch (error) {
        Logger.error('Error: %o', { error });

        Logger.error('Observer Error: %o', {
          error: error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    }, this.interval);

    // Logger.debug('Now, and Running Moment: %o', { now: now, runningMoment });
  }

  async receivedDataInsert(scrapeResults: ScrapeResultArray) {
    const { bbc, hackers, melon, climate, naverNews } = scrapeResults;
    try {
      await this.prisma.hackers.createMany({
        data: hackers,
      });

      Logger.log('Hacker News Inserted Finished.');

      await this.prisma.bbcTechNews.createMany({
        data: bbc,
      });

      Logger.log('BBC News Inserted Finished.');

      await this.prisma.melon.createMany({ data: melon });

      Logger.log('Melon Music Chart Inserted Finished.');

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
          },
        });
      }

      Logger.log('Korean Climate Inserted Finished.');

      for (let i = 0; i < naverNews.length; i += 1) {
        await this.prisma.naverNews.create({
          data: {
            keyWord: 'IT',
            title: naverNews[i].title,
            description: naverNews[i].description,
            originallink: naverNews[i].originallink,
            url: naverNews[i].link,
            postedTime: naverNews[i].pubDate,
          },
        });
      }

      Logger.log('Naver IT News Inserted Finished.');

      return 'Success';
    } catch (error) {
      Logger.error('Prisma Error: %o', { error: error instanceof Error ? error : new Error(JSON.stringify(error)) });

      throw new PrismaError(
        'Prisma Manager',
        'Prisma Manager Data Insert Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  timeCheck() {
    this.runningMoment = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 23, 59);

    // Logger.debug({ now: this.now, runningMoment: this.runningMoment });

    if (
      this.now.getFullYear() === this.runningMoment.getFullYear() &&
      this.now.getMonth() === this.runningMoment.getMonth() &&
      this.now.getDay() === this.runningMoment.getDay() &&
      this.now.getHours() === this.runningMoment.getHours() &&
      this.now.getMinutes() === this.runningMoment.getMinutes()
    ) {
      Logger.debug({ now: this.now, runningMoment: this.runningMoment });

      this.workTime = true;
    } else {
      this.workTime = false;
    }

    Logger.log(`Is Working Time: ${this.workTime}`);

    return this.workTime;
  }

  public stop() {
    if (this.blockTimer) {
      clearIntervalAsync(this.blockTimer);

      this.blockTimer = null;

      this.prisma.$disconnect();

      Logger.log('[Observer] Waiting for queue idle...');

      Logger.log('[Observer] Queue is idle, stopped');
    }
  }
}
