export interface MusicRank {
  rank: number;
  title: string;
  artist: string;
}

export interface MusicNaverSearchResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: Array<NaverSearchResults>;
}

export interface NaverSearchResults {
  title: string;
  keywords: Array<string>;
  data: [];
}
