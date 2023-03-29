import { Module } from '@nestjs/common';
import { LoggerUtility } from 'utils/logger.util';

@Module({
  providers: [LoggerUtility],
  exports: [LoggerUtility],
})
export class LoggerModule {}
