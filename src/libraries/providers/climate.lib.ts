import { Inject, Injectable, Logger } from '@nestjs/common';
import { sub, subDays } from 'date-fns';
import { ClimateError } from 'errors/climate.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Injectable()
export class ClimateProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getDailyClimateData() {
    try {
      const now = new Date();

      const result = await this.prisma.climate.findMany({
        select: {
          pm10Value: true,
          no2Value: true,
          o3Value: true,
          coValue: true,
          so2Value: true,
          khaiValue: true,
          o3Grade: true,
          so2Grade: true,
          no2Grade: true,
          coGrade: true,
          khaiGrade: true,
          khaiStatus: true,
          dataTime: true,
          created: true,
        },
        orderBy: { dataTime: 'desc' },
      });

      const returnArray: unknown[] = [];

      result.filter((item) => {
        // Logger.debug('Date: %o', { created: item.created.toDateString(), now: now.toDateString() });

        if (item.created.getDate() === now.getDate() - 1 && item.created.getMonth() === now.getMonth()) {
          returnArray.push(item);
        }
      });

      if (returnArray.length === 0) {
        Logger.log("It's Not Founded Yet");
      } else {
        Logger.log('Found Climate');
      }

      return returnArray;
    } catch (error) {
      Logger.error('Bring Korean Climate Data Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new ClimateError(
        'Korean Climate Provider',
        'Korean Climate Provider Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
