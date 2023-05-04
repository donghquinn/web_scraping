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
    schedule.scheduleJob('0 10 23 * * *', async () => {
      try {
        Logger.info('Scrape Start');

        const result = await Promise.allSettled([
          scrapeHackerNews(),
          scrapeBbcTechNews(),
          scrapeMelonChart(),
          getKoreanClimate(),
          naverNews(),
        ]);

        if (result[0].status === 'fulfilled') {
          Logger.debug('Founded Hacker News: ', result[0].value);
          this.hacker = result[0].value;
          Logger.debug('Hacker News Array: ', this.hacker);
        } else if (result[0].status === 'rejected') {
          Logger.error('Hackers News Scrape Error: %o', { error: result[0].reason });
        }

        if (result[1].status === 'fulfilled') {
          Logger.debug('Founded BBC News: ', result[1].value);
          this.bbc = result[1].value;
          Logger.debug('BBC News Array: ', this.bbc);
        } else if (result[1].status === 'rejected') {
          Logger.error('BBC News Scrape Error: %o', { error: result[1].reason });
        }

        if (result[2].status === 'fulfilled') {
          Logger.debug('Found Melon Music: ', result[2].value);
          this.melon = result[2].value;
          Logger.debug('Melon Music Array: ', this.melon);
        } else if (result[2].status === 'rejected') {
          Logger.error('Melon Music Rank Chart Scrape Error: %o', { error: result[2].reason });
        }

        if (result[3].status === 'fulfilled') {
          Logger.debug('Founded Climate Data', result[3].value);
          this.climate = result[3].value;
          Logger.debug('Climate Array: ', this.climate);
        } else if (result[3].status === 'rejected') {
          Logger.error('Korea Climate Scrape Error: %o', { error: result[3].reason });
        }

        if (result[4].status === 'fulfilled') {
          Logger.debug('Founded Naver News: ', this.naver);
          this.naver = result[4].value;
          Logger.debug('Naver News Array: ', this.naver);
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
      this.insert.insertBbcData(bbc),
      this.insert.insertClimateData(climate),
      this.insert.insertHackerNewsData(hacker),
      this.insert.insertMelonData(melon),
      this.insert.insertNaverNews(naver),
    ]);

    const runResult = result.map<string>((item) => {
      if (item.status === 'rejected') {
        Logger.error('Insert Data Failed: %o', { reason: item.reason });

        return item.reason;
      }

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
