import { Module } from '@nestjs/common';
import { LoggerProvider } from 'utils/logger.util';

@Module({
  providers: [LoggerProvider],
  exports: [LoggerProvider],
})
export class LoggerModule {}
