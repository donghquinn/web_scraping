import { ManagerError } from 'errors/manager.error';
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

    this.rule.minute = 59;
    this.rule.hour = 23;

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
    schedule.scheduleJob(this.rule, async () => {
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
          this.hacker = result[0].value;
        } else {
          Logger.error('Hackers News Scraping Error: %o', { reason: result[0].reason });
        }

        if (result[1].status === 'fulfilled') {
          this.bbc = result[1].value;
        } else {
          Logger.error('BBC News Scraping Error: %o', { reason: result[1].reason });
        }

        if (result[2].status === 'fulfilled') {
          this.melon = result[2].value;
        } else {
          Logger.error('Melon Scraping Error: %o', { reason: result[2].reason });
        }

        if (result[3].status === 'fulfilled') {
          this.climate = result[3].value;
        } else {
          Logger.error('Korean Climate Scraping Error: %o', { reason: result[3].reason });
        }

        if (result[4].status === 'fulfilled') {
          this.naver = result[4].value;
        } else {
          Logger.error('Naver News Scraping Error: %o', { reason: result[4].reason });
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
    try {
      const result = await Promise.allSettled([
        this.insert.insertBbcData(bbc),
        this.insert.insertClimateData(climate),
        this.insert.insertHackerNewsData(hacker),
        this.insert.insertMelonData(melon),
        this.insert.insertNaverNews(naver),
      ]);

      if (result[1]) {
        console.log('a');
      }
      if (result[0].status === 'rejected') {
        Logger.error('Insert BBC Data Error: %o', { reason: result[0].reason });
        this.bbc = [];
      } else {
        this.bbc = [];
      }

      if (result[1].status === 'rejected') {
        Logger.error('Insert Korean Climate Data Error: %o', { reason: result[1].reason });
        this.climate = [];
      } else {
        this.climate = [];
      }

      if (result[2].status === 'rejected') {
        Logger.error('Insert Hackers News Data Error: %o', { reason: result[2].reason });
        this.hacker = [];
      } else {
        this.hacker = [];
      }

      if (result[3].status === 'rejected') {
        Logger.error('Insert Melon Data Error: %o', { reason: result[3].reason });
        this.melon = [];
      } else {
        this.melon = [];
      }

      if (result[4].status === 'rejected') {
        Logger.error('Insert Naver News Data Error: %o', { reason: result[4].reason });
        this.naver = [];
      } else {
        this.naver = [];
      }

      return true;
    } catch (error) {
      Logger.error('Insert Scraped Data Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new ManagerError(
        'Scrape Manager',
        'Data Insert Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}

