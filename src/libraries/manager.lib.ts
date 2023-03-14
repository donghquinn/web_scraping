import { Logger } from '@nestjs/common';
import { setIntervalAsync } from 'set-interval-async';
import { PrismaLibrary } from './common/prisma.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';

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

        await this.prisma.hackers.createMany({
          data: hakcerNewsResult,
        });

        Logger.log('Hacker News Inserted Finished.');

        await this.prisma.bbcTechNews.createMany({
          data: bbcNewsResult,
        });

        Logger.log('BBC News Inserted Finished.');

        await this.prisma.melon.createMany({ data: melonMusicChart });

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
      } catch (error) {
        Logger.error('Error: %o', { error });

        Logger.error('Observer Error: %o', {
          error: error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    }, this.interval);
  }
}
