import { Logger } from '@nestjs/common';
import { ClimateError } from 'errors/climate.error';
import fetch from 'node-fetch';
import { ClimateReturnData, Response } from 'types/climate.type';

export const getKoreanClimate = async () => {
  try {
    let khaiStatus: string;

    const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.CLIMATE_ENCODED_TOKEN!;

    const options = {
      method: 'GET',
    };

    const response = await fetch(
      `${url}?returnType=json&serviceKey=${token}&numOfRows=1pageNo=1&&stationName=종로구&dataTerm=DAILY`,
      options,
    );

    const responseData = (await response.json()) as Response;

    // Logger.debug('ResponseData: %o', { responseData });

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

    Logger.debug('Climate Return Data: %o', { climate });

    return climate;
  } catch (error) {
    throw new ClimateError(
      'Korean Climate',
      'Get Korean Climate Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
