import { Logger } from '@nestjs/common';
import { PrismaError } from 'errors/prisma.error';
import { ClimateReturnData } from 'types/climate.type';
import { MusicRank } from 'types/music.type';
import { NaverNewsItems } from 'types/naver.type';
import { NewsArrayType } from 'types/news.type';
import { PrismaLibrary } from './common/prisma.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';
import { naverNews } from './scrape/naver.lib';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private prisma: PrismaLibrary;

  private workTime: boolean;

  private now: Date;

  private runningMoment: Date;

  private interval: number;

  private blockTimer: ReturnType<typeof setIntervalAsync> | null;

  constructor() {
    // ms 기준 - 1분에 한번씩 시간 체크

    this.interval = Number(process.env.INTERVAL!);

    this.prisma = new PrismaLibrary();

    this.workTime = false;

    this.now = new Date();

    this.runningMoment = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 23, 59);

    this.blockTimer = null;
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
        this.timeCheck();

        if (this.workTime) {
          Logger.log('Scrape Start');

          const hakcerNewsResult = await scrapeHackerNews();
          const bbcNewsResult = await scrapeBbcTechNews();
          const melonMusicChart = await scrapeMelonChart();
          const climate = await getKoreanClimate();
          const naverNewsResult = await naverNews();

          await this.receivedDataInsert(hakcerNewsResult, bbcNewsResult, melonMusicChart, climate, naverNewsResult);

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

  async receivedDataInsert(
    hackersNews: NewsArrayType[],
    bbcNews: NewsArrayType[],
    melonMusicChart: MusicRank[],
    climateDate: ClimateReturnData[],
    naverNewsResult: NaverNewsItems[],
  ) {
    try {
      await this.prisma.hackers.createMany({
        data: hackersNews,
      });

      Logger.log('Hacker News Inserted Finished.');

      await this.prisma.bbcTechNews.createMany({
        data: bbcNews,
      });

      Logger.log('BBC News Inserted Finished.');

      await this.prisma.melon.createMany({ data: melonMusicChart });

      Logger.log('Melon Music Chart Inserted Finished.');

      for (let i = 0; i < climateDate.length; i += 1) {
        await this.prisma.climate.create({
          data: {
            dataTime: climateDate[i].dataTime,
            pm10Value: climateDate[i].pm10Value,
            no2Value: climateDate[i].no2Value,
            o3Value: climateDate[i].o3Value,
            coValue: climateDate[i].coValue,
            so2Value: climateDate[i].so2Value,
            khaiValue: climateDate[i].khaiValue,
            o3Grade: climateDate[i].o3Grade,
            so2Grade: climateDate[i].so2Grade,
            no2Grade: climateDate[i].no2Grade,
            coGrade: climateDate[i].coGrade,
            khaiGrade: climateDate[i].khaiGrade,
            khaiStatus: climateDate[i].khaiStatus,
          },
        });
      }

      Logger.log('Korean Climate Inserted Finished.');

      for (let i = 0; i < naverNewsResult.length; i += 1) {
        await this.prisma.naverNews.create({
          data: {
            keyWord: 'IT',
            title: naverNewsResult[i].title,
            description: naverNewsResult[i].description,
            originallink: naverNewsResult[i].originallink,
            url: naverNewsResult[i].link,
            postedTime: naverNewsResult[i].pubDate,
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
    Logger.debug({ now: this.now, runningMoment: this.runningMoment });

    if (
      this.now.getFullYear() === this.runningMoment.getFullYear() &&
      this.now.getMonth() === this.runningMoment.getMonth() &&
      this.now.getDay() === this.runningMoment.getDay() &&
      this.now.getHours() === this.runningMoment.getHours() &&
      this.now.getMinutes() === this.runningMoment.getMinutes()
    ) {
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

// return isTime;
