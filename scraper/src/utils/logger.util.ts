import path from 'path';
import { fileURLToPath } from 'url';
import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const dirSaveName = path.join(dirName, '..', '..', 'logs');

// 로그 포맷 설정
// const { combine, timestamp: defaultTimestamp, printf, splat, json } = Winston.format;

// /* eslint-disable @typescript-eslint/restrict-template-expressions */
// const printFormat = printf(({ level, message, timestamp }) => {
//   const rid = rTracer.id() as string;

//   return rid ? `${timestamp} ${level} [request-id:${rid}]: ${message}` : `${timestamp} ${level}: ${message}`;
//   /* eslint-enable @typescript-eslint/restrict-template-expressions */
// });

class WinstonLogger {
  private static instance: WinstonLogger;

  private apiLogger: Winston.Logger;

  private txLogger: Winston.Logger;

  private callbackLogger: Winston.Logger;

  private parseLogger: Winston.Logger;

  private logger: Winston.Logger;

  private shareLogger: Winston.Logger;

  private constructor() {
    this.apiLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.api.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.shareLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.share.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.txLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.tx.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.callbackLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.cb.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.parseLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.parser.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.logger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.error.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.combined.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
      ],
    });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WinstonLogger();
    }

    return {
      ApiLogger: this.instance.apiLogger,
      TxLogger: this.instance.txLogger,
      CallbackLogger: this.instance.callbackLogger,
      ParseLogger: this.instance.parseLogger,
      Logger: this.instance.logger,
      ShareLogger: this.instance.shareLogger,
    };
  }
}

export const { ApiLogger, TxLogger, CallbackLogger, ParseLogger, Logger, ShareLogger } = WinstonLogger.getInstance();