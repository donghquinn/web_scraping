import { ClimateReturnData } from './climate.type';
import { MusicRank } from './music.type';
import { NaverNewsItems } from './naver.type';
import { NewsArrayType } from './bbc.type';

export interface ScrapeResultArray {
  bbc: NewsArrayType[];
  hackers: NewsArrayType[];
  melon: MusicRank[];
  climate: ClimateReturnData[];
  naverNews: NaverNewsItems[];
}
