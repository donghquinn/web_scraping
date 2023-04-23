import { Logger } from '@nestjs/common';
import moment from 'moment-timezone';
import schedule, { RecurrenceRule } from 'node-schedule';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { BbcNewsReturnArray } from 'types/bbc.type';
import { ClimateReturnData } from 'types/climate.type';
import { HackersNewsArrayType } from 'types/hackers.type';
import { MusicRank } from 'types/music.type';
import { NaverNewsItems } from 'types/naver.type';
import { PrismaLibrary } from './common/prisma.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';
import { naverNews } from './scrape/naver.lib';

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private prisma: PrismaLibrary;

  private now: string;

  private rule: RecurrenceRule;

  private blockTimer: ReturnType<typeof setIntervalAsync> | null;

  private bbc: Array<BbcNewsReturnArray>;

  private hacker: Array<HackersNewsArrayType>;

  private climate: Array<ClimateReturnData>;

  private melon: Array<MusicRank>;

  private naver: Array<NaverNewsItems>;

  constructor() {
    // ms 기준 - 1분에 한번씩 시간 체크

    this.prisma = new PrismaLibrary();

    this.rule = new schedule.RecurrenceRule();

    this.rule.tz = 'Asia/Seoul';

    this.rule.date = new Date().getDate();

    this.rule.hour = 23;

    this.rule.minute = 59;

    this.now = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

    this.blockTimer = null;

    this.bbc = [];
    this.hacker = [];
    this.climate = [];
    this.naver = [];
    this.melon = [];
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ScrapeObserver();
    }

    return this.instance;
  }

  public start() {
    schedule.scheduleJob('0 59 23 * * *', async () => {
      try {
        Logger.log('Scrape Start');

        const result = await Promise.allSettled([
          scrapeHackerNews(),
          scrapeBbcTechNews(),
          scrapeMelonChart(),
          getKoreanClimate(),
          naverNews(),
        ]);

        if (result[0].status === 'fulfilled') {
          this.hacker = result[0].value;
        } else if (result[0].status === 'rejected') {
          Logger.error('Hackers News Scrape Error: %o', { error: result[0].reason });
        }

        if (result[1].status === 'fulfilled') {
          this.bbc = result[1].value;
        } else if (result[1].status === 'rejected') {
          Logger.error('BBC News Scrape Error: %o', { error: result[1].reason });
        }

        if (result[2].status === 'fulfilled') {
          this.melon = result[2].value;
        } else if (result[2].status === 'rejected') {
          Logger.error('Melon Music Rank Chart Scrape Error: %o', { error: result[2].reason });
        }

        if (result[3].status === 'fulfilled') {
          this.climate = result[3].value;
        } else if (result[3].status === 'rejected') {
          Logger.error('Korea Climate Scrape Error: %o', { error: result[3].reason });
        }

        if (result[4].status === 'fulfilled') {
          this.naver = result[4].value;
        } else if (result[4].status === 'rejected') {
          Logger.error('Naver News Scrape Error: %o', { error: result[4].reason });
        }

        await this.receivedDataInsert(this.bbc, this.naver, this.hacker, this.melon, this.climate);
      } catch (error) {
        Logger.error('Error: %o', { error });

        Logger.error('Observer Error: %o', {
          error: error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    });

    // Logger.debug('Now, and Running Moment: %o', { now: now, runningMoment });
  }

  async receivedDataInsert(
    bbc: Array<BbcNewsReturnArray>,
    naver: Array<NaverNewsItems>,
    hacker: Array<HackersNewsArrayType>,
    melon: Array<MusicRank>,
    climate: Array<ClimateReturnData>,
  ) {
    const result = await Promise.allSettled([
      this.insertBbcData(bbc),
      this.insertClimateData(climate),
      this.insertHackerNewsData(hacker),
      this.insertMelonData(melon),
      this.insertNaverNews(naver),
    ]);

    const runResult = result.map<string>((item) => {
      if (item.status === 'rejected') {
        Logger.error('Insert Data Failed: %o', { reason: item.reason });

        return item.reason;
      } else {
        Logger.log('Data Insert Finished');

        return 'success';
      }
    });

    return runResult;
  }

  async insertBbcData(bbc: Array<BbcNewsReturnArray>) {
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

    Logger.log('BBC News Inserted Finished.');

    this.bbc.length = 0;
  }

  async insertMelonData(melon: Array<MusicRank>) {
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

    Logger.log('Melon Music Chart Inserted Finished.');

    this.melon.length = 0;
  }

  async insertClimateData(climate: Array<ClimateReturnData>) {
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

    Logger.log('Korean Climate Inserted Finished.');

    this.climate.length = 0;
  }

  async insertHackerNewsData(hackerNews: Array<HackersNewsArrayType>) {
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

    Logger.log('Hacker News Inserted Finished.');

    this.hacker.length = 0;
  }

  async insertNaverNews(naverNews: Array<NaverNewsItems>) {
    for (let i = 0; i < naverNews.length; i += 1) {
      await this.prisma.naverNews.create({
        data: {
          keyWord: 'IT',
          title: naverNews[i].title,
          description: naverNews[i].description,
          originallink: naverNews[i].originallink,
          url: naverNews[i].link,
          postedTime: naverNews[i].pubDate,
          founded: this.now,
        },
      });
    }

    Logger.log('Naver IT News Inserted Finished.');

    this.naver.length = 0;
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
