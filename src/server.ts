import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from 'modules/app.module';

export const bootstrap = async () => {
  const { ScrapeObserver } = await import('libraries/manager.lib');

  const manager = ScrapeObserver.getInstance();

  const date = new Date().toLocaleTimeString();

  manager.start();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['debug', 'warn', 'error'] });

  const port = Number(process.env.APP_PORT!);

  app.use(helmet());
  app.enableCors();
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableShutdownHooks();

  await app.listen(port);

  const message = `Listening On ${port}`;
  const wrapper = '@'.repeat(message.length);

  Logger.log(wrapper);
  Logger.log(`Scrape Manager Start: ${date}`);
  Logger.log(message);
  Logger.log(wrapper);
};
