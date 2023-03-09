export interface NaverSearchRequests {
  age: string;
  options: NaverDataLabRequestOptions;
}

export interface NaverDataLabRequestOptions {
  method: string;
  body: string;
}

export interface NaverDataLabResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  result: Array<NaverDataLabResults>;
}

export interface NaverDataLabResults {
  title: string;
  keywords: Array<string>;
  data: Array<NaverDataLabDataResult>;
}

export interface NaverDataLabDataResult {
  period: string;
  ratio: string;
}
