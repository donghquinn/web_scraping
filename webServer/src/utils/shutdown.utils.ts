import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export function shutdown(server: NestExpressApplication) {
  try {
    server.close();

    process.exitCode = 0;
  } catch (error) {
    Logger.error('[Process] error occurred while graceful exit.');
    Logger.error('%o', error);
    Logger.error('[Process] abnormal exit(1).');

    // 비정상 프로세스 종료
    process.exitCode = 1;
  }
}
