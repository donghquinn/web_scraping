import { ClimateError } from 'errors/climate.error';
import fetch from 'node-fetch';
import { ClimateReturnData, Response } from 'types/climate.type';
import { ScrapeLogger } from 'utils/logger.util';

export const getKoreanClimate = async () => {
  try {
    let khaiStatus: string;

    const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.KOREAN_ENCODED_TOKEN!;

    const options = {
      method: 'GET',
    };

    const response = await fetch(
      `${url}?returnType=json&serviceKey=${token}&numOfRows=1pageNo=1&&stationName=종로구&dataTerm=DAILY&numOfRows=23`,
      options,
    );

    const responseData = (await response.json()) as Response;

    const climate = responseData.response.body.items as Array<ClimateReturnData>;

    for (let i = 0; i < climate.length; i += 1) {
      if (Number(climate[i].khaiGrade) === 1) {
        khaiStatus = 'Good';
        climate[i].khaiStatus = khaiStatus;
      }

      if (Number(climate[i].khaiGrade) === 2) {
        khaiStatus = 'Normal';
        climate[i].khaiStatus = khaiStatus;
      }

      if (Number(climate[i].khaiGrade) === 3) {
        khaiStatus = 'Bad';
        climate[i].khaiStatus = khaiStatus;
      }

      if (Number(climate[i].khaiGrade) >= 4) {
        khaiStatus = 'Very Bad';
        climate[i].khaiStatus = khaiStatus;
      }
    }

    ScrapeLogger.info('Climate Data Inserted');

    return climate;
  } catch (error) {
    ScrapeLogger.error('Scrape Korean Climate Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ClimateError(
      'Korean Climate',
      'Get Korean Climate Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
