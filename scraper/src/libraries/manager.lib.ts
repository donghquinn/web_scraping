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

        const hackerData = await scrapeHackerNews();
        const bbcData = await scrapeBbcTechNews();
        const melonData = await scrapeMelonChart();
        const climateData = await getKoreanClimate();
        const naverData = await naverNews();

        this.hacker = hackerData;
        this.bbc = bbcData;
        this.melon = melonData;
        this.climate = climateData;
        this.naver = naverData;

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
      await this.insert.insertBbcData(bbc);
  
      await  this.insert.insertClimateData(climate);
  
      await  this.insert.insertHackerNewsData(hacker);
  
      await  this.insert.insertMelonData(melon);
  
      await this.insert.insertNaverNews(naver);
  
      this.bbc = [];
      this.climate = [];
      this.hacker = [];
      this.melon = [];
      this.naver = [];
      
      return true;
    } catch (error) {
      Logger.error("Insert Scraped Data Error: %o", {
        error: error instanceof Error ? error : new Error(JSON.stringify(error))
      });

      throw new ManagerError(
        "Scrape Manager", 
        "Data Insert Error", 
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
