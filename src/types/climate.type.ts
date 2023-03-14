export interface Response {
  body: ClimateResponse;
}

export interface ClimateResponse {
  total: string;
  items: Array<ClimateItems>;
}

export interface ClimateItems {
  so2Grade: string;
  coFlag: string | null;
  khaiValue: string;
  khaiGrade: string;
  so2Value: string;
  coValue: string;
  pm10Flag: string | null;
  pm10Value: string;
  o3Grade: string;
  no2Flage: string | null;
  no2Grade: string;
  o3Flag: string | null;
  so2Flag: string | null;
  dataTime: string;
  coGrade: string;
  no2Value: string;
  pm10Grade: string;
  o3Value: string;
}
