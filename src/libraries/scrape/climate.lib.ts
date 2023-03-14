import { Logger } from '@nestjs/common';
import { ClimateError } from 'errors/climate.error';
import fetch from 'node-fetch';
import { Response } from 'types/climate.type';

export const getKoreanClimate = async () => {
  try {
    const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.CLIMATE_ENCODED_TOKEN!;

    const options = {
      method: 'GET',
    };

    const response = await fetch(
      `${url}?returnType=json&serviceKey=${token}&numOfRows=10pageNo=1&&stationName=종로구&dataTerm=DAILY`,
      options,
    );

    const responseData = (await response.json()) as Response;

    Logger.debug('ResponseData: %o', { responseData });

    return responseData;
  } catch (error) {
    throw new ClimateError('Korean Climate', 'Get Korean Climate Error');
  }
};

await getKoreanClimate();
