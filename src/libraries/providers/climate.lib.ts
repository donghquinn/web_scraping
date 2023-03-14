import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClimateError } from 'errors/climate.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Injectable()
export class ClimateProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getDailyClimateData() {
    try {
      const today = new Date().toLocaleDateString();

      Logger.debug('Today: %o', { today });

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
        },
        where: { dataTime: today },
        orderBy: { dataTime: 'desc' },
      });

      Logger.debug('Today Climate date: %o', { ...result });

      return result;
    } catch (error) {
      throw new ClimateError(
        'Korean Climate Provider',
        'Korean Climate Provider Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
