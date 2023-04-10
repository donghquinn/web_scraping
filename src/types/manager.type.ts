import { BbcNewsReturnArray } from './bbc.type';
import { ClimateReturnData } from './climate.type';
import { HackersNewsArrayType } from './hackers.type';
import { MusicRank } from './music.type';
import { NaverNewsItems } from './naver.type';

export interface ScrapeResultArray {
  bbc: BbcNewsReturnArray[];
  hackers: HackersNewsArrayType[];
  melon: MusicRank[];
  climate: ClimateReturnData[];
  naverNews: NaverNewsItems[];
}
