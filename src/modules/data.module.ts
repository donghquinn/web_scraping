import { Module } from '@nestjs/common';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import { ScrapeObserver } from 'libraries/manager.lib';
import { ScrapedDataInsert } from 'libraries/providers/datainsert.lib';

@Module({
  providers: [PrismaLibrary, ScrapeObserver, ScrapedDataInsert],
  exports: [ScrapedDataInsert],
})
export class DataModule {}
