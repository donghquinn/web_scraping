import { Injectable } from '@nestjs/common';
import path from 'path';
import { fileURLToPath } from 'url';
import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const dirSaveName = path.join(dirName, '..', '..', 'logs');

// 로그 포맷 설정
const { colorize, combine, timestamp: defaultTimestamp, printf, splat, json } = Winston.format;

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const formatted = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

@Injectable()
export class LoggerProvider {
  // private static instance: LoggerProvider;

  logger: Winston.Logger;

  authLogger: Winston.Logger;

  normalLogger: Winston.Logger;

  otherLogger: Winston.Logger;

  calculateLogger: Winston.Logger;

  apiLogger: Winston.Logger;

  queryLogger: Winston.Logger;

  userLogger: Winston.Logger;

  typeLogger: Winston.Logger;

  testLogger: Winston.Logger;

  constructor() {
    this.authLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.auth.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.userLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.user.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.testLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.test.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.queryLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.query.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.typeLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.type.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.normalLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.normal.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.otherLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.other.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.calculateLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.calculate.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.apiLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.api.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.logger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.error.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
        new WinstonDaily({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.combined.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new Winston.transports.Console({
          format: combine(colorize(), formatted),
        }),
      );
    }
  }
}

//   public static getInstance() {
//     if (!this.instance) {
//       this.instance = new LoggerProvider();
//     }

//     return {
//       Logger: this.instance.logger,
//       AuthLogger: this.instance.authLogger,
//       NormalLogger: this.instance.normalLogger,
//       OtherLogger: this.instance.otherLogger,
//       CalculateLogger: this.instance.calculateLogger,
//       ApiLogger: this.instance.apiLogger,
//       TypeLogger: this.instance.typeLogger,
//       QueryLogger: this.instance.queryLogger,
//       TestLogger: this.instance.testLogger,
//       UserLogger: this.instance.userLogger,
//     };
//   }
// }

// const {
//   Logger,
//   NormalLogger,
//   AuthLogger,
//   OtherLogger,
//   CalculateLogger,
//   TypeLogger,
//   ApiLogger,
//   QueryLogger,
//   TestLogger,
//   UserLogger,
// } = LoggerProvider.getInstance();

// export {
//   Logger,
//   NormalLogger,
//   AuthLogger,
//   OtherLogger,
//   CalculateLogger,
//   TypeLogger,
//   ApiLogger,
//   QueryLogger,
//   TestLogger,
//   UserLogger,
// };
