import { Injectable, Logger } from '@nestjs/common';
import { MelonError } from 'errors/melon.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';

@Injectable()
export class MusicChartProvider {
  constructor(private prisma: PrismaLibrary) {}

  async melonMusicChart() {
    try {
      const today = new Date();

      Logger.debug('Today: %o', { today });

      const result = await this.prisma.melon.findMany({
        select: { rank: true, title: true, artist: true },
        where: { founded: today },
      });

      Logger.debug('Melon Music Chart Founded: %o', { result });
      return result;
    } catch (error) {
      throw new MelonError(
        'Music Chart',
        'Bring MelonChart Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
