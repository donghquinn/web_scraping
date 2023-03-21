import { Logger } from '@nestjs/common';
import { setIntervalAsync } from 'set-interval-async';
import { PrismaLibrary } from './common/prisma.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';
import { PrismaError } from 'errors/prisma.error';
import { NewsArrayType } from 'types/news.type';
import { MusicRank } from 'types/music.type';
import { ClimateReturnData } from 'types/climate.type';
import { naverNews } from './scrape/naver.lib';

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private interval: number;

  private prisma: PrismaLibrary;

  constructor() {
    // ms 기준
    this.interval = Number(process.env.INTERVAL);
    // this.interval = Math.ceil(Math.random() * 10) * 1000;

    this.prisma = new PrismaLibrary();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ScrapeObserver();
    }

    return this.instance;
  }

  start() {
    setIntervalAsync(async () => {
      try {
        const hakcerNewsResult = await scrapeHackerNews();
        const bbcNewsResult = await scrapeBbcTechNews();
        const melonMusicChart = await scrapeMelonChart();
        const climate = await getKoreanClimate();
        const naver = await naverNews();

        await this.receivedDataInsert(hakcerNewsResult, bbcNewsResult, melonMusicChart, climate);
      } catch (error) {
        Logger.error('Error: %o', { error });

        Logger.error('Observer Error: %o', {
          error: error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    }, this.interval);
  }

  async receivedDataInsert(
    hackersNews: NewsArrayType[],
    bbcNews: NewsArrayType[],
    melonMusicChart: MusicRank[],
    climateDate: ClimateReturnData[],
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
    } catch (error) {
      throw new PrismaError(
        'Prisma Manager',
        'Prisma Manager Data Insert Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
