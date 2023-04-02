import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ScrapeObserver } from 'libraries/manager.lib';

export async function shutdown(server: NestExpressApplication) {
  try {
    const observer = new ScrapeObserver();

    await server.close();
    observer.stop();

    process.exitCode = 0;
  } catch (error) {
    Logger.error('[Process] error occurred while graceful exit.');
    Logger.error('%o', error);
    Logger.error('[Process] abnormal exit(1).');

    // 비정상 프로세스 종료

    process.exitCode = 1;
  }
}