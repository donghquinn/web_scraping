import schedule, { RecurrenceRule } from 'node-schedule';
import { BbcNewsReturnArray } from 'types/bbc.type';
import { ClimateReturnData } from 'types/climate.type';
import { HackersNewsArrayType } from 'types/hackers.type';
import { MusicRank } from 'types/music.type';
import { NaverNewsItems } from 'types/naver.type';
import { Logger } from 'utils/logger.util';
import { InsertData } from './common/insert.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';
import { naverNews } from './scrape/naver.lib';

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private insert: InsertData;

  private rule: RecurrenceRule;

  private bbc: Array<BbcNewsReturnArray>;

  private hacker: Array<HackersNewsArrayType>;

  private climate: Array<ClimateReturnData>;

  private melon: Array<MusicRank>;

  private naver: Array<NaverNewsItems>;

  constructor() {
    this.rule = new schedule.RecurrenceRule();

    this.insert = new InsertData();

    this.rule.tz = 'Asia/Seoul';

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
        Logger.info('Scrape Start');

        await scrapeHackerNews();
        await scrapeBbcTechNews();
        await scrapeMelonChart();
        await getKoreanClimate();
        await naverNews();

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
      this.insert.insertBbcData(bbc),
      this.insert.insertClimateData(climate),
      this.insert.insertHackerNewsData(hacker),
      this.insert.insertMelonData(melon),
      this.insert.insertNaverNews(naver),
    ]);

    const runResult = result.map<string>((item) => {
      // if (item.status === 'rejected') {
      //   Logger.error('Insert Data Failed: %o', { reason: item.reason });

      //   return item.reason;
      // }

      if (item.status === 'fulfilled') {
        Logger.info('Data Insert Finished');

        this.hacker.length = 0;
        this.bbc.length = 0;
        this.naver.length = 0;
        this.climate.length = 0;
        this.melon.length = 0;

        return 'success';
      }

      throw new Error("Run Scrape Failed");
    });

    return runResult;
  }
}
