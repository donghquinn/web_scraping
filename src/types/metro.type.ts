export interface SeoulMetroResponse {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: SeoulMetroData[];
}

export interface MetroData {
  station: string;
  stationNumber: string;
  date: string;
  '05~06': string;
  '06~07': string;
  '07~08': string;
  '08~09': string;
  '09~10': string;
  '10~11': string;
  '11~12': string;
  '12~13': string;
  '13~14': string;
  '14~15': string;
  '15~16': string;
  '16~17': string;
  '17~18': string;
  '18~19': string;
  '19~20': string;
  '20~21': string;
  '21~22': string;
  '22~23': string;
  '23~24': string;
  '24~': string;
}

export interface SeoulMetroData {
  날짜: string;
  역번호: string;
  역명: string;
  구분: string;
  '05~06': string;
  '06~07': string;
  '07~08': string;
  '08~09': string;
  '09~10': string;
  '10~11': string;
  '11~12': string;
  '12~13': string;
  '13~14': string;
  '14~15': string;
  '15~16': string;
  '16~17': string;
  '17~18': string;
  '18~19': string;
  '19~20': string;
  '20~21': string;
  '21~22': string;
  '22~23': string;
  '23~24': string;
  '24~': string;
}
