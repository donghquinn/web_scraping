import { Logger } from '@nestjs/common';
import { ClimateError } from 'errors/climate.error';
import fetch from 'node-fetch';

interface Response {
  body: ClimateResponse;
}

interface ClimateResponse {
  total: string;
  items: Array<ClimateItems>;
}

interface ClimateItems {
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

export const getKoreanClimate = async () => {
  try {
    const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.CLIMATE_ENCODED_TOKEN!;

    const options = {
      method: 'GET',
    };

    const response = await fetch(
      `${url}?returnType=json&serviceKey=${token}&numOfRows=10pageNo=1&&stationName=종로구&dataTerm=DAILY`,
    );

    const responseData = (await response.json()) as Response;

    Logger.debug('ResponseData: %o', { responseData });

    return responseData;
  } catch (error) {
    throw new ClimateError('Korean Climate', 'Get Korean Climate Error');
  }
};

await getKoreanClimate();
