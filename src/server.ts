import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import helmet from 'helmet';
import { AppModule } from 'modules/app.module';
import { shutdown } from 'utils/shutdown.utils';

export const bootstrap = async () => {
  const { ScrapeObserver } = await import('libraries/manager.lib');
  const { NestFactory } = await import('@nestjs/core');

  const date = new Date().toLocaleTimeString();

  const manager = ScrapeObserver.getInstance();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'debug', 'warn', 'error'],
  });

  const port = Number(process.env.APP_PORT!);

  app.use(helmet());
  app.enableCors();
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableShutdownHooks();
  // app.useLogger(app.get(LoggerModule));
  app.use(
    session({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      // TODO Save Session into Redis or Cache Server
      // store: new RedisStore(),
      cookie: { maxAge: 1800000, secure: true },
    }),
  );

  await app.listen(port, '0.0.0.0');

  const message = `Listening On ${port}`;
  const wrapper = '@'.repeat(message.length);

  Logger.log(wrapper);
  Logger.log(`Scrape Manager Start: ${date}`);
  Logger.log(message);
  Logger.log(wrapper);

  process.on('SIGTERM', () => shutdown(app));

  manager.start();
};
